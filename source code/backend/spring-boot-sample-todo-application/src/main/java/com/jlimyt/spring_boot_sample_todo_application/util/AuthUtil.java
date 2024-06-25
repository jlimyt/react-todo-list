package com.jlimyt.spring_boot_sample_todo_application.util;

import com.jlimyt.spring_boot_sample_todo_application.model.jwt.CustomUser;
import com.jlimyt.spring_boot_sample_todo_application.model.security.LoginUser;
import com.jlimyt.spring_boot_sample_todo_application.repository.security.LoginUserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AuthUtil {
	private static LoginUserRepository loginUserRepository;

	AuthUtil(LoginUserRepository loginUserRepository) {
		super();
		AuthUtil.loginUserRepository = loginUserRepository;
	}

	@SuppressWarnings("unchecked")
	public static Long getUserId() {
		return Optional.ofNullable(SecurityContextHolder.getContext())
				.map(SecurityContext::getAuthentication)
				.filter(Authentication::isAuthenticated)
				.map(Authentication::getPrincipal)
				.map(x -> (CustomUser<Long>) x)
				.map(CustomUser::getId)
				.orElse(null);
	}

	public static LoginUser getUser() {
		return Optional.ofNullable(getUserId())
				.map(x -> loginUserRepository.getReferenceById(x))
				.orElse(null);
	}
}
