package com.knotly.app.identity.service;

import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.knotly.app.identity.exception.BadRequestException;
import com.knotly.app.identity.exception.ConflictException;
import com.knotly.app.identity.exception.NotFoundException;
import com.knotly.app.identity.exception.UnauthorizedException;
import com.knotly.app.identity.model.database.User;
import com.knotly.app.identity.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor 
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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

    @Transactional 
    public void editPassword(UUID userId, String oldPassword, String newPassword) {

        User user = userRepository.findById(userId)
        .orElseThrow(() ->
                new NotFoundException("User not found"));

        // Compare oldPassword hash with current password hash
        boolean passwordMatch = passwordEncoder.matches(oldPassword, user.getPasswordHash());
        boolean samePassword = passwordEncoder.matches(newPassword, user.getPasswordHash());
        
        if(samePassword) {
            throw new BadRequestException("New password must be different from the current password");
        }

        // if old password and current password hash match then we can update
        if (passwordMatch) {
            user.updatePassword(passwordEncoder.encode(newPassword));
        } else { // else incorrect password
            throw new BadRequestException("Current password is incorrect");
        }
    }

    @Transactional
    public void deleteAccount(UUID userId, String currentPassword) {
        
        User user = userRepository.findByIdAndDeletedAtIsNull(userId)
        .orElseThrow(() -> 
            new NotFoundException("User not found"));

        boolean passwordMatching = passwordEncoder.matches(currentPassword, user.getPasswordHash());

        if (passwordMatching) {
            user.markDeleted();
        } else {
            throw new BadRequestException("Current password is incorrect");
        }

    }

}
