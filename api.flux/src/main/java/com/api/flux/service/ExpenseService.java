package com.api.flux.service;

import com.api.flux.dto.request.expense.CreateExpenseRequestDTO;
import com.api.flux.dto.request.expense.UpdateExpenseRequestDTO;
import com.api.flux.dto.response.expense.DataExpenseDTO;
import com.api.flux.dto.response.expense.DeleteExpenseResponseDTO;
import com.api.flux.dto.response.expense.PaginatedExpenseResponseDTO;
import com.api.flux.dto.response.expense.ResponseExpenseDTO;
import com.api.flux.entity.Expense;
import com.api.flux.mapper.ExpenseMapper;
import com.api.flux.repository.ExpenseRepository;
import com.api.flux.repository.UserRepository;
import com.api.flux.utils.TextUtils;
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

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ExpenseService {
    private static final Logger logger = LoggerFactory.getLogger(ExpenseService.class);
    private static final List<String> VALID_SORT_FIELDS = Arrays.asList("category", "amount", "transactionDate", "title");

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseService(ExpenseRepository expenseRepository, UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    public ResponseEntity<PaginatedExpenseResponseDTO<DataExpenseDTO>> listExpensesByUserPaginated(UUID userId, int page, int size, String sortBy, String sortDirection) {
        try {
            if (!userRepository.existsById(userId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(PaginatedExpenseResponseDTO.error("User not found"));
            }

            if (page < 0) page = 0;
            if (size <= 0 || size > 100) size = 10;

            if (sortBy == null || sortBy.isEmpty() || !VALID_SORT_FIELDS.contains(sortBy)) {
                sortBy = "transactionDate";
            }

            Sort.Direction direction = Sort.Direction.DESC;
            if ("asc".equalsIgnoreCase(sortDirection)) {
                direction = Sort.Direction.ASC;
            }

            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
            Page<Expense> expensesPage = expenseRepository.findByUserId(userId, pageable);

            Page<DataExpenseDTO> expenseDTOsPage = expensesPage.map(expense -> new DataExpenseDTO(
                    expense.getId(),
                    expense.getUserId(),
                    expense.getTitle(),
                    expense.getDescription(),
                    expense.getCategory(),
                    expense.getAmount(),
                    expense.getTransactionDate()
            ));

            return ResponseEntity.ok(PaginatedExpenseResponseDTO.success("Expenses retrieved successfully", expenseDTOsPage));

        } catch (Exception exception) {
            logger.error("Error listing expenses for user {}: ", userId, exception);
            return ResponseEntity.internalServerError()
                    .body(PaginatedExpenseResponseDTO.error("Internal server error occurred while retrieving expenses"));
        }
    }

    @Transactional
    public ResponseEntity<ResponseExpenseDTO> createExpense(CreateExpenseRequestDTO dto) {
        try {
            UUID userId = dto.userId();
            if (!userRepository.existsById(userId)) {
                logger.warn("User not found with ID: {}", userId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
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
            expense.setTransactionDate(dto.transactionDate());

            Expense savedExpense = expenseRepository.save(expense);
            DataExpenseDTO dataExpenseDTO = ExpenseMapper.toDataDTO(savedExpense);

            logger.info("Expense created successfully with ID: {}", savedExpense.getId());

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    ResponseExpenseDTO.success("Expense created successfully!", dataExpenseDTO)
            );
        } catch (IllegalArgumentException illegalArgumentException) {
            logger.warn("Expense creation validation failed: {}", illegalArgumentException.getMessage());
            return ResponseEntity.badRequest()
                    .body(ResponseExpenseDTO.error(illegalArgumentException.getMessage()));
        } catch (Exception exception) {
            logger.error("Unexpected error during expense creation: ", exception);
            return ResponseEntity.internalServerError()
                    .body(ResponseExpenseDTO.error("An unexpected error occurred during expense creation"));
        }
    }

    public ResponseEntity<ResponseExpenseDTO> updateExpenseById(UUID id, UpdateExpenseRequestDTO dto) {
        try {
            Optional<Expense> optionalExpense = expenseRepository.findById(id);

            if (optionalExpense.isEmpty()) {
                logger.warn("Expense not found with ID: {}", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ResponseExpenseDTO.expenseNotFound("Expense not found"));
            }

            Expense existingExpense = optionalExpense.get();

            if (dto.title() != null && !dto.title().trim().isEmpty()) {
                existingExpense.setTitle(TextUtils.capitalizeFirstLetters(dto.title()));
            }

            if (dto.description() != null && !dto.description().trim().isEmpty()) {
                existingExpense.setDescription(TextUtils.capitalizeFirstLetters(dto.description()));
            }

            if (dto.category() != null) {
                existingExpense.setDescription(dto.description());
            }

            if (dto.amount() != null) {
                existingExpense.setAmount(dto.amount());
            }

            if (dto.transactionDate() != null) {
                existingExpense.setTransactionDate(dto.transactionDate());
            }

            Expense updatedExpense = expenseRepository.save(existingExpense);
            DataExpenseDTO dataExpenseDTO = ExpenseMapper.toDataDTO(updatedExpense);

            logger.info("Expense updated successfully with ID {}", id);
            return ResponseEntity.ok(ResponseExpenseDTO.success("Expense updated successfully", dataExpenseDTO));
        } catch (IllegalArgumentException illegalArgumentException) {
            logger.warn("Update validation failed: {}", illegalArgumentException.getMessage());
            return ResponseEntity.badRequest()
                    .body(ResponseExpenseDTO.error(illegalArgumentException.getMessage()));
        } catch (Exception exception) {
            logger.error("Unexpected error during expense update: ", exception);
            return ResponseEntity.internalServerError()
                    .body(ResponseExpenseDTO.error("An unexpected error occurred during update"));
        }
    }

    public ResponseEntity<DeleteExpenseResponseDTO> deleteExpenseById(UUID id) {
        try {
            if (!expenseRepository.existsById(id)) {
                logger.warn("Delete attempt for non-existent expense with ID: {}", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(DeleteExpenseResponseDTO.expenseNotFound("Expense not found"));
            }
            expenseRepository.deleteById(id);
            logger.info("Expense deleted successfully with ID {}.", id);
            return ResponseEntity.ok(DeleteExpenseResponseDTO.success("Expense deleted successfully."));
        } catch (Exception exception) {
            logger.error("Unexpected error during expense deletion: ", exception);
            return ResponseEntity.internalServerError()
                    .body(DeleteExpenseResponseDTO.error("An unexpected error occurred during deletion"));
        }
    }

    public ResponseEntity<DeleteExpenseResponseDTO> clearAllExpensesByUserId(UUID userId) {
        try {
            if (!userRepository.existsById(userId)) {
                logger.warn("User not found with ID: {}", userId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        DeleteExpenseResponseDTO.userNotFound("User not found")
                );
            }

            expenseRepository.deleteAll();
            logger.info("All expenses deleted from user ID: {}", userId);
            return ResponseEntity.ok(DeleteExpenseResponseDTO.success("All expenses deleted successfully."));
        } catch (Exception exception) {
            logger.error("Unexpected error during expense deletion: ", exception);
            return ResponseEntity.internalServerError()
                    .body(DeleteExpenseResponseDTO.error("An unexpected error occurred during deletion"));
        }
    }
}