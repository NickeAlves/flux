package com.api.flux.dto.request.expense;

import com.api.flux.enums.ExpenseCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record CreateExpenseRequestDTO(@NotNull(message = "The user ID is required")
                                      UUID userId,

                                      @NotBlank(message = "Title is required")
                                      @Size(max = 50)
                                      String title,

                                      String description,

                                      @NotNull(message = "Category is required")
                                      ExpenseCategory category,

                                      @NotNull(message = "Amount is required")
                                      @Positive(message = "The amount is required to be greater than zero")
                                      BigDecimal amount,

                                      @NotNull(message = "Transaction date is required")
                                      Instant transactionDate
                                      ) {
}
