package com.jlimyt.spring_boot_sample_todo_application.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.collections4.ListUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jlimyt.spring_boot_sample_todo_application.model.Todo;
import com.jlimyt.spring_boot_sample_todo_application.model.TodoComment;
import com.jlimyt.spring_boot_sample_todo_application.model.TodoUser;
import com.jlimyt.spring_boot_sample_todo_application.model.security.LoginUser;
import com.jlimyt.spring_boot_sample_todo_application.service.TodoCommentService;
import com.jlimyt.spring_boot_sample_todo_application.service.TodoService;
import com.jlimyt.spring_boot_sample_todo_application.service.TodoUserService;
import com.jlimyt.spring_boot_sample_todo_application.util.CommonUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

@RestController
@RequestMapping("/todos")
@Tag(name = "Todo", description = "Endpoints for managing todo")
public class TodoController extends BaseController<Todo, Long, TodoService> {
	TodoService todoService;

	@Autowired
	TodoCommentService todoCommentService;

	@Autowired
	TodoUserService todoUserService;

	public TodoController(TodoService todoService) {
//		super(todoService);
		this.todoService = todoService;
	}

	@Override
	@PostConstruct
	public void setControllerPrefix() {
		super.controllerPrefix = "TODO";
	}

	@Override
	protected List<Predicate> getPredicates(
			Root<Todo> root, CriteriaQuery<?> query, CriteriaBuilder builder, Todo model) {
		List<Predicate> predicates = new ArrayList<>();

		Long loginUserId = CommonUtil.getLoginUserId();
		Subquery<Todo> subQuery = query.subquery(Todo.class);
		Root<TodoUser> todoUserRoot = subQuery.from(TodoUser.class);
		Join<TodoUser, Todo> todoUserJoin = todoUserRoot.join("todo");

		subQuery.select(todoUserJoin)
				.where(builder.equal(todoUserRoot.get("loginUser").get("id"), loginUserId));
		predicates.add(builder.in(root).value(subQuery));

		if (model.getSearchCategories() != null) {
			predicates.add(builder.in(root.get("category")).value(model.getSearchCategories()));
		}

		if (model.getSearchMode() != null) {
			switch (model.getSearchMode()) {
				case PENDING -> predicates.add(builder.isNull(root.get("completedAt")));
				case COMPLETED -> predicates.add(builder.isNotNull(root.get("completedAt")));
			}
		}

		return predicates;
	}

	// Override the get to implement the read logic
	@Override
	public ResponseEntity<Todo> find(@PathVariable Long id) {
		Todo todo = todoService.findById(id);
		Long currentUserId = CommonUtil.getLoginUserId();

		Optional<TodoUser> todoUserEo = ListUtils.emptyIfNull(todo.getTodoUsers()).stream()
				.filter(todoUser -> todoUser.getLoginUser().getId().equals(currentUserId))
				.findAny();

		if (todoUserEo.isPresent()) {
			TodoUser todoUser = todoUserEo.get();
			if (todoUser.getReadAt() == null) {
				todoUser.setReadAt(LocalDateTime.now());
				todoUserService.update(todoUser);
			}
		}

		return super.getOne(id);
	}

	@PostMapping("/{id}/complete")
	@Operation(
			summary = "Mark completed of a todo",
			description = "Mark completed of a todo",
			parameters = {@Parameter(name = "id", description = "The id of the record to find.")},
			responses = {
				@ApiResponse(responseCode = "200", description = "Success"),
				@ApiResponse(responseCode = "400", description = "Bad request"),
				@ApiResponse(responseCode = "451", description = "No value present for complete"),
				@ApiResponse(responseCode = "500", description = "Internal server error")
			})
	@SecurityRequirement(name = "Bearer Authentication")
	public ResponseEntity<?> complete(@PathVariable Long id) throws Exception {
		Todo todo = todoService.findById(id);
		Long currentUserId = CommonUtil.getLoginUserId();

		TodoUser todoUser = ListUtils.emptyIfNull(todo.getTodoUsers()).stream()
				.filter(x -> x.getLoginUser().getId().equals(currentUserId)
						&& x.getCompletedAt() == null)
				.findAny()
				.orElseThrow();

		LocalDateTime currentTime = LocalDateTime.now();

		todoUser.setCompletedAt(currentTime);
		if (!todo.getRequiredAllCompleted()
				|| todo.getOwner().getId().equals(currentUserId)
				|| ListUtils.emptyIfNull(todo.getTodoUsers()).stream()
						.allMatch(x -> x.getCompletedAt() != null)) {
			todo.setCompletedAt(currentTime);
		}

		return ResponseEntity.ok(baseService.update(todo));
	}

	@PostMapping("/{id}/comment")
	@Operation(
			summary = "Mark completed of a todo",
			description = "Mark completed of a todo",
			parameters = {@Parameter(name = "id", description = "The id of the record to find.")},
			responses = {
				@ApiResponse(responseCode = "200", description = "Success"),
				@ApiResponse(responseCode = "400", description = "Bad request"),
				@ApiResponse(responseCode = "410", description = "Unauthorized"),
				@ApiResponse(responseCode = "500", description = "Internal server error")
			})
	@SecurityRequirement(name = "Bearer Authentication")
	public ResponseEntity<?> complete(@PathVariable Long id, @RequestBody String comment)
			throws Exception {
		Todo todo = todoService.findById(id);
		Long currentUserId = CommonUtil.getLoginUserId();

		Boolean hasPriv = ListUtils.emptyIfNull(todo.getTodoUsers()).stream()
				.anyMatch(x -> x.getLoginUser().getId().equals(currentUserId));

		if (!hasPriv) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		TodoComment todoComment = TodoComment.builder()
				.todo(todo)
				.loginUser(LoginUser.builder().id(currentUserId).build())
				.commentedAt(LocalDateTime.now())
				.comment(comment)
				.build();
		todoCommentService.save(todoComment);

		return ResponseEntity.ok(baseService.findById(id));
	}

	@GetMapping("/statistic")
//	@PreAuthorize("hasAuthority(#this.this.controllerPrefix + '_" + Privilege.READ + "')")
	@Operation(
			summary = "Todo statistic of a user",
			description = "Todo statistic of a user",
			responses = {
				@ApiResponse(responseCode = "200", description = "Success"),
				@ApiResponse(responseCode = "400", description = "Bad request"),
				@ApiResponse(responseCode = "451", description = "No value present for complete"),
				@ApiResponse(responseCode = "500", description = "Internal server error")
			})
	@SecurityRequirement(name = "Bearer Authentication")
	public ResponseEntity<?> statistic() {
		Long currentUserId = CommonUtil.getLoginUserId();

		return ResponseEntity.ok(Map.of(
				"unreadCount",
				todoService.getUnreadCount(currentUserId),
				"incompleteCount",
				todoService.getIncompleteCount(currentUserId)));
	}
}
