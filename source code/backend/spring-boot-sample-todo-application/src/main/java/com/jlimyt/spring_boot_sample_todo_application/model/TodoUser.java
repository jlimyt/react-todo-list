package com.jlimyt.spring_boot_sample_todo_application.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.Comment;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;
import org.hibernate.annotations.SQLRestriction;

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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Table
@Entity
@SQLRestriction("active IS TRUE")
public class TodoUser extends BaseModel<Long> {
	private static final long serialVersionUID = 6685201307217597992L;

	@ManyToOne
	@JoinColumn(updatable = false)
	@Schema(description = "The id of login user")
	@Comment("The id of login user")
	@JsonIncludeProperties({"id", "username", "displayName"})
	@NotFound(action = NotFoundAction.IGNORE)
	private LoginUser loginUser;

	@JsonIgnore
	@ManyToOne
	@JoinColumn(nullable = false, updatable = false)
	@Schema(description = "The id of todo")
	@Comment("The id of todo")
	private Todo todo;

	@Column
	@JsonSerialize(using = LocalDateTimeSerializer.class)
	@JsonDeserialize(using = LocalDateTimeDeserializer.class)
	@Schema(description = "User has read this todo at")
	@Comment("User has read this todo at")
	private LocalDateTime readAt;

	@Column
	@JsonSerialize(using = LocalDateTimeSerializer.class)
	@JsonDeserialize(using = LocalDateTimeDeserializer.class)
	@Schema(description = "User has marked this todo as completed at")
	@Comment("User has marked this todo as completed at")
	private LocalDateTime completedAt;

	public LoginUser getLoginUser() {
		return this.loginUser;
	}

	public LocalDateTime getReadAt() {
		return this.readAt;
	}
}
