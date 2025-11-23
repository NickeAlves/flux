package com.api.flux.repository;

import com.api.flux.entity.Income;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface IncomeRepository extends MongoRepository<Income, UUID> {
    Page<Income> findByUserIdAndTransactionDateBetween(UUID userId, LocalDate startDate, LocalDate endDate, Pageable pageable);

    Page<Income> findByUserId(UUID userId, Pageable pageable);

    List<Income> findByUserId(UUID userId);

    void deleteByUserId(UUID userId);
}
