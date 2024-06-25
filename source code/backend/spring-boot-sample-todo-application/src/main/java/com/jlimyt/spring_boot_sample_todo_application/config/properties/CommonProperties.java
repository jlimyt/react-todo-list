package com.jlimyt.spring_boot_sample_todo_application.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "common")
public record CommonProperties(String frontendUrlPath, String systemNameEn, String systemNameTc) {}
