package com.api.flux.service;

import com.api.flux.dto.request.user.UpdateUserRequestDTO;
import com.api.flux.dto.response.user.*;
import com.api.flux.entity.User;
import com.api.flux.mapper.UserMapper;
import com.api.flux.repository.UserRepository;
import com.api.flux.security.TokenService;
import com.api.flux.utils.TextUtils;
import com.api.flux.utils.ValidationUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, TokenService tokenService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
    }

    public static Integer calculateAge(User user) {
        LocalDate userDateOfBirth = user.getDateOfBirth();

        return (Integer) Period.between(userDateOfBirth, LocalDate.now()).getYears();
    }

    public ResponseEntity<PaginatedUserResponseDTO<DataUserDTO>> listUsersPaginated(int page, int size, String sortBy, String sortDirection) {
        try {
            if (page < 0) page = 0;
            if (size <= 0 || size > 100) size = 10;
            if (sortBy == null || sortBy.isEmpty()) sortBy = "name";

            Sort.Direction direction = Sort.Direction.ASC;
            if ("desc".equalsIgnoreCase(sortDirection)) {
                direction = Sort.Direction.DESC;
            }

            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
            Page<User> usersPage = userRepository.findAll(pageable);

            if (usersPage.isEmpty()) {
                return ResponseEntity.ok(PaginatedUserResponseDTO.error("No users found"));
            }

            Page<DataUserDTO> userDTOsPage = usersPage.map(user -> new DataUserDTO(
                    user.getId(),
                    user.getName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getDateOfBirth(),
                    calculateAge(user),
                    user.getProfileImageUrl()
            ));

            return ResponseEntity.ok(PaginatedUserResponseDTO.success("Users retrieved successfully", userDTOsPage));

        } catch (Exception exception) {
            logger.error("Error listing users with pagination: ", exception);
            return ResponseEntity.internalServerError()
                    .body(PaginatedUserResponseDTO.error("Internal server error occurred while retrieving users"));
        }
    }

    public ResponseEntity<ResponseUserDTO> getUserById(UUID id) {
        try {
            Optional<User> optionalUser = userRepository.findById(id);

            if (optionalUser.isEmpty()) {
                logger.warn("User not found with ID: {}", id);
                return ResponseEntity.status(404)
                        .body(ResponseUserDTO.notFound("User not found"));
            }

            User user = optionalUser.get();
            int userAge = calculateAge(user);
            DataUserDTO userDTO = UserMapper.toDto(user, userAge);

            logger.info("User found with ID: {}", id);
            return ResponseEntity.ok().body(ResponseUserDTO.success("User found by ID.", userDTO));
        } catch (IllegalArgumentException illegalArgumentException) {
            logger.error("Internal server error occurred while retrieving user: ", illegalArgumentException);
            return ResponseEntity.badRequest().body(ResponseUserDTO.error("Please, enter valid ID."));
        } catch (Exception exception) {
            logger.error("Internal server error occurred while retrieving user: ", exception);
            return ResponseEntity.badRequest().body(ResponseUserDTO.error("Internal server error occurred while retrieving user."));
        }
    }

    public ResponseEntity<ResponseUserDTO> getUserByEmail(String email) {
        try {
            String adjustedEmail = email.trim().toLowerCase();

            if (ValidationUtils.isValidEmail(adjustedEmail)) {
                return ResponseEntity.badRequest()
                        .body(ResponseUserDTO.notFound("Invalid email format"));
            }

            Optional<User> optionalUser = userRepository.findByEmail(adjustedEmail);

            if (optionalUser.isEmpty()) {
                logger.warn("User not found with email: {}", email);
                return ResponseEntity.status(404)
                        .body(ResponseUserDTO.notFound("User not found"));
            }

            User user = optionalUser.get();
            int userAge = calculateAge(user);
            DataUserDTO userDTO = UserMapper.toDto(user, userAge);

            logger.info("User found with email: {}", email);
            return ResponseEntity.ok()
                    .body(ResponseUserDTO.success("User found", userDTO));
        } catch (Exception exception) {
            logger.error("Error finding user by email: ", exception);
            return ResponseEntity.internalServerError()
                    .body(ResponseUserDTO.notFound("Internal server error occurred while searching for user"));
        }
    }

    public ResponseEntity<UpdateUserResponseDTO> updateUser(UUID id, UpdateUserRequestDTO dto) {
        try {
            Optional<User> optionalUser = userRepository.findById(id);

            if (optionalUser.isEmpty()) {
                logger.warn("User not found with ID: {}", id);
                return ResponseEntity.status(404)
                        .body(UpdateUserResponseDTO.notFound("User not found."));
            }

            User existingUser = optionalUser.get();

            if (dto.name() != null && !dto.name().trim().isEmpty()) {
                existingUser.setName(TextUtils.capitalizeFirstLetters(dto.name()));
            }

            if (dto.lastName() != null && !dto.lastName().trim().isEmpty()) {
                existingUser.setLastName(TextUtils.capitalizeFirstLetters(dto.lastName()));
            }

            if (dto.email() != null && !dto.email().trim().isEmpty()) {
                String newEmail = dto.email().trim().toLowerCase();

                if (ValidationUtils.isValidEmail(newEmail)) {
                    logger.warn("Invalid email format. Email: {}", dto.email());
                    return ResponseEntity.badRequest()
                            .body(UpdateUserResponseDTO.error("Invalid email format."));
                }

                if (newEmail.equals(existingUser.getEmail())) {
                    logger.warn("New email: {},  must be different from current email.", dto.email());
                    return ResponseEntity.status(409)
                            .body(UpdateUserResponseDTO.error("New email must be different from current email."));
                }

                if (userRepository.existsByEmail(newEmail)) {
                    logger.warn("Email {} already in use.", dto.email());
                    return ResponseEntity.status(409)
                            .body(UpdateUserResponseDTO.error("Email already in use."));
                }
                existingUser.setEmail(newEmail);
            }

            if (dto.password() != null && !dto.password().trim().isEmpty()) {
                if (passwordEncoder.matches(dto.password(), existingUser.getPassword())) {
                    return ResponseEntity.badRequest()
                            .body(UpdateUserResponseDTO.error("Please, insert a different password."));
                }

                String newPassword = passwordEncoder.encode(dto.password());
                existingUser.setPassword(newPassword);
            }

            if (dto.profileImageUrl() != null && !dto.profileImageUrl().trim().isEmpty()) {
                existingUser.setProfileImageUrl(dto.profileImageUrl());
            }

            User updatedUser = userRepository.save(existingUser);
            int age = calculateAge(optionalUser.get());
            DataUserDTO dataUserDTO = UserMapper.toDto(updatedUser, age);
            String newToken = tokenService.generateToken(updatedUser);

            logger.info("User updated successfully.");
            return ResponseEntity.ok()
                    .body(UpdateUserResponseDTO.success("User updated successfully", dataUserDTO, newToken));
        } catch (IllegalArgumentException illegalArgumentException) {
            logger.warn("Update validation failed: {}", illegalArgumentException.getMessage());
            return ResponseEntity.badRequest()
                    .body(UpdateUserResponseDTO.error(illegalArgumentException.getMessage()));
        } catch (Exception exception) {
            logger.error("Unexpected error during user update: ", exception);
            return ResponseEntity.internalServerError()
                    .body(UpdateUserResponseDTO.error("An unexpected error occurred during update"));
        }
    }

    public ResponseEntity<DeleteUserResponseDTO> deleteUserById(UUID id) {
        try {
            if (!userRepository.existsById(id)) {
                logger.warn("Delete attempt for non-existent user with ID: {}", id);
                return ResponseEntity.status(404)
                        .body(DeleteUserResponseDTO.notFound("User not found"));
            }

            userRepository.deleteById(id);
            logger.info("User deleted  successfully with ID {}.", id);
            return ResponseEntity.ok()
                    .body(DeleteUserResponseDTO.success("User deleted successfully."));
        } catch (Exception exception) {
            logger.error("Unexpected error during user deletion: ", exception);
            return ResponseEntity.internalServerError()
                    .body(DeleteUserResponseDTO.error("An unexpected error occurred during deletion"));
        }
    }
}
