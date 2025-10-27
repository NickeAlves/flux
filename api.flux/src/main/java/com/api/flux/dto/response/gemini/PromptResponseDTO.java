package com.api.flux.dto.response.gemini;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record PromptResponseDTO(boolean success,
                                String message,
                                String text,
                                String timestamp) {
    public static PromptResponseDTO success(String message, String text) {
        return new PromptResponseDTO(true, message, text, Instant.now().toString());
    }

    public static PromptResponseDTO error(String message) {
        return new PromptResponseDTO(false, message, null, Instant.now().toString());
    }
}
