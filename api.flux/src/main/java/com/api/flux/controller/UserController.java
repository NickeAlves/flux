package com.api.flux.controller;

import com.api.flux.dto.request.user.UpdateUserRequestDTO;
import com.api.flux.dto.response.user.*;
import com.api.flux.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<PaginatedUserResponseDTO<DataUserDTO>> listAllUsers(@RequestParam(defaultValue = "0") int page,
                                                                              @RequestParam(defaultValue = "10") int size,
                                                                              @RequestParam(defaultValue = "name") String sortBy,
                                                                              @RequestParam(defaultValue = "asc") String sortDirection) {
        return userService.listUsersPaginated(page, size, sortBy, sortDirection);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseUserDTO> findUserById(@PathVariable UUID id) {
        return userService.getUserById(id);
    }

    @GetMapping("/email")
    public ResponseEntity<ResponseUserDTO> findUserByEmail(@RequestParam String email) {
        return userService.getUserByEmail(email);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UpdateUserResponseDTO> updateUser(@PathVariable UUID id,
                                                            @Valid @RequestBody UpdateUserRequestDTO dto) {
        return userService.updateUser(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteUserResponseDTO> deleteUserById(@PathVariable UUID id) {
        return userService.deleteUserById(id);
    }
}
