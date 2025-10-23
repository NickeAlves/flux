package com.api.flux.dto.response.income;

import java.time.Instant;

public record IncomeResponseDTO(boolean success,
                                String message,
                                DataIncomeResponseDTO income,
                                String timestamp) {
    public static IncomeResponseDTO success(String message, DataIncomeResponseDTO income) {
        return new IncomeResponseDTO(true, message, income, Instant.now().toString());
    }

    public static IncomeResponseDTO error(String message) {
        return new IncomeResponseDTO(false, message, null, Instant.now().toString());
    }

    public static IncomeResponseDTO incomeNotFound(String message) {
        return new IncomeResponseDTO(Boolean.FALSE, message, null, Instant.now().toString());
    }

    public static IncomeResponseDTO userNotFound(String message) {
        return new IncomeResponseDTO(false, message, null, Instant.now().toString());
    }
}
