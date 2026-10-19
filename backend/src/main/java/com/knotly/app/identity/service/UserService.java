package com.knotly.app.identity.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.knotly.app.identity.exception.BadRequestException;
import com.knotly.app.identity.exception.ConflictException;
import com.knotly.app.identity.exception.NotFoundException;
import com.knotly.app.identity.model.database.User;
import com.knotly.app.identity.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor 
public class UserService {
    
    private final UserRepository userRepository;

    @Transactional
    public void editUsername(UUID userId, String username) {

        if (username == null || username.isBlank()) {
            throw new BadRequestException("Username cannot be empty");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new NotFoundException("User not found"));
    
        String normalizedUsername = User.normalizeField(username);
        
        // Checking if username is different than the old one, and if it is already taken
        if (!normalizedUsername.equals(user.getUsernameNormalized())
            && userRepository.existsByUsernameNormalized(normalizedUsername)) {
        throw new ConflictException("Username already exists");
        }

        user.changeUsername(username);
    
        // Optional as we use @Transactional
        userRepository.save(user);
    }

}
