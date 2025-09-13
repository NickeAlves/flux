package com.api.flux.dto.response.user;

import java.time.Instant;

public record UpdateUserResponseDTO(boolean success,
                                    String message,
                                    DataUserDTO user,
                                    String token,
                                    String timestamp) {
    public static UpdateUserResponseDTO success(String message, DataUserDTO user, String token) {
        return new UpdateUserResponseDTO(true, message, user, token, Instant.now().toString());
    }

    public static UpdateUserResponseDTO error(String message) {
        return new UpdateUserResponseDTO(false, message, null, null, Instant.now().toString());
    }

    public static UpdateUserResponseDTO notFound(String message) {
        return new UpdateUserResponseDTO(false, message, null, null, Instant.now().toString());
    }
}
