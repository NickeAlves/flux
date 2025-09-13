package com.api.flux.dto.response.user;

import java.time.Instant;

public record DeleteUserResponseDTO(Boolean success,
                                    String message,
                                    String token,
                                    String timestamp) {
    public static DeleteUserResponseDTO success(String message) {
        return new DeleteUserResponseDTO(true, message, null, Instant.now().toString());
    }

    public static DeleteUserResponseDTO error(String message) {
        return new DeleteUserResponseDTO(false, message, null, Instant.now().toString());
    }

    public static DeleteUserResponseDTO notFound(String message) {
        return new DeleteUserResponseDTO(false, message, null, Instant.now().toString());
    }
}
