package com.jlimyt.spring_boot_sample_todo_application.controller.security;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jlimyt.spring_boot_sample_todo_application.controller.BaseController;
import com.jlimyt.spring_boot_sample_todo_application.model.security.LoginUser;
import com.jlimyt.spring_boot_sample_todo_application.model.security.LoginUserRole;
import com.jlimyt.spring_boot_sample_todo_application.model.security.Role;
import com.jlimyt.spring_boot_sample_todo_application.service.security.LoginUserService;
import com.jlimyt.spring_boot_sample_todo_application.service.security.RoleService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/loginUsers")
@CrossOrigin("*")
@Tag(name = "Login User", description = "Endpoints for managing login user account")
public class LoginUserController extends BaseController<LoginUser, Long, LoginUserService> {
	@Autowired
	LoginUserService loginUserService;
	@Autowired
	RoleService roleService;
	@Autowired
	PasswordEncoder passwordEncoder;

	@Transactional
	@PostMapping(value = "/registration")
	@Operation(
			summary = "Registration for user account",
			description = "Registration for user account",
			responses = {
				@ApiResponse(responseCode = "200", description = "Success"),
				@ApiResponse(responseCode = "400", description = "Bad request"),
				@ApiResponse(
						responseCode = "403",
						description = "Forbidden - Registration is not allow"),
				@ApiResponse(responseCode = "500", description = "Internal server error")
			})
	public ResponseEntity<?> registration(
			@RequestBody LoginUser loginUser)
			throws Exception {

		loginUser.setEnable(Optional.ofNullable(loginUser.getEnable()).orElse(true));
//		loginUser.setPassword(passwordEncoder.encode(loginUser.getPassword()));
		List<LoginUserRole> loginUserRoles = new ArrayList<>();

		Role role = roleService.getOne(1L);
		if(role != null) {
			LoginUserRole loginUserRole = new LoginUserRole(loginUser, role);
			loginUserRoles.add(loginUserRole);
			loginUser.setLoginUserRoles(loginUserRoles);
		}
		loginUser = baseService.save(loginUser);

//		return ResponseEntity.internalServerError().build();
		return ResponseEntity.ok().build();
	}

	@GetMapping("/internalUsers")
	@Operation(
			summary = "List User for the recipients",
			description = "List User for the recipients",
			parameters = {
				@Parameter(
						name = "pageable",
						description = "The pageable contains sort object (page, sort).")
			},
			responses = {
				@ApiResponse(responseCode = "200", description = "Success"),
				@ApiResponse(responseCode = "400", description = "Bad request"),
				@ApiResponse(responseCode = "451", description = "No value present for complete"),
				@ApiResponse(responseCode = "500", description = "Internal server error")
			})
	@SecurityRequirement(name = "Bearer Authentication")
	public ResponseEntity<List<LoginUser>> getInternalUsers(Pageable pageable) {
		return ResponseEntity.ok(loginUserService.findAllInternalUsers(pageable));
	}

	@Override
	public void setControllerPrefix() {
		super.controllerPrefix = "LOGINUSER";
	}
}