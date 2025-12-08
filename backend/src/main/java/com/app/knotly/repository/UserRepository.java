package com.app.knotly.repository;

import com.app.knotly.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Defining custom requests
    Optional<User> findByEmail(String email); //Optional<User> cause it might return nothing

    Optional<User> findByUsername(String username);

}