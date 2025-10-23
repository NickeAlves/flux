package com.api.flux.dto.request.income;

import com.api.flux.enums.IncomeCategory;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record UpdateIncomeRequestDTO(@NotBlank(message = "Title is required")
                                     @Size(max = 50)
                                     String title,

                                     String description,

                                     @NotNull(message = "Category is required")
                                     IncomeCategory category,

                                     @NotNull(message = "Amount is required")
                                     BigDecimal amount,

                                     @NotNull(message = "Transaction date is required")
                                     Instant transactionDate) {
}
