package com.api.flux.utils;

import com.api.flux.security.CustomUserDetails;
import org.springframework.security.core.Authentication;

import java.util.UUID;

public final class GetUserIdFromAuth {

    public static UUID getId(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getId();
    }
}
