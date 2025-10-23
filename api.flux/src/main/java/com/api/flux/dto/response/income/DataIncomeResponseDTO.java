package com.api.flux.dto.response.income;

import com.api.flux.enums.IncomeCategory;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record DataIncomeResponseDTO(UUID id,
                                    UUID userId,
                                    String title,
                                    String description,
                                    IncomeCategory category,
                                    BigDecimal amount,
                                    Instant transactionDate) {
}
