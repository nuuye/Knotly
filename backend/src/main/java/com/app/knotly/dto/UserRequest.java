package com.app.knotly.dto;

import lombok.Data;

@Data
public class UserRequest {
    private String username;
    // Optional for guests
    private String password; 
    private String email;
}