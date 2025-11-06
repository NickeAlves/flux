package com.api.flux.dto.response.lucai;

import java.time.Instant;

public record LucAIResponseDTO(boolean success,
                               String message,
                               DataLucAIResponseDTO lucai,
                               String timestamp) {
    public static LucAIResponseDTO success(String message, DataLucAIResponseDTO lucai) {
        return new LucAIResponseDTO(true, message, lucai, Instant.now().toString());
    }

    public static LucAIResponseDTO error(String message) {
        return new LucAIResponseDTO(false, message, null, Instant.now().toString());
    }

    public static LucAIResponseDTO userNotFound(String message) {
        return new LucAIResponseDTO(false, message, null, Instant.now().toString());
    }
}
