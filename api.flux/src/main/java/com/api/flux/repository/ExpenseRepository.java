package com.api.flux.repository;

import com.api.flux.entity.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ExpenseRepository extends MongoRepository<Expense, UUID> {
    Page<Expense> findByUserId(UUID userId, Pageable pageable);
    void deleteByUserId(UUID userId);
}
