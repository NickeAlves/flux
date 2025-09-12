package com.api.flux.dto.response.auth;

public record LogoutAuthResponseDTO(boolean success,
                                    String message,
                                    String token,
                                    String timestamp) {
    public static LogoutAuthResponseDTO success(String message, String token) {
        return new LogoutAuthResponseDTO(true, message, token, java.time.Instant.now().toString());
    }

    public static LogoutAuthResponseDTO error(String message) {
        return new LogoutAuthResponseDTO(false, message, null, java.time.Instant.now().toString());
    }
}
