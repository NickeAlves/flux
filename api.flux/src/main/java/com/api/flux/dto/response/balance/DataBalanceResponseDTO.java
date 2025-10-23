package com.api.flux.dto.response.balance;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record DataBalanceResponseDTO(
        UUID id,
        UUID userId,
        BigDecimal totalIncome,
        BigDecimal totalExpense,
        BigDecimal currentBalance,
        Instant calculatedAt,
        Instant createdAt
) {}