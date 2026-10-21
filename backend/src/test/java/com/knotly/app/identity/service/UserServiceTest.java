package com.knotly.app.identity.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.knotly.app.identity.model.database.User;
import com.knotly.app.identity.repository.UserRepository;
import com.knotly.app.shared.exception.BadRequestException;
import com.knotly.app.shared.exception.ConflictException;
import com.knotly.app.shared.exception.NotFoundException;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void editUsername_updatesTheNameWhenItIsAvailable() {
        UUID userId = UUID.randomUUID();
        User user = new User("ada", "ada@example.com", "hashed-password");
        given(userRepository.findById(userId)).willReturn(Optional.of(user));
        given(userRepository.existsByUsernameNormalized("ada.lovelace")).willReturn(false);

        userService.editUsername(userId, "Ada.Lovelace");

        assertThat(user.getUsername()).isEqualTo("Ada.Lovelace");
        assertThat(user.getUsernameNormalized()).isEqualTo("ada.lovelace");
        then(userRepository).should().save(user);
    }

    @Test
    void editUsername_rejectsAnAlreadyUsedName() {
        UUID userId = UUID.randomUUID();
        User user = new User("ada", "ada@example.com", "hashed-password");
        given(userRepository.findById(userId)).willReturn(Optional.of(user));
        given(userRepository.existsByUsernameNormalized("grace")).willReturn(true);

        assertThatThrownBy(() -> userService.editUsername(userId, "Grace"))
                .isInstanceOf(ConflictException.class)
                .hasMessage("Username already exists");

        assertThat(user.getUsername()).isEqualTo("ada");
        then(userRepository).should().findById(userId);
        then(userRepository).should().existsByUsernameNormalized("grace");
        then(userRepository).shouldHaveNoMoreInteractions();
    }

    @Test
    void editUsername_rejectsAnUnknownUser() {
        UUID userId = UUID.randomUUID();
        given(userRepository.findById(userId)).willReturn(Optional.empty());

        assertThatThrownBy(() -> userService.editUsername(userId, "ada"))
                .isInstanceOf(NotFoundException.class)
                .hasMessage("User not found");
    }

    @Test
    void editPassword_rejectsAnIncorrectCurrentPassword() {
        UUID userId = UUID.randomUUID();
        User user = new User("ada", "ada@example.com", "old-hash");
        given(userRepository.findById(userId)).willReturn(Optional.of(user));
        given(passwordEncoder.matches("new-password", "old-hash")).willReturn(false);
        given(passwordEncoder.matches("wrong-password", "old-hash")).willReturn(false);

        assertThatThrownBy(() -> userService.editPassword(userId, "wrong-password", "new-password"))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Current password is incorrect");

        assertThat(user.getPasswordHash()).isEqualTo("old-hash");
    }

    @Test
    void editPassword_rejectsTheCurrentPasswordAsNewPassword() {
        UUID userId = UUID.randomUUID();
        User user = new User("ada", "ada@example.com", "old-hash");
        given(userRepository.findById(userId)).willReturn(Optional.of(user));
        given(passwordEncoder.matches("same-password", "old-hash")).willReturn(true);

        assertThatThrownBy(() -> userService.editPassword(userId, "same-password", "same-password"))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("New password must be different from the current password");
    }

    @Test
    void editPassword_replacesTheStoredHashForValidCredentials() {
        UUID userId = UUID.randomUUID();
        User user = new User("ada", "ada@example.com", "old-hash");
        given(userRepository.findById(userId)).willReturn(Optional.of(user));
        given(passwordEncoder.matches("new-password", "old-hash")).willReturn(false);
        given(passwordEncoder.matches("old-password", "old-hash")).willReturn(true);
        given(passwordEncoder.encode("new-password")).willReturn("new-hash");

        userService.editPassword(userId, "old-password", "new-password");

        assertThat(user.getPasswordHash()).isEqualTo("new-hash");
    }

    @Test
    void deleteAccount_marksTheUserAsDeletedWhenPasswordMatches() {
        UUID userId = UUID.randomUUID();
        User user = new User("ada", "ada@example.com", "hashed-password");
        given(userRepository.findByIdAndDeletedAtIsNull(userId)).willReturn(Optional.of(user));
        given(passwordEncoder.matches("current-password", "hashed-password")).willReturn(true);

        userService.deleteAccount(userId, "current-password");

        assertThat(user.getDeletedAt()).isNotNull();
    }

    @Test
    void deleteAccount_rejectsAnIncorrectConfirmationPassword() {
        UUID userId = UUID.randomUUID();
        User user = new User("ada", "ada@example.com", "hashed-password");
        given(userRepository.findByIdAndDeletedAtIsNull(userId)).willReturn(Optional.of(user));
        given(passwordEncoder.matches("wrong-password", "hashed-password")).willReturn(false);

        assertThatThrownBy(() -> userService.deleteAccount(userId, "wrong-password"))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Current password is incorrect");

        assertThat(user.getDeletedAt()).isNull();
    }
}
