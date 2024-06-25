package com.jlimyt.spring_boot_sample_todo_application.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.jlimyt.spring_boot_sample_todo_application.service.security.JwtUserDetailsService;

import lombok.RequiredArgsConstructor;

@Order(99)
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class WebSecurityConfig {
	private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint = new JwtAuthenticationEntryPoint();
	@Autowired
	private final JwtRequestFilter jwtRequestFilter;

	@Autowired
	public void configureGlobal(
			AuthenticationManagerBuilder auth,
			PasswordEncoder passwordEncoder,
			JwtUserDetailsService jwtUserDetailsService)
			throws Exception {
		auth.userDetailsService(jwtUserDetailsService).passwordEncoder(passwordEncoder);
	}

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration config)
			throws Exception {
		return config.getAuthenticationManager();
	}

	@Bean
	SecurityFilterChain defaultSecurityFilterChain(HttpSecurity httpSecurity) throws Exception {
		// We don't need CSRF for this example
		httpSecurity
				.cors(Customizer.withDefaults())
				.csrf(AbstractHttpConfigurer::disable)
				.headers(
						headers -> headers.xssProtection(Customizer.withDefaults())
								.frameOptions(HeadersConfigurer.FrameOptionsConfig::deny)
						// .contentSecurityPolicy(cps -> cps.policyDirectives("script-src 'self'"))
						)
				.authorizeHttpRequests((requests) -> requests.requestMatchers(
								"/login",
								"/loginUsers/registration",
								"/api-docs",
								"/api-docs/**",
								"/swagger*",
								"/swagger-ui/**",
								"/v3/api-docs/**")
						.permitAll()
						.anyRequest()
						.authenticated())
				.sessionManagement(
						session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.exceptionHandling(
						handling -> handling.authenticationEntryPoint(jwtAuthenticationEntryPoint))
				.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

		return httpSecurity.build();
	}
}
