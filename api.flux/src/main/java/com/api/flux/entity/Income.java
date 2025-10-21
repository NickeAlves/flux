package com.api.flux.entity;

import com.api.flux.enums.IncomeCategory;
import jakarta.persistence.PrePersist;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

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
    }

    public Income(UUID userId, String title, String description, IncomeCategory category, BigDecimal amount, Instant transactionDate) {
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.category = category;
        this.amount = amount;
        this.transactionDate = transactionDate;
    }

    @PrePersist
    public void generateId() {
        if (id == null) {
            id = UUID.randomUUID();
        }
    }

    public UUID getId() {
        return id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public IncomeCategory getCategory() {
        return category;
    }

    public void setCategory(IncomeCategory category) {
        this.category = category;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Instant getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(Instant transactionDate) {
        this.transactionDate = transactionDate;
    }
}
