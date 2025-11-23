package com.api.flux.controller;

import com.api.flux.dto.request.income.CreateIncomeRequestDTO;
import com.api.flux.dto.request.income.UpdateIncomeRequestDTO;
import com.api.flux.dto.response.income.DataIncomeResponseDTO;
import com.api.flux.dto.response.income.DeleteIncomeResponseDTO;
import com.api.flux.dto.response.income.IncomeResponseDTO;
import com.api.flux.dto.response.income.PaginatedIncomeResponseDTO;
import com.api.flux.service.IncomeService;
import com.api.flux.utils.GetUserIdFromAuth;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/incomes")
public class IncomeController {
    private final IncomeService incomeService;

    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    @PostMapping
    public ResponseEntity<List<IncomeResponseDTO>> createIncomes(
            @Valid @RequestBody List<CreateIncomeRequestDTO> dtoList,
            Authentication authentication) {
        UUID authenticatedUserId = GetUserIdFromAuth.getId(authentication);
        return incomeService.createIncomes(dtoList, authenticatedUserId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncomeResponseDTO> updateIncomeById(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateIncomeRequestDTO dto,
            Authentication authentication) {
        UUID authenticatedUserId = GetUserIdFromAuth.getId(authentication);
        return incomeService.updateIncomeById(id, dto, authenticatedUserId);
    }

    @GetMapping
    public ResponseEntity<PaginatedIncomeResponseDTO<DataIncomeResponseDTO>> getMyIncomes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "transactionDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            Authentication authentication) {
        UUID authenticatedUserId = GetUserIdFromAuth.getId(authentication);
        return incomeService.listIncomesByUserPaginated(authenticatedUserId, page, size, sortBy, sortDirection);
    }

    @GetMapping("/{incomeId}")
    public ResponseEntity<IncomeResponseDTO> getIncomeById(
            @PathVariable UUID incomeId,
            Authentication authentication) {
        UUID authenticatedUserId = GetUserIdFromAuth.getId(authentication);
        return incomeService.findIncomeByIdAndValidateOwnership(incomeId, authenticatedUserId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteIncomeResponseDTO> deleteIncomeById(
            @PathVariable UUID id,
            Authentication authentication) {
        UUID authenticatedUserId = GetUserIdFromAuth.getId(authentication);
        return incomeService.deleteIncomeById(id, authenticatedUserId);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<DeleteIncomeResponseDTO> clearAllMyIncomes(
            Authentication authentication) {
        UUID authenticatedUserId = GetUserIdFromAuth.getId(authentication);
        return incomeService.clearAllIncomesByUserId(authenticatedUserId);
    }
}