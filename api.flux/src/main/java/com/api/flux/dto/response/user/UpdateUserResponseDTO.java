package com.api.flux.dto.response.user;

public record UpdateUserResponseDTO(boolean success,
                                    String message,
                                    DataUserDTO user,
                                    String timestamp) {
    public static UpdateUserResponseDTO success(String message, DataUserDTO user) {
        return new UpdateUserResponseDTO(true, message, user, java.time.Instant.now().toString());
    }

    public static UpdateUserResponseDTO error(String message) {
        return new UpdateUserResponseDTO(false, message, null, java.time.Instant.now().toString());
    }
}
