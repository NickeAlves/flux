package com.api.flux.dto.request.income;

import com.api.flux.enums.IncomeCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record CreateIncomeRequestDTO(@NotNull(message = "The user ID is required")
                                     UUID userId,

                                     @NotBlank(message = "Title is required")
                                     @Size(max = 50, message = "Title must not exceed 50 characters")
                                     String title,

                                     @Size(max = 255, message = "Description must not exceed 255 characters")
                                     String description,

                                     @NotNull(message = "Category is required")
                                     IncomeCategory category,

                                     @NotNull(message = "Amount is required")
                                     @Positive(message = "The amount must be greater than zero")
                                     BigDecimal amount,

                                     @NotNull(message = "Transaction date is required")
                                     Instant transactionDate) {
}
