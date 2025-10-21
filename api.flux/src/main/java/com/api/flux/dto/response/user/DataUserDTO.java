package com.api.flux.dto.response.user;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.util.UUID;

public record DataUserDTO(UUID id,
                          String name,
                          String lastName,
                          String email,
                          @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "MM/dd/yyyy")
                          LocalDate dateOfBirth,
                          Integer age,
                          String profileImageUrl) {
}
