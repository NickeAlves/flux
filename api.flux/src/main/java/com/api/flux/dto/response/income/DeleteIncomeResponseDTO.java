package com.api.flux.dto.response.income;

import java.time.Instant;

public record DeleteIncomeResponseDTO(boolean success,
                                      String message,
                                      String timestamp) {
    public static DeleteIncomeResponseDTO success(String message) {
        return new DeleteIncomeResponseDTO(Boolean.TRUE, message, Instant.now().toString());
    }

    public static DeleteIncomeResponseDTO error(String message) {
        return new DeleteIncomeResponseDTO(Boolean.FALSE, message, Instant.now().toString());
    }

    public static DeleteIncomeResponseDTO incomeNotFound(String message) {
        return new DeleteIncomeResponseDTO(Boolean.FALSE, message, Instant.now().toString());
    }

    public static DeleteIncomeResponseDTO userNotFound(String message) {
        return new DeleteIncomeResponseDTO(false, message, Instant.now().toString());
    }
}
