package com.api.flux.service;

import com.api.flux.dto.response.balance.*;
import com.api.flux.dto.response.expense.DataExpenseResponseDTO;
import com.api.flux.dto.response.income.DataIncomeResponseDTO;
import com.api.flux.entity.Balance;
import com.api.flux.entity.Expense;
import com.api.flux.entity.Income;
import com.api.flux.mapper.BalanceMapper;
import com.api.flux.mapper.ExpenseMapper;
import com.api.flux.mapper.IncomeMapper;
import com.api.flux.repository.BalanceRepository;
import com.api.flux.repository.ExpenseRepository;
import com.api.flux.repository.IncomeRepository;
import com.api.flux.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BalanceService {
    private static final Logger logger = LoggerFactory.getLogger(BalanceService.class);

    private final BalanceRepository balanceRepository;
    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public BalanceService(BalanceRepository balanceRepository,
                          IncomeRepository incomeRepository,
                          ExpenseRepository expenseRepository,
                          UserRepository userRepository) {
        this.balanceRepository = balanceRepository;
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    public ResponseEntity<BalanceResponseDTO> getCurrentBalance(UUID authenticatedUserId) {
        try {
            if (!userRepository.existsById(authenticatedUserId)) {
                logger.warn("User not found with ID: {}, please check user ID.", authenticatedUserId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(BalanceResponseDTO.userNotFound("User not found"));
            }

            Optional<Balance> optionalBalance = balanceRepository
                    .findFirstByUserIdOrderByCalculatedAtDesc(authenticatedUserId);

            if (optionalBalance.isEmpty()) {
                logger.info("No balance found for user {}, calculating new one", authenticatedUserId);
                return calculateAndSaveBalance(authenticatedUserId);
            }

            Balance balance = optionalBalance.get();
            DataBalanceResponseDTO dataBalanceResponseDTO = BalanceMapper.toDataDTO(balance);

            logger.info("Current balance retrieved for user {}", authenticatedUserId);
            return ResponseEntity.ok(BalanceResponseDTO.success("Current balance retrieved successfully", dataBalanceResponseDTO));

        } catch (Exception exception) {
            logger.error("Error retrieving current balance for user {}: ", authenticatedUserId, exception);
            return ResponseEntity.internalServerError()
                    .body(BalanceResponseDTO.error("Internal server error occurred while retrieving balance"));
        }
    }

    public ResponseEntity<ExpensesAndIncomesDTO> getExpensesAndIncomeHistoryByUserId(UUID authenticatedUserId) {
        try {
            if (!userRepository.existsById(authenticatedUserId)) {
                logger.warn("User not found with ID: {}, please check user ID.", authenticatedUserId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ExpensesAndIncomesDTO.userNotFound("User not found."));
            }

            List<Expense> expenses = expenseRepository.findByUserId(authenticatedUserId);
            List<Income> incomes = incomeRepository.findByUserId(authenticatedUserId);

            return ResponseEntity.ok(ExpensesAndIncomesDTO.success("Expenses and incomes found successfully!", expenses, incomes));
        } catch (Exception exception) {
            logger.error("Error retrieving expenses and incomes for user {}: ", authenticatedUserId, exception);
            return ResponseEntity.internalServerError()
                    .body(ExpensesAndIncomesDTO.error("Internal server error occurred while retrieving balance"));
        }
    }

    public ResponseEntity<PaginatedBalanceResponseDTO<DataBalanceResponseDTO>> getBalanceHistory(
            UUID authenticatedUserId, int page, int size) {
        try {
            if (!userRepository.existsById(authenticatedUserId)) {
                logger.warn("User not found with ID: {}", authenticatedUserId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(PaginatedBalanceResponseDTO.error("User not found"));
            }

            if (page < 0) page = 0;
            if (size <= 0 || size > 100) size = 10;

            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "calculatedAt"));
            Page<Balance> balancesPage = balanceRepository.findByUserIdOrderByCalculatedAtDesc(authenticatedUserId, pageable);

            Page<DataBalanceResponseDTO> balanceDTOsPage = balancesPage.map(BalanceMapper::toDataDTO);

            logger.info("Balance history retrieved for user {}", authenticatedUserId);
            return ResponseEntity.ok(PaginatedBalanceResponseDTO.success("Balance history retrieved successfully", balanceDTOsPage));

        } catch (Exception exception) {
            logger.error("Error listing balance history for user {}: ", authenticatedUserId, exception);
            return ResponseEntity.internalServerError()
                    .body(PaginatedBalanceResponseDTO.error("Internal server error occurred while retrieving balance history"));
        }
    }

    public ResponseEntity<PaginatedBalanceResponseDTO<DataBalanceResponseDTO>> getBalanceHistoryByPeriod(
            UUID authenticatedUserId, Instant startDate, Instant endDate, int page, int size) {
        try {
            if (!userRepository.existsById(authenticatedUserId)) {
                logger.warn("User not found with ID: {}", authenticatedUserId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(PaginatedBalanceResponseDTO.error("User not found"));
            }

            if (startDate.isAfter(endDate)) {
                logger.warn("Invalid date range: startDate is after endDate");
                return ResponseEntity.badRequest()
                        .body(PaginatedBalanceResponseDTO.error("Start date must be before end date"));
            }

            if (page < 0) page = 0;
            if (size <= 0 || size > 100) size = 10;

            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "calculatedAt"));
            Page<Balance> balancesPage = balanceRepository
                    .findByUserIdAndCalculatedAtBetweenOrderByCalculatedAtDesc(authenticatedUserId, startDate, endDate, pageable);

            Page<DataBalanceResponseDTO> balanceDTOsPage = balancesPage.map(BalanceMapper::toDataDTO);

            logger.info("Balance history by period retrieved for user {}", authenticatedUserId);
            return ResponseEntity.ok(PaginatedBalanceResponseDTO.success("Balance history retrieved successfully", balanceDTOsPage));

        } catch (Exception exception) {
            logger.error("Error listing balance history by period for user {}: ", authenticatedUserId, exception);
            return ResponseEntity.internalServerError()
                    .body(PaginatedBalanceResponseDTO.error("Internal server error occurred while retrieving balance history"));
        }
    }

    @Transactional
    public ResponseEntity<BalanceResponseDTO> calculateAndSaveBalance(UUID authenticatedUserId) {
        try {
            if (!userRepository.existsById(authenticatedUserId)) {
                logger.warn("User not found with ID: {}", authenticatedUserId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(BalanceResponseDTO.userNotFound("User not found"));
            }

            BigDecimal totalIncome = incomeRepository.findByUserId(authenticatedUserId)
                    .stream()
                    .map(Income::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalExpense = expenseRepository.findByUserId(authenticatedUserId)
                    .stream()
                    .map(Expense::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Balance balance = new Balance(authenticatedUserId, totalIncome, totalExpense);
            Balance savedBalance = balanceRepository.save(balance);

            DataBalanceResponseDTO dataBalanceResponseDTO = BalanceMapper.toDataDTO(savedBalance);

            logger.info("Balance calculated and saved for user {}", authenticatedUserId);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(BalanceResponseDTO.success("Balance calculated successfully", dataBalanceResponseDTO));

        } catch (Exception exception) {
            logger.error("Error calculating balance for user {}: ", authenticatedUserId, exception);
            return ResponseEntity.internalServerError()
                    .body(BalanceResponseDTO.error("Internal server error occurred while calculating balance"));
        }
    }

    @Transactional
    public ResponseEntity<DeleteBalanceResponseDTO> clearAllBalances(UUID authenticatedUserId) {
        try {
            if (!userRepository.existsById(authenticatedUserId)) {
                logger.warn("User not found with ID: {}", authenticatedUserId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(DeleteBalanceResponseDTO.userNotFound("User not found"));
            }

            balanceRepository.deleteByUserId(authenticatedUserId);
            logger.info("All balances deleted for user {}", authenticatedUserId);
            return ResponseEntity.ok(DeleteBalanceResponseDTO.success("All balance history deleted successfully."));

        } catch (Exception exception) {
            logger.error("Error deleting balances for user {}: ", authenticatedUserId, exception);
            return ResponseEntity.internalServerError()
                    .body(DeleteBalanceResponseDTO.error("Internal server error occurred while deleting balance history"));
        }
    }

    @Transactional
    public void recalculateBalanceAfterTransaction(UUID userId) {
        try {
            BigDecimal totalIncome = incomeRepository.findByUserId(userId)
                    .stream()
                    .map(Income::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalExpense = expenseRepository.findByUserId(userId)
                    .stream()
                    .map(Expense::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Balance balance = new Balance(userId, totalIncome, totalExpense);
            balanceRepository.save(balance);

            logger.info("Balance recalculated for user {} after transaction", userId);
        } catch (Exception exception) {
            logger.error("Error recalculating balance for user {}: ", userId, exception);
        }
    }
}