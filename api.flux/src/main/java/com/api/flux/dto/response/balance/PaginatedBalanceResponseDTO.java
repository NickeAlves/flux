package com.api.flux.dto.response.balance;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.domain.Page;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record PaginatedBalanceResponseDTO<T>(
        String message,
        Page<T> data
) {
    public static <T> PaginatedBalanceResponseDTO<T> success(String message, Page<T> data) {
        return new PaginatedBalanceResponseDTO<>(message, data);
    }

    public static <T> PaginatedBalanceResponseDTO<T> error(String message) {
        return new PaginatedBalanceResponseDTO<>(message, null);
    }
}