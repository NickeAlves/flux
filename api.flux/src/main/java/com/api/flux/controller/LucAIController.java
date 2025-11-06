package com.api.flux.controller;

import com.api.flux.dto.response.lucai.LucAIResponseDTO;
import com.api.flux.service.LucAIService;
import com.api.flux.utils.GetUserIdFromAuth;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/v1/lucai")
public class LucAIController {
    private LucAIService lucAIService;

    public LucAIController(LucAIService lucAIService) {
        this.lucAIService = lucAIService;
    }

    @GetMapping
    public ResponseEntity<LucAIResponseDTO> getConversationByUserId(Authentication authentication) {
        UUID authenticatedUserId = GetUserIdFromAuth.getId(authentication);
        return lucAIService.getConversationHistoryByUserId(authenticatedUserId);
    }
}
