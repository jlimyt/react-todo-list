package com.jlimyt.spring_boot_sample_todo_application.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.jlimyt.spring_boot_sample_todo_application.service.security.JwtUserDetailsService;
import com.jlimyt.spring_boot_sample_todo_application.util.JwtTokenUtil;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtRequestFilter extends OncePerRequestFilter {
	@Autowired
	private JwtUserDetailsService jwtUserDetailsService;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Override
	protected void doFilterInternal(
			HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		try {
			String jwt = parseJwt(request);
			if (jwt != null) {
				String username = null;
				try {
					username = jwtTokenUtil.getUsernameFromToken(jwt);
				} catch (IllegalArgumentException e) {
					log.error(
							"Unable to get JWT Token: {}, IP address: {}",
							e.getMessage(),
							request.getRemoteAddr());
				} catch (ExpiredJwtException e) {
					log.warn(
							"JWT Token has expired: {}, IP address: {}",
							e.getMessage(),
							request.getRemoteAddr());
				}

				if (username != null) {
					UserDetails userDetails = jwtUserDetailsService.loadUserByUsername(username);
					if (jwtTokenUtil.validateToken(jwt, userDetails)) {
						UsernamePasswordAuthenticationToken authentication =
								new UsernamePasswordAuthenticationToken(
										userDetails, null, userDetails.getAuthorities());
						authentication.setDetails(
								new WebAuthenticationDetailsSource().buildDetails(request));

						SecurityContextHolder.getContext().setAuthentication(authentication);
					}
				}
			}
		} catch (Exception e) {
			log.error(
					"Cannot set user authentication: {}, IP address: {}",
					e.getMessage(),
					request.getRemoteAddr());
		}

		filterChain.doFilter(request, response);
	}

	private String parseJwt(HttpServletRequest request) {
		String headerAuth = request.getHeader("Authorization");

		if (StringUtils.hasText(headerAuth)) {
			if (headerAuth.startsWith("Bearer ")) {
				return headerAuth.substring(7, headerAuth.length());
			} else {
				log.warn(
						"JWT Token does not begin with Bearer String, IP address: {}",
						request.getRemoteAddr());
			}
		} else {
			log.warn("JWT Token is empty, IP address: {}", request.getRemoteAddr());
		}
		return null;
	}
}
