package com.api.flux.dto.response.balance;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record BalanceResponseDTO(
        String message,
        DataBalanceResponseDTO data
) {
    public static BalanceResponseDTO success(String message, DataBalanceResponseDTO data) {
        return new BalanceResponseDTO(message, data);
    }

    public static BalanceResponseDTO error(String message) {
        return new BalanceResponseDTO(message, null);
    }

    public static BalanceResponseDTO userNotFound(String message) {
        return new BalanceResponseDTO(message, null);
    }
}