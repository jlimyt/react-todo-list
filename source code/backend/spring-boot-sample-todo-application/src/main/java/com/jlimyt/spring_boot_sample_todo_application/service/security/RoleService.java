package com.jlimyt.spring_boot_sample_todo_application.service.security;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jlimyt.spring_boot_sample_todo_application.model.security.Role;
import com.jlimyt.spring_boot_sample_todo_application.repository.security.RoleRepository;
import com.jlimyt.spring_boot_sample_todo_application.service.BaseService;

@Service
@Transactional
public class RoleService extends BaseService<Role, Long> {
	RoleRepository roleRepository;

	public RoleService(RoleRepository roleRepository) {
		super(roleRepository);
		this.roleRepository = roleRepository;
	}

	public boolean existByCode(String code, Long id) {
		Role role = (id == null)
				? roleRepository.findByCode(code)
				: roleRepository.findByCodeAndIdNot(code, id);
		return role != null;
	}

	@Override
	protected <S extends Role> void preProcessUpdate(S entity, S entityInDb) {
		super.preProcessUpdate(entity, entityInDb);

// # Role Priv isn't applicable in this sample project
//
//		List<RolePriv> rolePrivs = new ArrayList<>();
//
//		for (RolePriv rolePriv : CollectionUtils.emptyIfNull(entity.getRolePrivs())) {
//			Optional<RolePriv> rolePrivEo = entityInDb.getRolePrivs().stream()
//					.filter(x -> rolePriv.getPriv().getId().equals(x.getPriv().getId()))
//					.findAny();
//			rolePrivs.add(rolePrivEo.orElse(rolePriv));
//		}
//		entity.setRolePrivs(rolePrivs);
	}

	@Override
	protected <S extends Role> void preProcessUpdateAction(S role) {
		super.preProcessUpdateAction(role);
	}
}
