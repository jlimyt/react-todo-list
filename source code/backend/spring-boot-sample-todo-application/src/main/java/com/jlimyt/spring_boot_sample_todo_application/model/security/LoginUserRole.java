package com.jlimyt.spring_boot_sample_todo_application.model.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.jlimyt.spring_boot_sample_todo_application.model.BaseModel;

import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import org.hibernate.annotations.Comment;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;
import org.hibernate.annotations.SQLRestriction;

@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table
@SQLRestriction("active IS TRUE")
public class LoginUserRole extends BaseModel<Long> {
	private static final long serialVersionUID = 1124875119371591915L;

	@JsonIgnore
	@ManyToOne(optional = false)
	@JoinColumn(nullable = false)
	@Schema(description = "The id of login user who own the role")
	@Comment("The id of login user who own the role")
	// @NotFound((action = NotFoundAction.IGNORE)
	private LoginUser loginUser;

	@ManyToOne(optional = false)
	@JoinColumn(nullable = false)
	@JsonIgnoreProperties("rolePrivs")
	@Schema(description = "The id of role")
	@Comment("The id of role")
	@NotFound(action = NotFoundAction.IGNORE)
	private Role role;
}
