package com.api.flux.service;

import com.api.flux.dto.request.auth.LoginAuthRequestDTO;
import com.api.flux.dto.request.auth.RegisterAuthRequestDTO;
import com.api.flux.dto.response.auth.LoginAuthResponseDTO;
import com.api.flux.dto.response.auth.LogoutAuthResponseDTO;
import com.api.flux.dto.response.auth.RegisterAuthResponseDTO;
import com.api.flux.dto.response.user.DataUserDTO;
import com.api.flux.entity.User;
import com.api.flux.repository.UserRepository;
import com.api.flux.security.TokenService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
    );

    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, TokenService tokenService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
    }

    public static String capitalizeFirstLetters(String input) {
        if (input == null || input.isEmpty()) return input;

        String[] words = input.trim().split("\\s+");
        StringBuilder result = new StringBuilder();

        for (String word : words) {
            if (!word.isEmpty()) {
                result.append(Character.toUpperCase(word.charAt(0)));
                if (word.length() > 1) {
                    result.append(word.substring(1).toLowerCase());
                }
                result.append(" ");
            }
        }
        return result.toString().trim();
    }

    private int calculateAge(User user) {
        LocalDate userDateOfBirth = user.getDateOfBirth();

        return Period.between(userDateOfBirth, LocalDate.now()).getYears();
    }

    private DataUserDTO createUserData(User user) {
        return new DataUserDTO(user.getId(),
                user.getName(),
                user.getLastName(),
                user.getEmail(),
                user.getDateOfBirth(),
                calculateAge(user));
    }

    @Transactional
    public ResponseEntity<RegisterAuthResponseDTO> register(RegisterAuthRequestDTO dto) {
        try {
            String email = dto.email().trim().toLowerCase();

            if (!EMAIL_PATTERN.matcher(email).matches()) {
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
            user.setName(capitalizeFirstLetters(dto.name()));
            user.setLastName(capitalizeFirstLetters(dto.lastName()));
            user.setDateOfBirth(dto.dateOfBirth());
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(dto.password()));

            User savedUser = userRepository.save(user);
            String token = tokenService.generateToken(savedUser);
            DataUserDTO dataUserDTO = createUserData(savedUser);

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

            if (!EMAIL_PATTERN.matcher(email).matches()) {
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
            DataUserDTO userData = createUserData(user);

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
