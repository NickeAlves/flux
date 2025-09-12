package com.api.flux.service;

import com.api.flux.dto.response.user.DataUserDTO;
import com.api.flux.dto.response.user.PaginatedUserResponseDTO;
import com.api.flux.dto.response.user.ResponseUserDTO;
import com.api.flux.entity.User;
import com.api.flux.repository.UserRepository;
import org.apache.coyote.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.time.LocalDate;
import java.time.Period;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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
                    calculateAge(user)
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
            DataUserDTO userDTO = createUserData(user);

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

}
