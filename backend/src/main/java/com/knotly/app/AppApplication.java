package com.knotly.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AppApplication {

	/** Starts the Spring Boot application and its web server. */
	public static void main(String[] args) {
		SpringApplication.run(AppApplication.class, args);
	}

}
