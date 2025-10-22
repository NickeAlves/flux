package com.api.flux.dto.response.expense;

import java.time.Instant;

public record ResponseExpenseDTO(boolean success,
                                 String message,
                                 DataExpenseDTO expense,
                                 String timestamp) {
    public static ResponseExpenseDTO success(String message, DataExpenseDTO expense) {
        return new ResponseExpenseDTO(true, message, expense, Instant.now().toString());
    }

    public static ResponseExpenseDTO error(String message) {
        return new ResponseExpenseDTO(false, message, null, Instant.now().toString());
    }

    public static ResponseExpenseDTO userNotFound(String message) {
        return new ResponseExpenseDTO(false, message, null, Instant.now().toString());
    }
}
