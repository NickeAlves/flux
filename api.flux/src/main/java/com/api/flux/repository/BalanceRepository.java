package com.api.flux.repository;

import com.api.flux.entity.Balance;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BalanceRepository extends MongoRepository<Balance, UUID> {
}
