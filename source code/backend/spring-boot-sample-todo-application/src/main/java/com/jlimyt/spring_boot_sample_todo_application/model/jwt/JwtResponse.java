package com.jlimyt.spring_boot_sample_todo_application.model.jwt;

import java.util.List;

public record JwtResponse(
		Long id,
		String username,
		String name,
		String token,
		List<JwtRoleResponse> roles) {
	public record JwtRoleResponse(String code, String description) {}
}
