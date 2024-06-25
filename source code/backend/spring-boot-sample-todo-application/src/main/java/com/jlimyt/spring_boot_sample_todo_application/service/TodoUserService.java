package com.jlimyt.spring_boot_sample_todo_application.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jlimyt.spring_boot_sample_todo_application.model.TodoUser;
import com.jlimyt.spring_boot_sample_todo_application.repository.TodoUserRepository;

@Service
@Transactional
public class TodoUserService extends BaseService<TodoUser, Long> {
	TodoUserRepository todoUserRepository;
	
	public TodoUserService(TodoUserRepository todoUserRepository) {
		super(todoUserRepository);
		this.todoUserRepository = todoUserRepository;
	}
}
