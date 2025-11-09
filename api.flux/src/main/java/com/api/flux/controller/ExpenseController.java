package com.api.flux.controller;

import com.api.flux.dto.request.expense.CreateExpenseRequestDTO;
import com.api.flux.dto.request.expense.UpdateExpenseRequestDTO;
import com.api.flux.dto.request.income.CreateIncomeRequestDTO;
import com.api.flux.dto.response.expense.DataExpenseResponseDTO;
import com.api.flux.dto.response.expense.DeleteExpenseResponseDTO;
import com.api.flux.dto.response.expense.ExpenseResponseDTO;
import com.api.flux.dto.response.expense.PaginatedExpenseResponseDTO;
import com.api.flux.service.ExpenseService;
import com.api.flux.utils.GetUserIdFromAuth;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/expenses")
public class ExpenseController {
    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<ExpenseResponseDTO> createExpense(
            @Valid @RequestBody CreateExpenseRequestDTO dto,
            Authentication authentication) {
        UUID authenticatedUserId = GetUserIdFromAuth.getId(authentication);
        return expenseService.createExpense(dto, authenticatedUserId);
    }

    @PostMapping("/create-multiple-expenses")
    public ResponseEntity<List<ExpenseResponseDTO>> createMultipleExpenses(
            @Valid @RequestBody List<CreateExpenseRequestDTO> dtoList,
            Authentication authentication) {
        UUID authenticatedUserId = GetUserIdFromAuth.getId(authentication);
        return expenseService.createMultipleExpenses(dtoList, authenticatedUserId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponseDTO> updateExpenseById(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateExpenseRequestDTO dto,
            Authentication authentication) {
        UUID authenticatedUserId = GetUserIdFromAuth.getId(authentication);
        return expenseService.updateExpenseById(id, dto, authenticatedUserId);
    }

    @GetMapping
    public ResponseEntity<PaginatedExpenseResponseDTO<DataExpenseResponseDTO>> listMyExpenses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "transactionDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            Authentication authentication) {
        UUID authenticatedUserId = GetUserIdFromAuth.getId(authentication);
        return expenseService.listExpensesByUserPaginated(authenticatedUserId, page, size, sortBy, sortDirection);
    }

    @GetMapping("/{expenseId}")
    public ResponseEntity<ExpenseResponseDTO> getExpenseById(
            @PathVariable UUID expenseId,
            Authentication authentication) {
        UUID authenticatedUserId = GetUserIdFromAuth.getId(authentication);
        return expenseService.findExpenseByIdAndValidateOwnership(expenseId, authenticatedUserId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteExpenseResponseDTO> deleteExpenseById(
            @PathVariable UUID id,
            Authentication authentication) {
        UUID authenticatedUserId = GetUserIdFromAuth.getId(authentication);
        return expenseService.deleteExpenseById(id, authenticatedUserId);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<DeleteExpenseResponseDTO> clearAllMyExpenses(
            Authentication authentication) {
        UUID authenticatedUserId = GetUserIdFromAuth.getId(authentication);
        return expenseService.clearAllExpensesByUserId(authenticatedUserId);
    }
}