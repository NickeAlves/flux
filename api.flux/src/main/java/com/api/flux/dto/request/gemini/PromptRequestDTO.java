package com.api.flux.dto.request.gemini;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PromptRequestDTO(@NotBlank(message = "Prompt cannot be empty")
                               @Size(max = 2000, message = "Prompt must not exceed 2000 characters")
                               String prompt) {


}