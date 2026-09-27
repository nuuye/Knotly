package com.knotly.app.identity.controller.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    @Pattern(regexp = "^[A-Za-z0-9._-]+$")
    @Size(min = 2, max = 32)
    private String username;

    @NotBlank
    @Email
    @Size(max = 320)
    private String email;

    @NotBlank
    @Size(min = 12, max = 72)
    private String password;
}
