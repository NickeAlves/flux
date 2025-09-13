package com.api.flux.dto.response.auth;

import com.api.flux.dto.response.user.DataUserDTO;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record LoginAuthResponseDTO(boolean success,
                                   String message,
                                   String token,
                                   DataUserDTO user,
                                   String timestamp) {
    public static LoginAuthResponseDTO success(String message, String token, DataUserDTO user) {
        return new LoginAuthResponseDTO(true, message, token, user, Instant.now().toString());
    }

    public static LoginAuthResponseDTO error(String message) {
        return new LoginAuthResponseDTO(false, message, null, null, Instant.now().toString());
    }
}
