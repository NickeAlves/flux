package com.api.flux.repository;

import com.api.flux.entity.Balance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BalanceRepository extends MongoRepository<Balance, UUID> {
    Optional<Balance> findFirstByUserIdOrderByCalculatedAtDesc(UUID userId);

    Page<Balance> findByUserIdOrderByCalculatedAtDesc(UUID userId, Pageable pageable);

    Page<Balance> findByUserIdAndCalculatedAtBetweenOrderByCalculatedAtDesc(
            UUID userId,
            Instant startDate,
            Instant endDate,
            Pageable pageable
    );

    void deleteByUserId(UUID userId);
}