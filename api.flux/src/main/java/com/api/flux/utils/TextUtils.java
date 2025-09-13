package com.api.flux.utils;

import java.util.Arrays;
import java.util.stream.Collectors;

public final class TextUtils {
    private TextUtils() {}

    public static String capitalizeFirstLetters(String input) {
        if (input == null || input.isEmpty()) return input;

        return Arrays.stream(input.trim().split("\\s+"))
                .map(word -> Character.toUpperCase(word.charAt(0)) +
                        word.substring(1).toLowerCase())
                .collect(Collectors.joining(" "));
    }
}
