package com.api.flux.mapper;

import com.api.flux.dto.response.lucai.DataLucAIResponseDTO;
import com.api.flux.entity.LucAI;

public final class LucAiMapper {
    private LucAiMapper() {}

    public static DataLucAIResponseDTO toDataDTO(LucAI lucAI) {
        if (lucAI == null) {
            return null;
        }

        return new DataLucAIResponseDTO(
                lucAI.getId(),
                lucAI.getUserId(),
                lucAI.getConversationHistory(),
                lucAI.getLongTermContext(),
                lucAI.getCreatedAt(),
                lucAI.getUpdatedAt()
        );
    }

}
