package com.api.flux.entity;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Setter
@Getter
public class LucAIPrompt {
    private String userMessage;
    private String aiResponse;
    private Instant timestamp;

    public LucAIPrompt() {}

    public LucAIPrompt(String userMessage, String aiResponse, Instant timestamp) {
        this.userMessage = userMessage;
        this.aiResponse = aiResponse;
        this.timestamp = timestamp;
    }
}
