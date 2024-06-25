package com.jlimyt.spring_boot_sample_todo_application.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jlimyt.spring_boot_sample_todo_application.model.TodoComment;
import com.jlimyt.spring_boot_sample_todo_application.repository.TodoCommentRepository;

@Service
@Transactional
public class TodoCommentService extends BaseService<TodoComment, Long> {
	TodoCommentRepository todoCommentRepository;

	public TodoCommentService(TodoCommentRepository todoCommentRepository) {
		super(todoCommentRepository);
		this.todoCommentRepository = todoCommentRepository;
	}
}
