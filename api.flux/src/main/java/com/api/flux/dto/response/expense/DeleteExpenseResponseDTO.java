package com.api.flux.dto.response.expense;

import java.time.Instant;

public record DeleteExpenseResponseDTO(boolean success,
                                    String message,
                                    String timestamp) {
    public static DeleteExpenseResponseDTO success(String message) {
        return new DeleteExpenseResponseDTO(Boolean.TRUE, message, Instant.now().toString());
    }

    public static DeleteExpenseResponseDTO error(String message) {
        return new DeleteExpenseResponseDTO(Boolean.FALSE, message, Instant.now().toString());
    }

    public static DeleteExpenseResponseDTO notFound(String message) {
        return new DeleteExpenseResponseDTO(Boolean.FALSE, message, Instant.now().toString());
    }
}
