package com.jlimyt.spring_boot_sample_todo_application.controller.security;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jlimyt.spring_boot_sample_todo_application.controller.BaseController;
import com.jlimyt.spring_boot_sample_todo_application.model.security.Role;
import com.jlimyt.spring_boot_sample_todo_application.service.security.RoleService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.PostConstruct;

@RestController
@RequestMapping("/roles")
@Tag(name = "User Role", description = "Endpoints for managing user role")
public class RoleController extends BaseController<Role, Long, RoleService> {
	RoleService roleService;

	public RoleController(RoleService roleService) {
//		super(roleService);
		this.roleService = roleService;
	}

	@Override
	@PostConstruct
	public void setControllerPrefix() {
		super.controllerPrefix = "ROLE";
	}
}
