package com.api.flux.controller;

import com.api.flux.dto.request.user.UpdateUserRequestDTO;
import com.api.flux.dto.response.user.*;
import com.api.flux.security.CustomUserDetails;
import com.api.flux.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/v1/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<PaginatedUserResponseDTO<DataUserDTO>> listAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        return userService.listUsersPaginated(page, size, sortBy, sortDirection);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseUserDTO> findUserById(@PathVariable UUID id, Authentication authentication) {
        UUID authenticatedUserId = getUserIdFromAuth(authentication);
        if (!authenticatedUserId.equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ResponseUserDTO.error("You can only access your own profile."));
        }
        return userService.getUserById(id);
    }

    @GetMapping("/email")
    public ResponseEntity<ResponseUserDTO> findUserByEmail(@RequestParam String email, Authentication authentication) {
        return userService.getUserByEmail(email);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UpdateUserResponseDTO> updateUser(@PathVariable UUID id,
                                                            @Valid @RequestBody UpdateUserRequestDTO dto,
                                                            Authentication authentication) {
        UUID authenticatedUserId = getUserIdFromAuth(authentication);
        if (!authenticatedUserId.equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(UpdateUserResponseDTO.error("You can only update your own account."));
        }
        return userService.updateUser(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteUserResponseDTO> deleteUserById(@PathVariable UUID id, Authentication authentication) {
        UUID authenticatedUserId = getUserIdFromAuth(authentication);
        if (!authenticatedUserId.equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(DeleteUserResponseDTO.error("You can only delete your own account."));
        }
        return userService.deleteUserById(id);
    }

    @GetMapping("/me")
    public ResponseEntity<ResponseUserDTO> getAuthenticatedUser(Authentication authentication) {
        UUID authenticatedUserId = getUserIdFromAuth(authentication);
        return userService.getUserById(authenticatedUserId);
    }

    private UUID getUserIdFromAuth(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getId();
    }
}
