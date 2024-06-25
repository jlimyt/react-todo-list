package com.jlimyt.spring_boot_sample_todo_application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@ConfigurationPropertiesScan
public class SpringBootSampleTodoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringBootSampleTodoApplication.class, args);
	}

    @Bean
    PasswordEncoder passwordEncoder()
	{
	    return new BCryptPasswordEncoder();
	}

}
