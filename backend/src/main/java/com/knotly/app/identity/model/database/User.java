package com.knotly.app.identity.model.database;
import java.time.Instant;
import java.util.Locale;
import java.util.UUID;

import com.knotly.app.identity.model.types.PlatformRole;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity 
@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 320)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "platform_role", nullable = false, length = 30)
    private PlatformRole platformRole = PlatformRole.USER;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    @Column
    private String bio;

    @Column
    private String status;

    @Column(nullable = false, length = 32)
    private String username;
    
    @Column(name = "username_normalized", nullable = false, length = 32)
    private String usernameNormalized;

    @Column(name = "avatar_url")
    private String avatarUrl;

    // Constructors
    public User(String username, String email, String passwordHash) {
        this.username = username;
        this.usernameNormalized = username.toLowerCase(Locale.ROOT);
        this.email = email;
        this.passwordHash = passwordHash;
        this.platformRole = PlatformRole.USER;
    }

}

