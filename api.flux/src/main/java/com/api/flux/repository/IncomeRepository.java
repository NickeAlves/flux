package com.api.flux.repository;

import com.api.flux.entity.Income;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface IncomeRepository extends MongoRepository<Income, UUID> {
    Page<Income> findByUserId(UUID userId, Pageable pageable);

    void deleteByUserId(UUID userId);
}
