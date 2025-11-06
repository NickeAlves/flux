package com.api.flux.entity;

import com.api.flux.enums.ExpenseCategory;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Setter
@Getter
@Document(collection = "expenses")
public class Expense {
    @Id
    private UUID id;

    private UUID userId;
    private String title;
    private String description;
    private ExpenseCategory category;
    private BigDecimal amount;
    private Instant transactionDate;

    public Expense() {
        this.id = UUID.randomUUID();
        this.transactionDate = Instant.now();
    }

    public Expense(UUID userId, String title, String description, ExpenseCategory category, BigDecimal amount, Instant transactionDate) {
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.category = category;
        this.amount = amount;
        this.transactionDate = transactionDate;
    }
}
