package com.jlimyt.spring_boot_sample_todo_application.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;

@Profile("!prd")
@Configuration
@SecurityScheme(
		name = "Bearer Authentication",
		type = SecuritySchemeType.HTTP,
		bearerFormat = "JWT",
		scheme = "bearer")
public class SwaggerConfig {
	private final String CREATOR_NAME = "Jack Lim";
	private final String CREATOR_EMAIL = "ytljack0261@gmail.com";

	@Bean
	OpenAPI apiInfo() {
		return new OpenAPI()
				.info(new Info()
						.title("Sample Todo System")
						.description("Backend of Sample Todo System")
						.version("v0.0.1")
						.contact(new Contact()
								.name(CREATOR_NAME)
								.email(CREATOR_EMAIL)))
				.externalDocs(new ExternalDocumentation()
						.description("OpenAPI 3 & Spring Boot (springdoc-openapi v2.0.2)")
						.url("https://springdoc.org/v2/#features"));
	}
}
