package com.jlimyt.spring_boot_sample_todo_application.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNPROCESSABLE_ENTITY)
public class UnauthorizedException extends RuntimeException {
	private static final long serialVersionUID = -2923293298534783015L;

	public UnauthorizedException() {
		this("");
	}

	public UnauthorizedException(String message) {
		super(message);
	}
}
