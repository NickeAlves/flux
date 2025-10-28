package com.api.flux.controller;

import com.api.flux.dto.response.balance.*;
import com.api.flux.security.CustomUserDetails;
import com.api.flux.service.BalanceService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping("/v1/balances")
public class BalanceController {
    private final BalanceService balanceService;

    public BalanceController(BalanceService balanceService) {
        this.balanceService = balanceService;
    }

    @GetMapping("/current")
    public ResponseEntity<BalanceResponseDTO> getCurrentBalance(Authentication authentication) {
        UUID authenticatedUserId = getUserIdFromAuth(authentication);
        return balanceService.getCurrentBalance(authenticatedUserId);
    }

    @GetMapping("/history")
    public ResponseEntity<PaginatedBalanceResponseDTO<DataBalanceResponseDTO>> getBalanceHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        UUID authenticatedUserId = getUserIdFromAuth(authentication);
        return balanceService.getBalanceHistory(authenticatedUserId, page, size);
    }

    @GetMapping("/history/period")
    public ResponseEntity<PaginatedBalanceResponseDTO<DataBalanceResponseDTO>> getBalanceByPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        UUID authenticatedUserId = getUserIdFromAuth(authentication);
        return balanceService.getBalanceHistoryByPeriod(authenticatedUserId, startDate, endDate, page, size);
    }

    @GetMapping("/expenses-incomes")
    public ResponseEntity<ExpensesAndIncomesDTO> getExpensesAndIncomeHistoryByUserId(Authentication authentication) {
        UUID authenticatedUserId = getUserIdFromAuth(authentication);
        return balanceService.getExpensesAndIncomeHistoryByUserId(authenticatedUserId);
    }

    @PostMapping("/calculate")
    public ResponseEntity<BalanceResponseDTO> calculateBalance(Authentication authentication) {
        UUID authenticatedUserId = getUserIdFromAuth(authentication);
        return balanceService.calculateAndSaveBalance(authenticatedUserId);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<DeleteBalanceResponseDTO> clearBalanceHistory(Authentication authentication) {
        UUID authenticatedUserId = getUserIdFromAuth(authentication);
        return balanceService.clearAllBalances(authenticatedUserId);
    }

    private UUID getUserIdFromAuth(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getId();
    }
}