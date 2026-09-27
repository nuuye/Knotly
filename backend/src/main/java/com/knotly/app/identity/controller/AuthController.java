package com.knotly.app.identity.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.knotly.app.identity.controller.dto.request.LoginRequest;
import com.knotly.app.identity.controller.dto.request.RegisterRequest;
import com.knotly.app.identity.controller.dto.response.LoginResponse;
import com.knotly.app.identity.service.AuthService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @Valid @RequestBody RegisterRequest request) {

        authService.register(
                request.getUsername(),
                request.getEmail(),
                request.getPassword());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("User created");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {

        String token = authService.login(request.getEmail(), request.getPassword());

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new LoginResponse(token));
    }

}
