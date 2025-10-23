package com.api.flux.dto.response.balance;

public record DeleteBalanceResponseDTO(String message) {
    public static DeleteBalanceResponseDTO success(String message) {
        return new DeleteBalanceResponseDTO(message);
    }

    public static DeleteBalanceResponseDTO error(String message) {
        return new DeleteBalanceResponseDTO(message);
    }

    public static DeleteBalanceResponseDTO userNotFound(String message) {
        return new DeleteBalanceResponseDTO(message);
    }
}