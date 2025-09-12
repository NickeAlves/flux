package com.api.flux.dto.request.user;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record UpdateUserRequestDTO(String name,
                                   String lastName,
                                   String email,
                                   String password) {
}
