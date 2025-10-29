package com.api.flux.dto.request.gemini;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PromptRequestDTO {
    @NotBlank(message = "Prompt cannot be empty")
    @Size(max = 2000, message = "Prompt must not exceed 2000 characters")
    private String prompt;

    public PromptRequestDTO() {}

    public PromptRequestDTO(String prompt) {
        this.prompt = prompt;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }
}