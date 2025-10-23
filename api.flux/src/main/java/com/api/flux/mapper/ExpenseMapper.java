package com.api.flux.mapper;

import com.api.flux.dto.response.expense.DataExpenseResponseDTO;
import com.api.flux.entity.Expense;

public final class ExpenseMapper {
    private ExpenseMapper() {}

    public static DataExpenseResponseDTO toDataDTO(Expense expense) {
        return new DataExpenseResponseDTO(
                expense.getId(),
                expense.getUserId(),
                expense.getTitle(),
                expense.getDescription(),
                expense.getCategory(),
                expense.getAmount(),
                expense.getTransactionDate()
        );
    }
}
