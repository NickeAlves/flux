package com.api.flux.controller;

import com.api.flux.dto.request.gemini.PromptRequestDTO;
import com.api.flux.dto.response.gemini.PromptResponseDTO;
import com.api.flux.service.GeminiService;
import com.api.flux.utils.GetUserIdFromAuth;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/v1/api/gemini")
public class GeminiController {
    private final GeminiService geminiService;

    public GeminiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping
    public ResponseEntity<PromptResponseDTO> generateText(
            @RequestBody PromptRequestDTO request,
            Authentication authentication) {
        UUID authenticatedUserId = GetUserIdFromAuth.getId(authentication);
        return geminiService.generatePrompt(request.prompt(), authenticatedUserId);
    }
}