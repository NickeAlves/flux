package com.api.flux.utils;

public record PaginationInfo(
        int currentPage,
        int pageSize,
        long totalElements,
        int totalPages,
        boolean isFirst,
        boolean isLast,
        boolean hasNext,
        boolean hasPrevious
) {
}