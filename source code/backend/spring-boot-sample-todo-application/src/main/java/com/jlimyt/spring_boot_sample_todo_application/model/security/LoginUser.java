package com.jlimyt.spring_boot_sample_todo_application.model.security;

import java.util.List;

import org.hibernate.annotations.Comment;
import org.hibernate.annotations.SQLRestriction;

import com.jlimyt.spring_boot_sample_todo_application.model.BaseModel;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("null")
@Entity
@Table(name="login_user")
@AttributeOverrides({
	@AttributeOverride(
			name = "createdBy",
			column = @Column(name = "created_by", nullable = true, precision = 19)),
	@AttributeOverride(
			name = "modifiedBy",
			column = @Column(name = "modified_by", nullable = true, precision = 19))
})
@SQLRestriction("active IS TRUE")
public class LoginUser extends BaseModel<Long> {
	private static final long serialVersionUID = -7868757410105119594L;

	public static final Long SYSTEMID = 1L;

	@Column(length = 100)
	@Schema(description = "Username")
	@Comment("Username")
	private String username;

	@Column
	@Schema(description = "Password")
	@Comment("Password")
	private String password;

	@Column(length = 100)
	@Schema(description = "Display name")
	@Comment("Display name")
	private String displayName;

	@Valid
	@OneToMany(mappedBy = "loginUser", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@OrderBy("id")
	private List<LoginUserRole> loginUserRoles;

	@Email
	@Column(length = 200)
	@Schema(description = "Email")
	@Comment("Email")
	private String email;


	@Schema(description = "Indicates whether the account is enable")
	@Comment("Indicates whether the account is enable")
	@Builder.Default
	private Boolean enable=true;

	public LoginUser(Long id) {
		super();
		this.id = id;
	}
}
