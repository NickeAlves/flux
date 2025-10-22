package com.api.flux.mapper;

import com.api.flux.dto.response.user.DataUserDTO;
import com.api.flux.entity.User;

public final class UserMapper {
    private UserMapper() {}

    public static DataUserDTO toUserDTO(User user, int age) {
        return new DataUserDTO(
                user.getId(),
                user.getName(),
                user.getLastName(),
                user.getEmail(),
                user.getDateOfBirth(),
                age,
                user.getProfileImageUrl()
        );
    }
}
