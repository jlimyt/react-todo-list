package com.jlimyt.spring_boot_sample_todo_application.service.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.jlimyt.spring_boot_sample_todo_application.model.jwt.CustomUser;
import com.jlimyt.spring_boot_sample_todo_application.model.security.LoginUser;
import com.jlimyt.spring_boot_sample_todo_application.repository.security.LoginUserRepository;

import jakarta.annotation.Resource;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class JwtUserDetailsService implements UserDetailsService {
	@Resource
	LoginUserRepository loginUserRepository;

	@PersistenceContext
	protected EntityManager entityManager;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		LoginUser user = loginUserRepository.findByUsername(username);

//    Priv isn't applicable in this project
//
//		List<String> userPrivs = user.getLoginUserRoles().stream()
//				.map(LoginUserRole::getRole)
//				.distinct()
//				.collect(Collectors.toList());

		return new CustomUser<Long>(
				user.getId(),
				user.getUsername(),
				user.getPassword());
	}
}
