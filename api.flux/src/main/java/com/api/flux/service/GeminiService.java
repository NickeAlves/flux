package com.api.flux.service;

import com.api.flux.dto.response.gemini.PromptResponseDTO;
import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class GeminiService {
    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public ResponseEntity<PromptResponseDTO> generatePrompt(String prompt) {
        try {
            Client client = new Client();
            Client.builder().apiKey(geminiApiKey);

            GenerateContentConfig config =
                    GenerateContentConfig.builder()
                            .systemInstruction(
                                    Content.fromParts(Part.fromText("You are an AI agent named LucAI. You help the users of my financial management platform manage their expenses, incomes, and balances. You provide insights and advice on how to achieve their financial goals, suggesting ways to save money and improve budgeting. You can identify recurring monthly expenses, summarize spending over the last 30 days, and highlight the categories where users have spent the most during the month.")))
                            .build();

            GenerateContentResponse response =
                    client.models.generateContent(
                            "gemini-2.5-flash",
                            "System Instruction: Please provide all responses as plain text. Do not use any Markdown formatting. Specifically, do not include asterisks, backslashes, or any other formatting characters, and do not use line breaks. The response must be clean text, without bullets or emphasis, ready for direct display." + prompt,
                            config
                    );

            if (Objects.requireNonNull(response.text()).isEmpty()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(PromptResponseDTO.error("Internal server error."));
            }

            return ResponseEntity
                    .ok(PromptResponseDTO.success("Generated successfully!", response.text()));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
