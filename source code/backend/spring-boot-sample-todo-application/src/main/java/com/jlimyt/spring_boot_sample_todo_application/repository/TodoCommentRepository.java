package com.jlimyt.spring_boot_sample_todo_application.repository;

import com.jlimyt.spring_boot_sample_todo_application.model.TodoComment;
import com.jlimyt.spring_boot_sample_todo_application.repository.BaseRepository;

import org.springframework.stereotype.Repository;

@Repository
public interface TodoCommentRepository extends BaseRepository<TodoComment, Long> {}
