package com.api.flux.mapper;

import com.api.flux.dto.response.balance.DataBalanceResponseDTO;
import com.api.flux.entity.Balance;

public class BalanceMapper {
    private BalanceMapper() {}

    public static DataBalanceResponseDTO toDataDTO(Balance balance) {
        if (balance == null) {
            return null;
        }

        return new DataBalanceResponseDTO(
                balance.getId(),
                balance.getUserId(),
                balance.getTotalIncome(),
                balance.getTotalExpense(),
                balance.getCurrentBalance(),
                balance.getCalculatedAt(),
                balance.getCreatedAt()
        );
    }
}