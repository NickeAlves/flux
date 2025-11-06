package com.api.flux.service;


import com.api.flux.dto.request.income.CreateIncomeRequestDTO;
import com.api.flux.dto.request.income.UpdateIncomeRequestDTO;
import com.api.flux.dto.response.income.DataIncomeResponseDTO;
import com.api.flux.dto.response.income.DeleteIncomeResponseDTO;
import com.api.flux.dto.response.income.IncomeResponseDTO;
import com.api.flux.dto.response.income.PaginatedIncomeResponseDTO;
import com.api.flux.entity.Income;
import com.api.flux.mapper.IncomeMapper;
import com.api.flux.repository.IncomeRepository;
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
public class IncomeService {
    private static final Logger logger = LoggerFactory.getLogger(IncomeService.class);
    private static final List<String> VALID_SORT_FIELDS = Arrays.asList("category", "amount", "transactionDate", "title");

    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;
    private final BalanceService balanceService;

    public IncomeService(IncomeRepository incomeRepository, UserRepository userRepository, BalanceService balanceService) {
        this.incomeRepository = incomeRepository;
        this.userRepository = userRepository;
        this.balanceService = balanceService;
    }

    public ResponseEntity<com.api.flux.dto.response.income.IncomeResponseDTO> findIncomeByIdAndValidateOwnership(UUID incomeId, UUID authenticatedUserId) {
        try {
            Optional<Income> optionalIncome = incomeRepository.findById(incomeId);

            if (optionalIncome.isEmpty()) {
                logger.warn("Income not found with ID: {}", incomeId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(com.api.flux.dto.response.income.IncomeResponseDTO.incomeNotFound("Income not found."));
            }

            Income income = optionalIncome.get();

            if (!income.getUserId().equals(authenticatedUserId)) {
                logger.warn("User {} attempted to access income {} owned by user {}",
                        authenticatedUserId, incomeId, income.getUserId());
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(com.api.flux.dto.response.income.IncomeResponseDTO.error("You don't have permission to access this income."));
            }

            DataIncomeResponseDTO dataIncomeResponseDTO = IncomeMapper.toDataDTO(income);
            logger.info("Income with ID {} retrieved by user {}", incomeId, authenticatedUserId);

            return ResponseEntity.ok(com.api.flux.dto.response.income.IncomeResponseDTO.success("Income found successfully", dataIncomeResponseDTO));
        } catch (Exception exception) {
            logger.error("Error while finding income {}: ", incomeId, exception);
            return ResponseEntity.internalServerError()
                    .body(com.api.flux.dto.response.income.IncomeResponseDTO.error("Internal server error occurred while retrieving income"));
        }
    }

    public ResponseEntity<PaginatedIncomeResponseDTO<DataIncomeResponseDTO>> listIncomesByUserPaginated(
            UUID userId, int page, int size, String sortBy, String sortDirection) {
        try {
            if (!userRepository.existsById(userId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(PaginatedIncomeResponseDTO.error("User not found"));
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
            Page<Income> incomesPage = incomeRepository.findByUserId(userId, pageable);

            Page<DataIncomeResponseDTO> incomeDTOsPage = incomesPage.map(income -> new DataIncomeResponseDTO(
                    income.getId(),
                    income.getUserId(),
                    income.getTitle(),
                    income.getDescription(),
                    income.getCategory(),
                    income.getAmount(),
                    income.getTransactionDate()
            ));

            return ResponseEntity.ok(PaginatedIncomeResponseDTO.success("Incomes retrieved successfully", incomeDTOsPage));

        } catch (Exception exception) {
            logger.error("Error listing incomes for user {}: ", userId, exception);
            return ResponseEntity.internalServerError()
                    .body(PaginatedIncomeResponseDTO.error("Internal server error occurred while retrieving incomes"));
        }
    }

    @Transactional
    public ResponseEntity<com.api.flux.dto.response.income.IncomeResponseDTO> createIncome(CreateIncomeRequestDTO dto, UUID authenticatedUserId) {
        try {
            if (!dto.userId().equals(authenticatedUserId)) {
                logger.warn("User {} attempted to create income for user {}", authenticatedUserId, dto.userId());
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(com.api.flux.dto.response.income.IncomeResponseDTO.error("You can only create incomes for yourself."));
            }

            if (!userRepository.existsById(authenticatedUserId)) {
                logger.warn("User not found with ID: {}", authenticatedUserId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        com.api.flux.dto.response.income.IncomeResponseDTO.userNotFound("User not found")
                );
            }

            Income income = new Income();
            income.setUserId(authenticatedUserId);
            income.setTitle(TextUtils.capitalizeFirstLetters(dto.title()));
            income.setDescription(dto.description());
            income.setCategory(dto.category());
            income.setAmount(dto.amount());
            income.setTransactionDate(dto.transactionDate());

            Income savedIncome = incomeRepository.save(income);
            DataIncomeResponseDTO dataIncomeResponseDTO = IncomeMapper.toDataDTO(savedIncome);
            balanceService.recalculateBalanceAfterTransaction(authenticatedUserId);

            logger.info("Income created successfully with ID: {}", savedIncome.getId());

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    com.api.flux.dto.response.income.IncomeResponseDTO.success("Income created successfully!", dataIncomeResponseDTO)
            );
        } catch (IllegalArgumentException illegalArgumentException) {
            logger.warn("Income creation validation failed: {}", illegalArgumentException.getMessage());
            return ResponseEntity.badRequest()
                    .body(com.api.flux.dto.response.income.IncomeResponseDTO.error(illegalArgumentException.getMessage()));
        } catch (Exception exception) {
            logger.error("Unexpected error during income creation: ", exception);
            return ResponseEntity.internalServerError()
                    .body(com.api.flux.dto.response.income.IncomeResponseDTO.error("An unexpected error occurred during income creation"));
        }
    }

    @Transactional
    public ResponseEntity<IncomeResponseDTO> updateIncomeById(UUID id, UpdateIncomeRequestDTO dto, UUID authenticatedUserId) {
        try {
            Optional<Income> optionalIncome = incomeRepository.findById(id);

            if (optionalIncome.isEmpty()) {
                logger.warn("Income not found with ID: {}", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(IncomeResponseDTO.incomeNotFound("Income not found"));
            }

            Income existingIncome = optionalIncome.get();

            if (!existingIncome.getUserId().equals(authenticatedUserId)) {
                logger.warn("User {} attempted to update income {} owned by user {}",
                        authenticatedUserId, id, existingIncome.getUserId());
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(IncomeResponseDTO.error("You don't have permission to update this income."));
            }

            if (dto.title() != null && !dto.title().trim().isEmpty()) {
                existingIncome.setTitle(TextUtils.capitalizeFirstLetters(dto.title()));
            }

            if (dto.description() != null && !dto.description().trim().isEmpty()) {
                existingIncome.setDescription(TextUtils.capitalizeFirstLetters(dto.description()));
            }

            if (dto.category() != null) {
                existingIncome.setCategory(dto.category());
            }

            if (dto.amount() != null) {
                existingIncome.setAmount(dto.amount());
            }

            if (dto.transactionDate() != null) {
                existingIncome.setTransactionDate(dto.transactionDate());
            }

            Income updatedIncome = incomeRepository.save(existingIncome);
            DataIncomeResponseDTO dataIncomeResponseDTO = IncomeMapper.toDataDTO(updatedIncome);
            balanceService.recalculateBalanceAfterTransaction(authenticatedUserId);

            logger.info("Income updated successfully with ID {}", id);
            return ResponseEntity.ok(IncomeResponseDTO.success("Income updated successfully", dataIncomeResponseDTO));
        } catch (IllegalArgumentException illegalArgumentException) {
            logger.warn("Update validation failed: {}", illegalArgumentException.getMessage());
            return ResponseEntity.badRequest()
                    .body(IncomeResponseDTO.error(illegalArgumentException.getMessage()));
        } catch (Exception exception) {
            logger.error("Unexpected error during income update: ", exception);
            return ResponseEntity.internalServerError()
                    .body(IncomeResponseDTO.error("An unexpected error occurred during update"));
        }
    }

    @Transactional
    public ResponseEntity<DeleteIncomeResponseDTO> deleteIncomeById(UUID id, UUID authenticatedUserId) {
        try {
            Optional<Income> optionalIncome = incomeRepository.findById(id);

            if (optionalIncome.isEmpty()) {
                logger.warn("Delete attempt for non-existent income with ID: {}", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(DeleteIncomeResponseDTO.incomeNotFound("Income not found"));
            }

            Income income = optionalIncome.get();

            if (!income.getUserId().equals(authenticatedUserId)) {
                logger.warn("User {} attempted to delete income {} owned by user {}",
                        authenticatedUserId, id, income.getUserId());
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(DeleteIncomeResponseDTO.error("You don't have permission to delete this income."));
            }

            incomeRepository.deleteById(id);
            balanceService.recalculateBalanceAfterTransaction(authenticatedUserId);

            logger.info("Income deleted successfully with ID {}.", id);
            return ResponseEntity.ok(DeleteIncomeResponseDTO.success("Income deleted successfully."));
        } catch (Exception exception) {
            logger.error("Unexpected error during income deletion: ", exception);
            return ResponseEntity.internalServerError()
                    .body(DeleteIncomeResponseDTO.error("An unexpected error occurred during deletion"));
        }
    }

    @Transactional
    public ResponseEntity<DeleteIncomeResponseDTO> clearAllIncomesByUserId(UUID userId) {
        try {
            if (!userRepository.existsById(userId)) {
                logger.warn("User not found with ID: {}", userId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        DeleteIncomeResponseDTO.userNotFound("User not found")
                );
            }

            incomeRepository.deleteByUserId(userId);
            balanceService.recalculateBalanceAfterTransaction(userId);

            logger.info("All incomes deleted from user ID: {}", userId);
            return ResponseEntity.ok(DeleteIncomeResponseDTO.success("All incomes deleted successfully."));
        } catch (Exception exception) {
            logger.error("Unexpected error during income deletion: ", exception);
            return ResponseEntity.internalServerError()
                    .body(DeleteIncomeResponseDTO.error("An unexpected error occurred during deletion"));
        }
    }

}
