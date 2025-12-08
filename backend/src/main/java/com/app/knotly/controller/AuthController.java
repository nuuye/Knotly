package com.app.knotly.controller;

import com.app.knotly.dto.UserRequest;
import com.app.knotly.model.User;
import com.app.knotly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Allow Vite frontend
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // Endpoint to enter as a guest
    @PostMapping("/guest")
    public ResponseEntity<User> createGuest(@RequestBody UserRequest request) {
        // Simple check if username exists (in a real app, we might append numbers like User#1234)
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().build(); // Username taken
        }

        User guest = new User();
        guest.setUsername(request.getUsername());
        guest.setGuest(true);
        // Add a default pastel avatar logic later
        
        User savedUser = userRepository.save(guest);
        return ResponseEntity.ok(savedUser);
    }
}