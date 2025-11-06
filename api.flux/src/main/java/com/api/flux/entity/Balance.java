package com.api.flux.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Setter
@Getter
@Document(collection = "balances")
@CompoundIndexes({
        @CompoundIndex(name = "userId_calculatedAt", def = "{'userId': 1, 'calculatedAt': -1}")
})
public class Balance {
    @Id
    private UUID id;

    private UUID userId;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal currentBalance;
    private Instant calculatedAt;
    @CreatedDate
    private Instant createdAt;

    public Balance() {
        this.id = UUID.randomUUID();
        this.calculatedAt = Instant.now();
        this.createdAt = Instant.now();
    }

    public Balance(UUID userId, BigDecimal totalIncome, BigDecimal totalExpense) {
        this.id = UUID.randomUUID();
        this.userId = userId;
        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
        this.currentBalance = totalIncome.subtract(totalExpense);
        this.calculatedAt = Instant.now();
    }
}