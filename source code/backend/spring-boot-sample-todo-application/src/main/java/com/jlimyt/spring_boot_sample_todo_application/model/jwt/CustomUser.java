package com.jlimyt.spring_boot_sample_todo_application.model.jwt;

import java.util.Collections;

import org.springframework.security.core.userdetails.User;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class CustomUser<T> extends User {
	private static final long serialVersionUID = -1447845771345266551L;

	private T id;

	public CustomUser(
			T id,
			String username,
			String password) {
		super(username, password, true, true, true, true, Collections.emptyList());
		this.id = id;
	}
}
