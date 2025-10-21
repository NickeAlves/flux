package com.api.flux.dto.request.auth;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record RegisterAuthRequestDTO(@NotBlank(message = "Name is required")
                                     @Size(max = 50)
                                     String name,

                                     @NotBlank(message = "Last name is required")
                                     @Size(max = 50)
                                     String lastName,

                                     @NotNull
                                     @Past
                                     @JsonFormat(pattern = "MM/dd/yyyy")
                                     LocalDate dateOfBirth,

                                     @Email
                                     @NotBlank(message = "Email is required")
                                     String email,

                                     @NotBlank(message = "Password is required")
                                     @Size(min = 6, max = 100, message = "Password must be a minimum of 6 characters")
                                     String password,

                                     String profileImageUrl) {
}
