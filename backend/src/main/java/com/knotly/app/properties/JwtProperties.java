package com.knotly.app.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {

    @NotBlank
    @Size(min = 64, max = 64)
    private String secret;    
}
