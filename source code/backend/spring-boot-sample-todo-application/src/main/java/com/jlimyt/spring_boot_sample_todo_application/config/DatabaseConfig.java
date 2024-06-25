package com.jlimyt.spring_boot_sample_todo_application.config;

import com.zaxxer.hikari.HikariDataSource;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class DatabaseConfig {
	@Bean
	@Primary
	@ConfigurationProperties("spring.datasource.hikari")
	HikariDataSource hikariDataSource() {
		return DataSourceBuilder.create().type(HikariDataSource.class).build();
	}
}
