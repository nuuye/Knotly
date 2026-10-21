package com.knotly.app.identity.controller;

import com.knotly.app.identity.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.knotly.app.identity.controller.dto.request.UpdatePasswordRequest;
import com.knotly.app.identity.controller.dto.request.UpdateUsernameRequest;
import com.knotly.app.identity.model.database.User;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/users/me")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public User getMyProfile(@AuthenticationPrincipal User user) {
        return user;
    }

    @PatchMapping("/username")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void editUsername(
        // Retrieving the current user from request filter
        @AuthenticationPrincipal User currentUser, 
        @Valid @RequestBody UpdateUsernameRequest request) {
        
        userService.editUsername(currentUser.getId(), request.getUsername());
        
    }

    @PatchMapping("/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void editPassword(
        // Retrieving the current user from request filter
        @AuthenticationPrincipal User currentUser, 
        @Valid @RequestBody UpdatePasswordRequest request) {
        
        userService.editPassword(currentUser.getId(), request.getOldPassword(), request.getNewPassword());
        
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAccount(
        @AuthenticationPrincipal User currentUser, 
        @Valid @RequestBody String currentPassword) {

        userService.deleteAccount(currentUser.getId(), currentPassword);
    }
    

}
