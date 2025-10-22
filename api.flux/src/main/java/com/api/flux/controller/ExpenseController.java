package com.api.flux.controller;

import com.api.flux.dto.request.expense.CreateExpenseRequestDTO;
import com.api.flux.dto.response.expense.DataExpenseDTO;
import com.api.flux.dto.response.expense.DeleteExpenseResponseDTO;
import com.api.flux.dto.response.expense.PaginatedExpenseResponseDTO;
import com.api.flux.dto.response.expense.ResponseExpenseDTO;
import com.api.flux.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

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

    @GetMapping("/user/{userId}")
    public ResponseEntity<PaginatedExpenseResponseDTO<DataExpenseDTO>> listExpensesByUser(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "transactionDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection
    ) {
        return expenseService.listExpensesByUserPaginated(userId, page, size, sortBy, sortDirection);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteExpenseResponseDTO> deleteExpenseById(@PathVariable UUID id) {
        return expenseService.deleteExpenseById(id);
    }
}
