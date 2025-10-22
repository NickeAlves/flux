package com.api.flux.controller;

import com.api.flux.dto.request.expense.CreateExpenseRequestDTO;
import com.api.flux.dto.response.expense.ResponseExpenseDTO;
import com.api.flux.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {
    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<ResponseExpenseDTO> createExpense(@Valid @RequestBody CreateExpenseRequestDTO dto) {
        return expenseService.createExpense(dto);
    }
}
