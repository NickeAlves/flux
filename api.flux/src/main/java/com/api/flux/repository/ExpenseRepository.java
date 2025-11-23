package com.api.flux.repository;

import com.api.flux.entity.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ExpenseRepository extends MongoRepository<Expense, UUID> {
    Page<Expense> findByUserIdAndTransactionDateBetween(UUID userId, LocalDate startDate, LocalDate endDate, Pageable pageable);

    Page<Expense> findByUserId(UUID userId, Pageable pageable);

    List<Expense> findByUserId(UUID userId);

    void deleteByUserId(UUID userId);
}
