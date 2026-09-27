package com.knotly.app.identity.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.knotly.app.identity.model.database.User;

// <Type of Data, Primary key>
public interface UserRepository extends JpaRepository<User, UUID>{
    
    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);
}
