package com.api.flux.service;

import com.api.flux.dto.response.lucai.DataLucAIResponseDTO;
import com.api.flux.dto.response.lucai.LucAIResponseDTO;
import com.api.flux.entity.LucAI;
import com.api.flux.mapper.LucAiMapper;
import com.api.flux.repository.LucaAIRepository;
import com.api.flux.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class LucAIService {
    private LucaAIRepository lucaAIRepository;
    private UserRepository userRepository;

    public LucAIService(LucaAIRepository lucaAIRepository, UserRepository userRepository) {
        this.lucaAIRepository = lucaAIRepository;
        this.userRepository = userRepository;
    }

    public ResponseEntity<LucAIResponseDTO> getConversationHistoryByUserId(UUID authenticatedUserId) {
        try {
            if (!userRepository.existsById(authenticatedUserId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(LucAIResponseDTO.userNotFound("User not found"));
            }

            Optional<LucAI> optionalLucAi = lucaAIRepository.findByUserId(authenticatedUserId);
            LucAI lucAI = optionalLucAi.get();

            DataLucAIResponseDTO dto = LucAiMapper.toDataDTO(lucAI);


            return ResponseEntity.ok(LucAIResponseDTO.success("Conversation history found.", dto));
        } catch (Exception exception) {
            return ResponseEntity.badRequest().body(LucAIResponseDTO.error("Internal server error."));
        }
    }
}
