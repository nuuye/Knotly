package com.knotly.app.identity.controller.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUsernameRequest {

    @NotBlank
    @Pattern(regexp = "^[A-Za-z0-9._-]+$")
    @Size(min = 2, max = 32)
    private String username;
}