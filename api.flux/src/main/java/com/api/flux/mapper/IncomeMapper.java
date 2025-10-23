package com.api.flux.mapper;

import com.api.flux.dto.response.income.DataIncomeResponseDTO;
import com.api.flux.entity.Income;

public final class IncomeMapper {
    private IncomeMapper() {}

    public static DataIncomeResponseDTO toDataDTO(Income income) {
        return new DataIncomeResponseDTO(
                income.getId(),
                income.getUserId(),
                income.getTitle(),
                income.getDescription(),
                income.getCategory(),
                income.getAmount(),
                income.getTransactionDate()
        );
    }
}
