package com.api.flux.service;

import com.api.flux.dto.request.auth.LoginAuthRequestDTO;
import com.api.flux.dto.request.auth.RegisterAuthRequestDTO;
import com.api.flux.dto.response.auth.LoginAuthResponseDTO;
import com.api.flux.dto.response.auth.LogoutAuthResponseDTO;
import com.api.flux.dto.response.auth.RegisterAuthResponseDTO;
import com.api.flux.dto.response.user.DataUserDTO;
import com.api.flux.entity.User;
import com.api.flux.mapper.UserMapper;
import com.api.flux.repository.UserRepository;
import com.api.flux.security.TokenService;
import com.api.flux.utils.TextUtils;
import com.api.flux.utils.ValidationUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, TokenService tokenService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public ResponseEntity<RegisterAuthResponseDTO> register(RegisterAuthRequestDTO dto) {
        try {
            String email = dto.email().trim().toLowerCase();

            if (ValidationUtils.isValidEmail(email)) {
                return ResponseEntity.badRequest()
                        .body(RegisterAuthResponseDTO.error("Invalid email format."));
            }

            if (userRepository.existsByEmail(email)) {
                logger.warn("Email: {} already registered.", email);
                return ResponseEntity.badRequest()
                        .body(RegisterAuthResponseDTO.error("Email already registered."));
            }

            User user = new User();
            user.generateId();
            user.setName(TextUtils.capitalizeFirstLetters(dto.name()));
            user.setLastName(TextUtils.capitalizeFirstLetters(dto.lastName()));
            user.setDateOfBirth(dto.dateOfBirth());
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(dto.password()));

            if (dto.profileImageUrl() != null && !dto.profileImageUrl().trim().isEmpty()) user.setProfileImageUrl(dto.profileImageUrl());

            User savedUser = userRepository.save(user);
            int age = UserService.calculateAge(savedUser);
            String token = tokenService.generateToken(savedUser);
            DataUserDTO dataUserDTO = UserMapper.toDto(savedUser, age);

            logger.info("User registered successfully with email: {}", email);
            return ResponseEntity.status(201)
                    .body(RegisterAuthResponseDTO.success("User registered successfully", token, dataUserDTO));
        } catch (IllegalArgumentException illegalArgumentException) {
            logger.warn("Registration validation failed: {}", illegalArgumentException.getMessage());
            return ResponseEntity.badRequest()
                    .body(RegisterAuthResponseDTO.error(illegalArgumentException.getMessage()));
        } catch (Exception exception) {
            logger.error("Unexpected error during registration: ", exception);
            return ResponseEntity.internalServerError()
                    .body(RegisterAuthResponseDTO.error("An unexpected error occurred during registration"));
        }
    }

    public ResponseEntity<LoginAuthResponseDTO> login(LoginAuthRequestDTO dto) {
        try {
            if (dto.email() == null || dto.email().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(LoginAuthResponseDTO.error("Email is required"));
            }

            if (dto.password() == null || dto.password().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(LoginAuthResponseDTO.error("Password is required"));
            }

            String email = dto.email().trim().toLowerCase();

            if (ValidationUtils.isValidEmail(email)) {
                return ResponseEntity.badRequest()
                        .body(LoginAuthResponseDTO.error("Invalid email format"));
            }

            Optional<User> optionalUser = userRepository.findByEmail(email);

            if (optionalUser.isEmpty()) {
                logger.warn("Login attempt with non-existent email: {}", email);
                return ResponseEntity.status(401)
                        .body(LoginAuthResponseDTO.error("Invalid email or password"));
            }

            User user = optionalUser.get();

            if (!passwordEncoder.matches(dto.password(), user.getPassword())) {
                logger.warn("Login attempt with non-existent email: {}", email);
                return ResponseEntity.status(401)
                        .body(LoginAuthResponseDTO.error("Invalid email or password"));
            }

            String token = tokenService.generateToken(user);
            int age = UserService.calculateAge(user);
            DataUserDTO userData = UserMapper.toDto(user, age);

            logger.info("User logged in successfully with email: {}", email);
            return ResponseEntity.ok()
                    .body(LoginAuthResponseDTO.success("Logged in successfully", token, userData));
        } catch (IllegalArgumentException illegalArgumentException) {
            logger.warn("Login validation failed: {}", illegalArgumentException.getMessage());
            return ResponseEntity.badRequest()
                    .body(LoginAuthResponseDTO.error(illegalArgumentException.getMessage()));
        } catch (Exception exception) {
            logger.error("Unexpected error during login: ", exception);
            return ResponseEntity.internalServerError()
                    .body(LoginAuthResponseDTO.error("An unexpected error occurred during login"));
        }
    }

    public ResponseEntity<LogoutAuthResponseDTO> logout() {
        try {
            logger.info("User logged out successfully");
            return ResponseEntity.ok().body(LogoutAuthResponseDTO.success("User logged out successfully.", null));
        } catch (Exception e) {
            logger.error("Error during logout", e);
            return ResponseEntity.internalServerError()
                    .body(LogoutAuthResponseDTO.error("Error during logout"));
        }
    }
}
