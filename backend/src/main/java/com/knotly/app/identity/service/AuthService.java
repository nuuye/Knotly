package com.knotly.app.identity.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.knotly.app.identity.exception.ConflictException;
import com.knotly.app.identity.exception.UnauthorizedException;
import com.knotly.app.identity.model.database.User;
import com.knotly.app.identity.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor 
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public void register(String username, String email, String password) {

        String normalizedUsername = User.normalizeField(username);
        String normalizedEmail = User.normalizeField(email);

        if (userRepository.existsByEmailNormalized(normalizedEmail)) {
            throw new ConflictException("Email already exists");
        }

        if (userRepository.existsByUsernameNormalized(normalizedUsername)) {
            throw new ConflictException("username already exists");
        }

        User user = new User(
            username,
            email,
            passwordEncoder.encode(password)
        );

        userRepository.save(user);
    }

    public String login(String email, String password) {
        
        String normalizedEmail = User.normalizeField(email);

        User user = userRepository.findByEmailNormalized(normalizedEmail).orElse(null);

        if(user == null){
            throw new UnauthorizedException("Invalid credentials");
        }

        boolean passwordCorrect = passwordEncoder.matches(password, user.getPasswordHash());

        if(!passwordCorrect) {
            throw new UnauthorizedException("Invalid credentials");
        }

        return jwtService.generateToken(user);
    }
}
