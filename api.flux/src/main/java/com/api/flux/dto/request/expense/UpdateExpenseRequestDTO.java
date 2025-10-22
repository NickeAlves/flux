package com.api.flux.dto.request.expense;

import com.api.flux.enums.ExpenseCategory;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record UpdateExpenseRequestDTO(@NotBlank(message = "Title is required")
                                      @Size(max = 50)
                                      String title,

                                      String description,

                                      @NotNull(message = "Category is required")
                                      ExpenseCategory category,

                                      @NotNull(message = "Amount is required")
                                      BigDecimal amount,

                                      @NotNull(message = "Transaction date is required")
                                      Instant transactionDate) {
}
