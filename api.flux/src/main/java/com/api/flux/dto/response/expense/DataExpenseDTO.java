package com.api.flux.dto.response.expense;

import com.api.flux.enums.ExpenseCategory;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record DataExpenseDTO(UUID id,
                             UUID userId,
                             String title,
                             String description,
                             ExpenseCategory category,
                             BigDecimal amount,
                             Instant transactionDate) {
}
