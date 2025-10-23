package com.api.flux.dto.response.expense;

import java.time.Instant;

public record ExpenseResponseDTO(boolean success,
                                 String message,
                                 DataExpenseResponseDTO expense,
                                 String timestamp) {
    public static ExpenseResponseDTO success(String message, DataExpenseResponseDTO expense) {
        return new ExpenseResponseDTO(true, message, expense, Instant.now().toString());
    }

    public static ExpenseResponseDTO error(String message) {
        return new ExpenseResponseDTO(false, message, null, Instant.now().toString());
    }

    public static ExpenseResponseDTO expenseNotFound(String message) {
        return new ExpenseResponseDTO(Boolean.FALSE, message, null, Instant.now().toString());
    }

    public static ExpenseResponseDTO userNotFound(String message) {
        return new ExpenseResponseDTO(false, message, null, Instant.now().toString());
    }
}
