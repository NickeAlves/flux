package com.api.flux.repository;

import com.api.flux.entity.LucAI;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;
import java.util.UUID;

public interface LucaAIRepository extends MongoRepository<LucAI, UUID> {
    Optional<LucAI> findByUserId(UUID userId);
}
