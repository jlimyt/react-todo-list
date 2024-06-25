package com.jlimyt.spring_boot_sample_todo_application.controller.security;

import java.util.List;

import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.jlimyt.spring_boot_sample_todo_application.config.properties.CommonProperties;
import com.jlimyt.spring_boot_sample_todo_application.model.jwt.JwtRequest;
import com.jlimyt.spring_boot_sample_todo_application.model.jwt.JwtResponse;
import com.jlimyt.spring_boot_sample_todo_application.model.jwt.JwtResponse.JwtRoleResponse;
import com.jlimyt.spring_boot_sample_todo_application.model.security.LoginUser;
import com.jlimyt.spring_boot_sample_todo_application.model.security.LoginUserRole;
import com.jlimyt.spring_boot_sample_todo_application.service.security.LoginUserService;
import com.jlimyt.spring_boot_sample_todo_application.util.JwtTokenUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@CrossOrigin("*")
@RestController
@AllArgsConstructor
@Tag(name = "Auth", description = "Endpoints for auth: login & registeration")
public class JwtAuthenticationController {
	Environment env;
	private AuthenticationManager authenticationManager;
	private JwtTokenUtil jwtTokenUtil;
	private LoginUserService loginUserService;
	
	@Resource
	CommonProperties commonProperties;

	@PostMapping(value = "/login")
	@Operation(
			summary = "Login",
			description = "Login and request a JWT token",
			requestBody =
					@io.swagger.v3.oas.annotations.parameters.RequestBody(
							description = "The credential of the login user."),
			responses = {
				@ApiResponse(responseCode = "200", description = "Success"),
				@ApiResponse(responseCode = "400", description = "Bad request"),
				@ApiResponse(
						responseCode = "403",
						description = "Forbidden - Login is not allowed"),
				@ApiResponse(responseCode = "500", description = "Internal server error")
			})
	public ResponseEntity<?> createAuthenticationToken(
			@RequestBody JwtRequest authenticationRequest, HttpSession session) throws Exception {
		Authentication authentication = null;

		try {
			authentication = authenticate(
					authenticationRequest.username(), authenticationRequest.password());
			LoginUser loginUser = loginUserService.findByUsername(authenticationRequest.username());

//			if (loginUser != null) {
//
//				if (!Boolean.TRUE.equals(loginUser.getEnable())) {
//					return ResponseEntity.status(HttpServletResponse.SC_FORBIDDEN)
//							.body(MessageUtil.get("error.login.enable"));
//				}
//
//				if (Boolean.TRUE.equals(publicUserService.existsById(loginUser.getId()))) {
//					PublicUser publicUser = publicUserService.findById(loginUser.getId());
//					if (!Boolean.TRUE.equals(publicUser.getVerify())) {
//						return ResponseEntity.status(HttpServletResponse.SC_FORBIDDEN)
//								.body(MessageUtil.get("error.login.verify"));
//					}
//				}
//			}
			final String token =
					jwtTokenUtil.generateToken((UserDetails) authentication.getPrincipal());
			return ResponseEntity.ok(prepareJwtResponse(loginUser, token));
		} catch (Exception e) {
			log.error("login", e);
			return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED)
					.body("Unauthorized access");
//							MessageUtil.get("error.login.disallowed")
//							);
		}
	}

	private Authentication authenticate(String username, String password) throws Exception {
		try {
			return authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(username, password));
		} catch (DisabledException e) {
			throw new Exception("USER_DISABLED", e);
		} catch (BadCredentialsException e) {
			throw new Exception("INVALID_CREDENTIALS", e);
		}
	}

	protected JwtResponse prepareJwtResponse(LoginUser loginUser, String token) {
		List<JwtRoleResponse> userRoles = loginUser.getLoginUserRoles().stream()
				.map(LoginUserRole::getRole)
				.map(x -> new JwtRoleResponse(x.getCode(), x.getDescription()))
				.toList();
//	Priv isn't applicable in this project
//		Set<Priv> privs = loginUser.getLoginUserRoles().stream()
//				.map(LoginUserRole::getRole)
//				.map(Role::getRolePrivs)
//				.flatMap(List::stream)
//				.map(RolePriv::getPriv)
//				.collect(Collectors.toSet());


		return new JwtResponse(
				loginUser.getId(),
				loginUser.getUsername(),
				loginUser.getDisplayName(),
				token,
				userRoles);
	}


//	@Transactional
//	@PostMapping("/resetPassword")
//	public ResponseEntity<?> resetPassword(@RequestBody LoginUserToken loginUserToken) {
//		try {
//			LoginUserToken loginUserTokenInDb =
//					loginUserTokenService
//							.findFirstByTypeAndTokenAndExpiredAtAfterAndCompletedAtIsNull(
//									LoginUserToken.Type.FORGOT_PASSWORD,
//									loginUserToken.getToken(),
//									LocalDateTime.now());
//			if (loginUserTokenInDb == null) {
//				return ResponseEntity.notFound().build();
//			}
//
//			LoginUser dbUser = loginUserTokenInDb.getLoginUser();
//			dbUser.setPassword(bCryptPasswordEncoder.encode(dbUser.getPassword()));
//			loginUserService.update(dbUser);	
//
//			loginUserTokenInDb.setCompletedAt(LocalDateTime.now());
//			loginUserTokenService.update(loginUserTokenInDb);
//		} catch (Exception e) {
//			log.error(null, e);
//			return ResponseEntity.internalServerError().body(e.getMessage());
//		}
//		return ResponseEntity.ok().build();
//	}
}
