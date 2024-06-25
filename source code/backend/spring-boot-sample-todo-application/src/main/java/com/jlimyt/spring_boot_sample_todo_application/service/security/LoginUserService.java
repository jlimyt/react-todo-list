package com.jlimyt.spring_boot_sample_todo_application.service.security;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.ListUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jlimyt.spring_boot_sample_todo_application.model.security.LoginUser;
import com.jlimyt.spring_boot_sample_todo_application.model.security.LoginUserRole;
import com.jlimyt.spring_boot_sample_todo_application.repository.BaseRepository;
import com.jlimyt.spring_boot_sample_todo_application.repository.security.LoginUserRepository;
import com.jlimyt.spring_boot_sample_todo_application.service.BaseService;


@Service("loginUserService")
public class LoginUserService extends BaseService<LoginUser, Long> {
	public LoginUserService(BaseRepository<LoginUser, Long> repository, PasswordEncoder passwordEncoder2) {
		super(repository);
	}

	@Autowired
	LoginUserRepository loginUserRepository;
	@Autowired
	PasswordEncoder passwordEncoder;

	public LoginUser loadUserByUsername(String username) {
		LoginUser loginUser = loginUserRepository.findByUsername(username);
		return loginUser;
	}

	@Override
	protected void preProcessSave(LoginUser loginUser) {
		super.preProcessSave(loginUser);

		loginUser.setEnable(Optional.ofNullable(loginUser.getEnable()).orElse(true));
		loginUser.setPassword(passwordEncoder.encode(loginUser.getPassword()));List<LoginUserRole> loginUserRoles = new ArrayList<>();

		for (LoginUserRole loginUserRole :
				CollectionUtils.emptyIfNull(loginUser.getLoginUserRoles())) {
			Optional<LoginUserRole> loginUserRoleEo = loginUser.getLoginUserRoles().stream()
					.filter(x ->
							loginUserRole.getRole().getId().equals(x.getRole().getId()))
					.findAny();
			loginUserRoles.add(loginUserRoleEo.orElse(loginUserRole));
		}

		loginUser.setLoginUserRoles(loginUserRoles);
	}

//	@Override
//	protected void preProcessUpdate(S entity, S entityInDb) throws Exception {
//		super.preProcessUpdate(entity, entityInDb);
//		entity.setPassword(entityInDb.getPassword());
//
//		List<LoginUserRole> loginUserRoles = new ArrayList<>();
//
//		for (LoginUserRole loginUserRole :
//				CollectionUtils.emptyIfNull(entity.getLoginUserRoles())) {
//			Optional<LoginUserRole> loginUserRoleEo = entityInDb.getLoginUserRoles().stream()
//					.filter(x ->
//							loginUserRole.getRole().getId().equals(x.getRole().getId()))
//					.findAny();
//			loginUserRoles.add(loginUserRoleEo.orElse(loginUserRole));
//		}
//
//		entity.setLoginUserRoles(loginUserRoles);
//	}

	@Override
	protected void preProcessUpdateAction(LoginUser loginUser) {
		super.preProcessUpdateAction(loginUser);
		ListUtils.emptyIfNull(loginUser.getLoginUserRoles())
				.forEach(loginUserRole -> loginUserRole.setLoginUser(loginUser));
	}

	public boolean existByUsername(String username, Long id) {
		LoginUser loginUser = (id == null)
				? loginUserRepository.findByUsername(username)
				: loginUserRepository.findByUsernameAndIdNot(username, id);
		return loginUser != null;
	}

	public LoginUser findByUsername(String username) {
		return loginUserRepository.findByUsername(username);
	}
	;

	public LoginUser findByUsernameOrEmail(String username, String email) {
		return loginUserRepository.findByUsernameOrEmail(username, email);
	}

	public LoginUser findByUsernameAndEnable(String username, Boolean enable) {
		return loginUserRepository.findByUsernameAndEnable(username, enable);
	}

	public List<LoginUser> findAllInternalUsers(Pageable pageable) {
		return loginUserRepository.findAllInternalUsers(pageable);
	}

}
