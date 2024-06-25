package com.jlimyt.spring_boot_sample_todo_application.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.apache.commons.collections4.ListUtils;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;
import org.hibernate.annotations.SQLRestriction;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.jlimyt.spring_boot_sample_todo_application.model.security.LoginUser;
import com.jlimyt.spring_boot_sample_todo_application.model.security.Role;
import com.jlimyt.spring_boot_sample_todo_application.util.CommonUtil;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Setter
@Getter
@SuperBuilder
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Table
@Entity
@SQLRestriction("active IS TRUE")
public class Todo extends BaseModel<Long> {
	private static final long serialVersionUID = 4441215231758379472L;

	public enum Type {
		ALL,
		ROLE,
		USER
	}

	public enum Category {
		GENERAL,
		INTERNAL,
		EXTERNAL,
		MEETING,
		FOLLOWUP,
		OTHER
	}

	public enum Priority {
		NA,
		LOW,
		MEDIUM,
		HIGH,
		URGENT
	}

	public enum SearchMode {
		PENDING,
		COMPLETED
	}

	@Column(nullable = false, updatable = false)
	@JsonSerialize(using = LocalDateTimeSerializer.class)
	@JsonDeserialize(using = LocalDateTimeDeserializer.class)
	@JsonFormat(pattern = "dd/MM/yyyy HH:mm")
	@Schema(description = "Sent at")
	@Comment("Sent at")
	private LocalDateTime sentAt;

	@Column
	@JsonSerialize(using = LocalDateTimeSerializer.class)
	@JsonDeserialize(using = LocalDateTimeDeserializer.class)
	@Schema(description = "Owner has marked this todo as completed at")
	@JsonFormat(pattern = "dd/MM/yyyy HH:mm")
	@Comment("Owner has marked this todo as completed at")
	private LocalDateTime completedAt;

	@Column(nullable = false, updatable = false)
	@Schema(description = "All user need to be marked completed to update this todo to completed")
	@Comment("All user need to be marked completed to update this todo to completed")
	private Boolean requiredAllCompleted;

	@Column
	@JsonSerialize(using = LocalDateTimeSerializer.class)
	@JsonDeserialize(using = LocalDateTimeDeserializer.class)
	@Schema(description = "Deadline of the todo")
	@Comment("Deadline of the todo")
	@JsonFormat(pattern = "dd/MM/yyyy HH:mm")
	private LocalDateTime deadlineAt;

	@Column(length = 10, updatable = false)
	@Schema(description = "Type of todo [ALL, ROLE, USER]")
	@Comment("Type of todo [ALL, ROLE, USER]")
	@Enumerated(EnumType.STRING)
	private Type type;

	@Column(length = 10, updatable = false)
	@Schema(description = "Category of todo")
	@Comment("Category of todo")
	@Enumerated(EnumType.STRING)
	private Category category;

	@Column(length = 10, updatable = false)
	@Schema(description = "Priority of todo")
	@Comment("Priority of todo")
	@Enumerated(EnumType.STRING)
	private Priority priority;

	@ManyToOne
	@JoinColumn(nullable = false, updatable = false)
	@Schema(description = "The id of todo owner")
	@Comment("The id of todo owner")
	@JsonIncludeProperties({"id", "username", "displayName"})
	@NotFound(action = NotFoundAction.IGNORE)
	private LoginUser owner;

	@ManyToOne
	@JoinColumn(updatable = false)
	@Schema(description = "The id of role")
	@Comment("The id of role")
	@JsonIncludeProperties({"id", "description", "code"})
	@NotFound(action = NotFoundAction.IGNORE)
	private Role role;

	@Schema(description = "Content")
	@Comment("Content")
	private String content;

	public Boolean getRead() {
		Long currentUserId = CommonUtil.getLoginUserId();
		return ListUtils.emptyIfNull(this.todoUsers).stream()
				.filter(todoUser -> currentUserId.equals(todoUser.getLoginUser().getId()))
				.map(TodoUser::getReadAt)
				.anyMatch(x -> x != null);
	}

	@NotNull
	@Size(max = 50)
	@Schema(description = "Title")
	@Comment("Title of the todo item")
	private String title;

	@Valid
	@OneToMany(
			mappedBy = "todo",
			orphanRemoval = true,
			cascade = {CascadeType.PERSIST, CascadeType.MERGE},
			fetch = FetchType.EAGER)
	@OrderBy("id")
	private List<TodoUser> todoUsers;

	@Valid
	@OneToMany(mappedBy = "todo", fetch = FetchType.EAGER)
	@OrderBy("commentedAt")
	private List<TodoComment> todoComments;

	@Transient
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	private transient SearchMode searchMode;

	@Transient
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	private transient List<Category> searchCategories;
}
