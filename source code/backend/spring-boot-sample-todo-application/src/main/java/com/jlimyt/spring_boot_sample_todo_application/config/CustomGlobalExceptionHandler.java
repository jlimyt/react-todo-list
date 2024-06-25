package com.jlimyt.spring_boot_sample_todo_application.config;

import org.hibernate.HibernateException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.context.request.WebRequest;

import com.jlimyt.spring_boot_sample_todo_application.exception.UnauthorizedException;

@ControllerAdvice
public class CustomGlobalExceptionHandler  {
	@ResponseBody
	@ExceptionHandler(
			value = {
				HttpServerErrorException.InternalServerError.class,
				NullPointerException.class,
				IndexOutOfBoundsException.class,
				IllegalArgumentException.class,
				HibernateException.class
			})
	protected ResponseEntity<?> handleException(RuntimeException ex, WebRequest request) {
		return handleException(ex, request);
	}

	@ResponseBody
	@ExceptionHandler(value = UnauthorizedException.class)
	protected ResponseEntity<?> handleUnauthorizedException(
			UnauthorizedException ex, WebRequest request) {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

}
