package com.api.flux.service;

import com.api.flux.dto.request.expense.CreateExpenseRequestDTO;
import com.api.flux.dto.response.expense.DataExpenseDTO;
import com.api.flux.dto.response.expense.ResponseExpenseDTO;
import com.api.flux.entity.Expense;
import com.api.flux.mapper.ExpenseMapper;
import com.api.flux.repository.ExpenseRepository;
import com.api.flux.repository.UserRepository;
import com.api.flux.utils.TextUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class ExpenseService {
    private static final Logger logger = LoggerFactory.getLogger(ExpenseService.class);

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseService(ExpenseRepository expenseRepository, UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ResponseEntity<ResponseExpenseDTO> createExpense(CreateExpenseRequestDTO dto) {
        try {
            UUID userId = dto.userId();
            if (expenseRepository.existsById(userId)) {
                return ResponseEntity.status(404).body(
                        ResponseExpenseDTO.userNotFound("User not found")
                );
            }

            Expense expense = new Expense();
            expense.generateId();
            expense.setUserId(userId);
            expense.setTitle(TextUtils.capitalizeFirstLetters(dto.title()));
            expense.setDescription(dto.description());
            expense.setCategory(dto.category());
            expense.setAmount(dto.amount());
            expense.setTransactionDate(Instant.now());

            Expense savedExpense = expenseRepository.save(expense);
            DataExpenseDTO dataExpenseDTO = ExpenseMapper.toDataDTO(savedExpense);

            logger.info("Expense created successfully with ID: {}", savedExpense.getId());

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    ResponseExpenseDTO.success("Expense created successfully!", dataExpenseDTO)
            );
        } catch (IllegalArgumentException illegalArgumentException) {
            logger.warn("Update validation failed: {}", illegalArgumentException.getMessage());
            return ResponseEntity.badRequest()
                    .body(ResponseExpenseDTO.error(illegalArgumentException.getMessage()));
        } catch (Exception exception) {
            logger.error("Unexpected error during user update: ", exception);
            return ResponseEntity.internalServerError()
                    .body(ResponseExpenseDTO.error("An unexpected error occurred during update"));
        }
    }
}
