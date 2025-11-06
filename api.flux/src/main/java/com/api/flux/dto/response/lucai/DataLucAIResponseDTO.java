package com.api.flux.dto.response.lucai;

import com.api.flux.entity.LucAIPrompt;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record DataLucAIResponseDTO(UUID id,
                                   UUID userId,
                                   List<LucAIPrompt> conversationHistory,
                                   Map<String, Object> longTermContext,
                                   Instant createdAt,
                                   Instant updatedAt) {
}
