package com.jlimyt.spring_boot_sample_todo_application.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.Comment;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;
import org.hibernate.annotations.SQLRestriction;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.jlimyt.spring_boot_sample_todo_application.model.security.LoginUser;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Table
@Entity
@SQLRestriction("active IS TRUE")
public class TodoComment extends BaseModel<Long> {
	private static final long serialVersionUID = 8695777044585246458L;

	@JsonIgnore
	@ManyToOne(optional = false)
	@JoinColumn(nullable = true, updatable = false)
	@Schema(description = "The id of todo")
	@Comment("The id of todo")
	// @NotFound((action = NotFoundAction.IGNORE)
	private Todo todo;

	@ManyToOne(optional = false)
	@JoinColumn(nullable = true, updatable = false)
	@Schema(description = "The id of login user")
	@Comment("The id of login user")
	@NotFound(action = NotFoundAction.IGNORE)
	@JsonIncludeProperties({"id", "username", "displayName"})
	private LoginUser loginUser;

	@Column(nullable = true, updatable = false)
	@NotNull
	@JsonSerialize(using = LocalDateTimeSerializer.class)
	@JsonDeserialize(using = LocalDateTimeDeserializer.class)
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
	@Schema(description = "Commented at")
	@Comment("Commented at")
	private LocalDateTime commentedAt;

	@Schema(description = "Comment on todo")
	@Comment("Comment on todo")
	private String comment;
}
