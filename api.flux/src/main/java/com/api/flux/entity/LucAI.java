package com.api.flux.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Setter
@Getter
@Document(collection = "lucai_contexts")
public class LucAI {

    @Id
    private UUID id;

    private UUID userId;
    private List<LucAIPrompt> conversationHistory;
    private Map<String, Object> longTermContext;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public LucAI() {
        this.id = UUID.randomUUID();
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public LucAI(UUID userId, List<LucAIPrompt> conversationHistory, Map<String, Object> longTermContext) {
        this.id = UUID.randomUUID();
        this.userId = userId;
        this.conversationHistory = conversationHistory;
        this.longTermContext = longTermContext;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }
}
