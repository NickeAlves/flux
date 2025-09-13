package com.api.flux.dto.response.user;

import java.time.Instant;

public record ResponseUserDTO(boolean success,
                              String message,
                              DataUserDTO user,
                              String timestamp) {
    public static ResponseUserDTO success(String message, DataUserDTO user) {
        return new ResponseUserDTO(true, message, user, Instant.now().toString());
    }

    public static ResponseUserDTO error(String message) {
        return new ResponseUserDTO(false, message, null, Instant.now().toString());
    }

    public static ResponseUserDTO notFound(String message) {
        return new ResponseUserDTO(false, message, null, Instant.now().toString());
    }
}
