package com.api.flux.controller;

import com.api.flux.dto.request.expense.CreateExpenseRequestDTO;
import com.api.flux.dto.request.expense.UpdateExpenseRequestDTO;
import com.api.flux.dto.response.expense.DataExpenseDTO;
import com.api.flux.dto.response.expense.DeleteExpenseResponseDTO;
import com.api.flux.dto.response.expense.PaginatedExpenseResponseDTO;
import com.api.flux.dto.response.expense.ResponseExpenseDTO;
import com.api.flux.security.CustomUserDetails;
import com.api.flux.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
    public ResponseEntity<ResponseExpenseDTO> createExpense(
            @Valid @RequestBody CreateExpenseRequestDTO dto,
            Authentication authentication) {
        UUID authenticatedUserId = getUserIdFromAuth(authentication);
        return expenseService.createExpense(dto, authenticatedUserId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseExpenseDTO> updateExpenseById(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateExpenseRequestDTO dto,
            Authentication authentication) {
        UUID authenticatedUserId = getUserIdFromAuth(authentication);
        return expenseService.updateExpenseById(id, dto, authenticatedUserId);
    }

    @GetMapping
    public ResponseEntity<PaginatedExpenseResponseDTO<DataExpenseDTO>> listMyExpenses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "transactionDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            Authentication authentication) {
        UUID authenticatedUserId = getUserIdFromAuth(authentication);
        return expenseService.listExpensesByUserPaginated(authenticatedUserId, page, size, sortBy, sortDirection);
    }

    @GetMapping("/{expenseId}")
    public ResponseEntity<ResponseExpenseDTO> getExpenseById(
            @PathVariable UUID expenseId,
            Authentication authentication) {
        UUID authenticatedUserId = getUserIdFromAuth(authentication);
        return expenseService.findExpenseByIdAndValidateOwnership(expenseId, authenticatedUserId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteExpenseResponseDTO> deleteExpenseById(
            @PathVariable UUID id,
            Authentication authentication) {
        UUID authenticatedUserId = getUserIdFromAuth(authentication);
        return expenseService.deleteExpenseById(id, authenticatedUserId);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<DeleteExpenseResponseDTO> clearAllMyExpenses(
            Authentication authentication) {
        UUID authenticatedUserId = getUserIdFromAuth(authentication);
        return expenseService.clearAllExpensesByUserId(authenticatedUserId);
    }

    private UUID getUserIdFromAuth(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getId();
    }
}