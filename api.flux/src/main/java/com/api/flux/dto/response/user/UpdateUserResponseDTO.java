package com.api.flux.dto.response.user;

public record UpdateUserResponseDTO(boolean success,
                                    String message,
                                    DataUserDTO user,
                                    String token,
                                    String timestamp) {
    public static UpdateUserResponseDTO success(String message, DataUserDTO user, String token) {
        return new UpdateUserResponseDTO(true, message, user, token, java.time.Instant.now().toString());
    }

    public static UpdateUserResponseDTO error(String message) {
        return new UpdateUserResponseDTO(false, message, null, null, java.time.Instant.now().toString());
    }

    public static UpdateUserResponseDTO notFound(String message) {
        return new UpdateUserResponseDTO(false, message, null, null, java.time.Instant.now().toString());
    }
}
