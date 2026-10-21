package com.knotly.app.identity.controller.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdatePasswordRequest {

    @NotBlank
    private String oldPassword;

    @NotBlank
    @Size(min = 12, max = 72)
    private String newPassword;
}