package com.api.flux.dto.response.user;

import java.time.LocalDate;
import java.util.UUID;

public record DataUserDTO(UUID id,
                          String name,
                          String lastName,
                          String email,
                          LocalDate dateOfBirth,
                          Integer age) {
}
