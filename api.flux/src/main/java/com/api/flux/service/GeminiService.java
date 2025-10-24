package com.api.flux.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public ResponseEntity generatePrompt(String prompt) {
        try {
            Client client = new Client();
            Client.builder().apiKey(geminiApiKey);

            GenerateContentResponse response =
                    client.models.generateContent(
                            "gemini-2.5-flash",
                            "Instrução de Sistema: Por favor, forneça todas as respostas como texto simples (plain text). Não utilize nenhuma formatação Markdown. Especificamente, não inclua asteriscos (*), barras invertidas (\\) ou outros caracteres de formatação como também para pular linha. A resposta deve ser um texto limpo, sem marcadores ou ênfase, pronto para exibição direta." + prompt,
                            null
                    );

            if (response.text().isEmpty()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
