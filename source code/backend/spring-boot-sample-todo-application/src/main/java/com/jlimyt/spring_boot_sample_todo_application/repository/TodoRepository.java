package com.jlimyt.spring_boot_sample_todo_application.repository;

import com.jlimyt.spring_boot_sample_todo_application.model.Todo;
import com.jlimyt.spring_boot_sample_todo_application.repository.BaseRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TodoRepository extends BaseRepository<Todo, Long> {
	@Query(
			"SELECT count(1) FROM Todo t WHERE t.completedAt IS NULL"
					+ " AND t.id IN (SELECT tu.todo.id FROM TodoUser tu WHERE tu.loginUser.id = :loginUserId AND tu.readAt IS NULL)")
	public Long getUnreadCount(Long loginUserId);

	@Query(
			"SELECT count(1) FROM Todo t WHERE t.completedAt IS NULL"
					+ " AND t.id IN (SELECT tu.todo.id FROM TodoUser tu WHERE tu.loginUser.id = :loginUserId AND tu.completedAt IS NULL)")
	public Long getIncompleteCount(Long loginUserId);
}
