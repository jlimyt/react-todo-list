package com.jlimyt.spring_boot_sample_todo_application.repository.security;

import java.util.List;

import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jlimyt.spring_boot_sample_todo_application.model.security.LoginUser;
import com.jlimyt.spring_boot_sample_todo_application.repository.BaseRepository;

@Primary
@Repository("loginUserRepository")
public interface LoginUserRepository extends BaseRepository<LoginUser, Long>{
	/*
	 * customized the @Query to bypass JPA generate the type as filter criteria by
	 * default
	 */
	@Query("SELECT l from LoginUser l WHERE l.username = :username")
	public LoginUser findByUsername(String username);

	/*
	 * customized the @Query to bypass JPA generate the type as filter criteria by
	 * default
	 */
	@Query("SELECT l from LoginUser l WHERE l.username = :username AND l.id != :id")
	public LoginUser findByUsernameAndIdNot(String username, Long id);

	@Query("SELECT l from LoginUser l " + " WHERE l.enable = :enable AND l.username = :username")
	public LoginUser findByUsernameAndEnable(String username, Boolean enable);

	@Query("SELECT l from LoginUser l "
			+ " WHERE l.id IN ("
			+ "   SELECT lur.loginUser.id "
			+ "		FROM LoginUserRole lur"
			+ "     INNER JOIN Role r"
			+ "     ON lur.role.id = r.id"
			+ "		WHERE r.id = :roleId"
			+ "     AND lur.active = TRUE"
			+ ") AND l.enable = :enable")
	public List<LoginUser> findByRoleAndEnable(Long roleId, Boolean enable);

	@Query("SELECT l from LoginUser l "
			+ " WHERE l.id IN ("
			+ "   SELECT lur.loginUser.id "
			+ "		FROM LoginUserRole lur"
			+ "     INNER JOIN Role r"
			+ "     ON lur.role.id = r.id"
			+ "     AND r.active = TRUE"
			+ "		WHERE r.code = :roleCode"
			+ "     AND lur.active = TRUE"
			+ ") AND l.enable = :enable")
	public List<LoginUser> findByRoleCodeAndEnable(String roleCode, Boolean enable);

	public LoginUser findByUsernameOrEmail(String username, String email);

	@Query("SELECT l from LoginUser l " + " WHERE l.enable = true")
	public List<LoginUser> findAllInternalUsers(Pageable pageable);
}
