package com.api.flux.dto.response.balance;

import com.api.flux.entity.Expense;
import com.api.flux.entity.Income;

import java.time.Instant;
import java.util.List;

public record ExpensesAndIncomesDTO(boolean success,
                                    String message,
                                    List<Expense> expenses,
                                    List<Income> incomes,
                                    String timestamp
) {
    public static ExpensesAndIncomesDTO success(String message,
                                                List<Expense> expenses,
                                                List<Income> incomes) {
        return new ExpensesAndIncomesDTO(true, message, expenses, incomes, Instant.now().toString());
    }

    public static ExpensesAndIncomesDTO userNotFound(String message) {
        return new ExpensesAndIncomesDTO(false, message, null, null, Instant.now().toString());
    }

    public static ExpensesAndIncomesDTO error(String message) {
        return new ExpensesAndIncomesDTO(false, message, null, null, Instant.now().toString());
    }
}
