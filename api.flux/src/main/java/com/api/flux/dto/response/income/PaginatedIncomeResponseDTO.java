package com.api.flux.dto.response.income;

import com.api.flux.utils.PaginationInfo;
import org.springframework.data.domain.Page;

import java.time.Instant;
import java.util.List;

public record PaginatedIncomeResponseDTO<T>(
        boolean success,
        String message,
        List<T> content,
        PaginationInfo pagination,
        String timestamp
) {
    public static <T> PaginatedIncomeResponseDTO<T> success(String message, Page<T> page) {
        return new PaginatedIncomeResponseDTO<T>(
                true,
                message,
                page.getContent(),
                new PaginationInfo(
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

    public static <T> PaginatedIncomeResponseDTO<T> error(String message) {
        return new PaginatedIncomeResponseDTO<>(
                false,
                message,
                null,
                null,
                Instant.now().toString()
        );
    }
}
