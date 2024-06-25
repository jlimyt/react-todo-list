package com.jlimyt.spring_boot_sample_todo_application.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.jlimyt.spring_boot_sample_todo_application.model.security.LoginUser;
import com.jlimyt.spring_boot_sample_todo_application.repository.security.LoginUserRepository;

@Service
public class CommonUtil {
  private static LoginUserRepository loginUserRepository;

  private CommonUtil(LoginUserRepository loginUserRepository) {
    com.jlimyt.spring_boot_sample_todo_application.util.CommonUtil.loginUserRepository = loginUserRepository;
  }

  public static boolean validatePrivilege(String prefix, String type) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null)
      return authentication.getAuthorities().stream().anyMatch(e -> (e.getAuthority().contains(prefix) && e.getAuthority().contains(type))); 
    return false;
  }
  
  public static LoginUser getLoginUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    LoginUser user = null;
    if (authentication != null) {
      String username = authentication.getName();
      user = loginUserRepository.findByUsernameAndEnable(username, true);
    } 
    return user;
  }
  
  public static Long getLoginUserId() {
	LoginUser user = getLoginUser();
    Long userId = null;
    if (user != null)
      userId = (Long)user.getId(); 
    return userId;
  }
  
}
