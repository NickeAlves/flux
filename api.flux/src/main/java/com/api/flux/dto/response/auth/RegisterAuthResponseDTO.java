package com.api.flux.dto.response.auth;

import com.api.flux.dto.response.user.DataUserDTO;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record RegisterAuthResponseDTO(boolean success,
                                      String message,
                                      String token,
                                      DataUserDTO user,
                                      String timestamp) {
    public static RegisterAuthResponseDTO success(String message, String token, DataUserDTO user) {
        return new RegisterAuthResponseDTO(true, message, token, user, Instant.now().toString());
    }

    public static RegisterAuthResponseDTO error(String message) {
        return new RegisterAuthResponseDTO(false, message, null, null, Instant.now().toString());
    }
}
