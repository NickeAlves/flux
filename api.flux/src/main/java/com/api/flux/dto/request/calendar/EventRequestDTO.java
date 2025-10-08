package com.api.flux.dto.request.calendar;

public record EventRequestDTO(String summary,
                              String description,
                              String location,
                              EventDateTimeDTO start,
                              EventDateTimeDTO end) {
}
