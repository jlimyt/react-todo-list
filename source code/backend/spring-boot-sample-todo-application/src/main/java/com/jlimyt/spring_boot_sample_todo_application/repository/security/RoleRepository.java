package com.jlimyt.spring_boot_sample_todo_application.repository.security;

import com.jlimyt.spring_boot_sample_todo_application.model.security.Role;
import com.jlimyt.spring_boot_sample_todo_application.repository.BaseRepository;

import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends BaseRepository<Role, Long> {
	public Role findByCode(String code);

	public Role findByCodeAndIdNot(String code, Long id);
}
