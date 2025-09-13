package com.api.flux.utils;

import java.util.regex.Pattern;

public final class ValidationUtils {
    private ValidationUtils() {}

    public static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
    );

    public static boolean isValidEmail(String email) {
        return email == null || !EMAIL_PATTERN.matcher(email).matches();
    }
}
