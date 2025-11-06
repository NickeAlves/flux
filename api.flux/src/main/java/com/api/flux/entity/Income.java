package com.api.flux.entity;

import com.api.flux.enums.IncomeCategory;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Setter
@Getter
@Document(collection = "incomes")
public class Income {
    @Id
    private UUID id;

    private UUID userId;
    private String title;
    private String description;
    private IncomeCategory category;
    private BigDecimal amount;
    private Instant transactionDate;

    public Income() {
        this.id = UUID.randomUUID();
        this.transactionDate = Instant.now();
    }

    public Income(UUID userId, String title, String description, IncomeCategory category, BigDecimal amount, Instant transactionDate) {
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.category = category;
        this.amount = amount;
        this.transactionDate = transactionDate;
    }
}
