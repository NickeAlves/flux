package com.api.flux.dto.response.expense;

import com.api.flux.utils.PaginationInfo;
import org.springframework.data.domain.Page;

import java.time.Instant;
import java.util.List;

public record PaginatedExpenseResponseDTO<T>(
        boolean success,
        String message,
        List<T> content,
        PaginationInfo pagination,
        String timestamp
) {
    public static <T> PaginatedExpenseResponseDTO<T> success(String message, Page<T> page) {
        return new PaginatedExpenseResponseDTO<T>(
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

    public static <T> PaginatedExpenseResponseDTO<T> error(String message) {
        return new PaginatedExpenseResponseDTO<>(
                false,
                message,
                null,
                null,
                Instant.now().toString()
        );
    }
}
