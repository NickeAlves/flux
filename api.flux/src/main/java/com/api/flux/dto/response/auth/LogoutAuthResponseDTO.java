package com.api.flux.dto.response.auth;

import java.time.Instant;

public record LogoutAuthResponseDTO(boolean success,
                                    String message,
                                    String token,
                                    String timestamp) {
    public static LogoutAuthResponseDTO success(String message, String token) {
        return new LogoutAuthResponseDTO(true, message, token, Instant.now().toString());
    }

    public static LogoutAuthResponseDTO error(String message) {
        return new LogoutAuthResponseDTO(false, message, null, Instant.now().toString());
    }
}
