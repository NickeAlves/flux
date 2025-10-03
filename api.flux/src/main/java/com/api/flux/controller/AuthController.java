package com.api.flux.controller;

import com.api.flux.dto.request.auth.LoginAuthRequestDTO;
import com.api.flux.dto.request.auth.RegisterAuthRequestDTO;
import com.api.flux.dto.response.auth.LoginAuthResponseDTO;
import com.api.flux.dto.response.auth.LogoutAuthResponseDTO;
import com.api.flux.dto.response.auth.RegisterAuthResponseDTO;
import com.api.flux.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/v1")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterAuthResponseDTO> register(@Valid @RequestBody RegisterAuthRequestDTO dto) {
        return authService.register(dto);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginAuthResponseDTO> login(@Valid @RequestBody LoginAuthRequestDTO dto) {
        return authService.login(dto);
    }

    @PostMapping("/logout")
    public ResponseEntity<LogoutAuthResponseDTO> logout() {
        return authService.logout();
    }
}
