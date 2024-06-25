package com.jlimyt.spring_boot_sample_todo_application.model.security;

import java.util.List;

import org.hibernate.annotations.Comment;
import org.hibernate.annotations.SQLRestriction;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.jlimyt.spring_boot_sample_todo_application.model.BaseModel;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table
@SQLRestriction("active IS TRUE")
public class Role extends BaseModel<Long> {
	private static final long serialVersionUID = 3429429481717975581L;

	@NotNull
	@Size(max = 50)
	@Schema(description = "Role code")
	@Comment("Role code")
	private String code;

	@NotNull
	@Size(max = 400)
	@Schema(description = "Role description")
	@Comment("Role description")
	private String description;

	@JsonIgnore
	@OneToMany(mappedBy = "role")
	private List<LoginUserRole> userRole;

	public enum UserRoleCode {
		ADMIN,
		USER;
	}

	public Role(Long id) {
		this.id = id;
	}
}
