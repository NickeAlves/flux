package com.api.flux.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.UUID;

@Document(collection = "balances")
public class Balance {
    @Id
    private UUID id;

    private UUID userId;
    private BigDecimal amount;
}
