package com.jlimyt.spring_boot_sample_todo_application.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "jwt")
public record JwtProperties(String secret, Long tokenValidity) {}
