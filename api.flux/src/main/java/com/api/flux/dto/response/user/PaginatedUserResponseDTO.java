package com.api.flux.dto.response.user;

import org.springframework.data.domain.Page;

import java.time.Instant;
import java.util.List;

public record PaginatedUserResponseDTO<T>(
        boolean success,
        String message,
        List<T> content,
        PaginationInfoDTO pagination,
        String timestamp
) {
    public static <T> PaginatedUserResponseDTO<T> success(String message, Page<T> page) {
        return new PaginatedUserResponseDTO<T>(
                true,
                message,
                page.getContent(),
                new PaginationInfoDTO(
                        page.getNumber(),
                        page.getSize(),
                        page.getTotalElements(),
                        page.getTotalPages(),
                        page.isFirst(),
                        page.isLast(),
                        page.hasNext(),
                        page.hasPrevious()
                ),
                Instant.now().toString()
        );
    }

    public static <T> PaginatedUserResponseDTO<T> error(String message) {
        return new PaginatedUserResponseDTO<>(
                false,
                message,
                null,
                null,
                Instant.now().toString()
        );
    }
}