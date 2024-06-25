package com.jlimyt.spring_boot_sample_todo_application.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.collections4.ListUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jlimyt.spring_boot_sample_todo_application.model.Todo;
import com.jlimyt.spring_boot_sample_todo_application.model.TodoUser;
import com.jlimyt.spring_boot_sample_todo_application.model.security.LoginUser;
import com.jlimyt.spring_boot_sample_todo_application.repository.TodoRepository;
import com.jlimyt.spring_boot_sample_todo_application.repository.security.LoginUserRepository;
import com.jlimyt.spring_boot_sample_todo_application.util.CommonUtil;

@Service
@Transactional
public class TodoService extends BaseService<Todo, Long> {
	TodoRepository todoRepository;

	@Autowired
	LoginUserRepository loginUserRepository;

	public TodoService(TodoRepository todoRepository) {
		super(todoRepository);
		this.todoRepository = todoRepository;
	}

	@Override
	protected <S extends Todo> void preProcessSave(S entity) {
		List<LoginUser> loginUsers =
				switch (entity.getType()) {
					case ALL -> loginUserRepository.findAll();
					case ROLE -> loginUserRepository.findByRoleAndEnable(
							entity.getRole().getId(), Boolean.TRUE);
					default -> ListUtils.emptyIfNull(entity.getTodoUsers()).stream()
							.map(TodoUser::getLoginUser)
							.toList();
				};
		List<TodoUser> todoUsers = ListUtils.emptyIfNull(loginUsers).stream()
				.map(loginUser ->
						TodoUser.builder().loginUser(loginUser).todo(entity).build())
				.collect(Collectors.toList());
		entity.setTodoUsers(todoUsers);
		entity.setOwner(LoginUser.builder().id(CommonUtil.getLoginUserId()).build());
		entity.setSentAt(LocalDateTime.now());

		super.preProcessSave(entity);
	}

	@Override
	protected <S extends Todo> void preProcessUpdate(S entity, S entityInDb) {
		super.preProcessUpdate(entity, entityInDb);
		entity.setTodoComments(entityInDb.getTodoComments());
		entity.setTodoUsers(entityInDb.getTodoUsers());
	}

	@Override
	protected <S extends Todo> void preProcessUpdateAction(S entity) {
		super.preProcessUpdateAction(entity);
		ListUtils.emptyIfNull(entity.getTodoComments())
				.forEach(todoComment -> todoComment.setTodo(entity));
		ListUtils.emptyIfNull(entity.getTodoUsers()).forEach(todoUser -> todoUser.setTodo(entity));
	}

	public Long getUnreadCount(Long loginUserId) {
		return todoRepository.getUnreadCount(loginUserId);
	}

	public Long getIncompleteCount(Long loginUserId) {
		return todoRepository.getIncompleteCount(loginUserId);
	}
}
