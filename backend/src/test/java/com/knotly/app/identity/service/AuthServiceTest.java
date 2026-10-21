package com.knotly.app.identity.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.knotly.app.identity.exception.ConflictException;
import com.knotly.app.identity.exception.UnauthorizedException;
import com.knotly.app.identity.model.database.User;
import com.knotly.app.identity.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_savesUserWithNormalizedIdentifiersAndHashedPassword() {
        given(userRepository.existsByEmailNormalized("ada@example.com")).willReturn(false);
        given(userRepository.existsByUsernameNormalized("ada.lovelace")).willReturn(false);
        given(passwordEncoder.encode("a-secure-password")).willReturn("hashed-password");

        authService.register("Ada.Lovelace", "Ada@Example.com", "a-secure-password");

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        then(userRepository).should().save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getUsername()).isEqualTo("Ada.Lovelace");
        assertThat(savedUser.getUsernameNormalized()).isEqualTo("ada.lovelace");
        assertThat(savedUser.getEmailNormalized()).isEqualTo("ada@example.com");
        assertThat(savedUser.getPasswordHash()).isEqualTo("hashed-password");
    }

    @Test
    void register_rejectsAnEmailAlreadyInUse() {
        given(userRepository.existsByEmailNormalized("ada@example.com")).willReturn(true);

        assertThatThrownBy(() -> authService.register("ada", "ada@example.com", "a-secure-password"))
                .isInstanceOf(ConflictException.class)
                .hasMessage("Email already exists");

        then(userRepository).should().existsByEmailNormalized("ada@example.com");
        then(userRepository).shouldHaveNoMoreInteractions();
        then(passwordEncoder).shouldHaveNoInteractions();
    }

    @Test
    void register_rejectsAUsernameAlreadyInUse() {
        given(userRepository.existsByEmailNormalized("ada@example.com")).willReturn(false);
        given(userRepository.existsByUsernameNormalized("ada")).willReturn(true);

        assertThatThrownBy(() -> authService.register("Ada", "ada@example.com", "a-secure-password"))
                .isInstanceOf(ConflictException.class)
                .hasMessage("username already exists");

        then(userRepository).should().existsByEmailNormalized("ada@example.com");
        then(userRepository).should().existsByUsernameNormalized("ada");
        then(userRepository).shouldHaveNoMoreInteractions();
        then(passwordEncoder).shouldHaveNoInteractions();
    }

    @Test
    void login_returnsTokenForValidCredentials() {
        User user = new User("ada", "ada@example.com", "hashed-password");
        given(userRepository.findByEmailNormalizedAndDeletedAtIsNull("ada@example.com"))
                .willReturn(Optional.of(user));
        given(passwordEncoder.matches("a-secure-password", "hashed-password")).willReturn(true);
        given(jwtService.generateToken(user)).willReturn("jwt-token");

        String token = authService.login("Ada@Example.com", "a-secure-password");

        assertThat(token).isEqualTo("jwt-token");
    }

    @Test
    void login_rejectsUnknownOrDeletedUser() {
        given(userRepository.findByEmailNormalizedAndDeletedAtIsNull("ada@example.com"))
                .willReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login("ada@example.com", "a-secure-password"))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessage("Invalid credentials");

        then(passwordEncoder).shouldHaveNoInteractions();
        then(jwtService).shouldHaveNoInteractions();
    }

    @Test
    void login_rejectsWrongPassword() {
        User user = new User("ada", "ada@example.com", "hashed-password");
        given(userRepository.findByEmailNormalizedAndDeletedAtIsNull("ada@example.com"))
                .willReturn(Optional.of(user));
        given(passwordEncoder.matches("wrong-password", "hashed-password")).willReturn(false);

        assertThatThrownBy(() -> authService.login("ada@example.com", "wrong-password"))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessage("Invalid credentials");

        then(jwtService).shouldHaveNoInteractions();
    }
}
