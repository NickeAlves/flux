package com.api.flux.controller;

import com.api.flux.dto.request.calendar.EventDateTimeDTO;
import com.api.flux.dto.request.calendar.EventRequestDTO;
import com.api.flux.service.GoogleCalendarService;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/api/calendar")
public class GoogleCalendarController {
    private final GoogleCalendarService googleCalendarService;

    public GoogleCalendarController(GoogleCalendarService googleCalendarService) {
        this.googleCalendarService = googleCalendarService;
    }

    @GetMapping("/events")
    public ResponseEntity<List<Event>> getEvents(
            @RequestHeader("X-Google-Token") String googleToken,
            @RequestParam String timeMin,
            @RequestParam String timeMax) {
        try {
            return ResponseEntity.ok(googleCalendarService.getEvents(googleToken, timeMin, timeMax));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/events")
    public ResponseEntity<?> createEvent(
            @RequestHeader("X-Google-Token") String googleToken,
            @RequestBody EventRequestDTO eventRequest) {
        try {
            Event event = new Event()
                    .setSummary(eventRequest.summary())
                    .setDescription(eventRequest.description())
                    .setLocation(eventRequest.location())
                    .setStart(toGoogleEventDateTime(eventRequest.start()))
                    .setEnd(toGoogleEventDateTime(eventRequest.end()));

            Event createdEvent = googleCalendarService.createEvent(googleToken, event);
            return ResponseEntity.ok(createdEvent);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/events/{eventId}")
    public ResponseEntity<?> updateEvent(
            @RequestHeader("X-Google-Token") String googleToken,
            @PathVariable String eventId,
            @RequestBody EventRequestDTO eventRequest) {
        try {
            Event event = new Event()
                    .setSummary(eventRequest.summary())
                    .setDescription(eventRequest.description())
                    .setLocation(eventRequest.location())
                    .setStart(toGoogleEventDateTime(eventRequest.start()))
                    .setEnd(toGoogleEventDateTime(eventRequest.end()));

            Event updatedEvent = googleCalendarService.updateEvent(googleToken, eventId, event);
            return ResponseEntity.ok(updatedEvent);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<Void> deleteEvent(
            @RequestHeader("X-Google-Token") String googleToken,
            @PathVariable String eventId) {
        try {
            googleCalendarService.deleteEvent(googleToken, eventId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    private EventDateTime toGoogleEventDateTime(EventDateTimeDTO dto) {
        if (dto == null) return null;

        EventDateTime eventDateTime = new EventDateTime();

        if (dto.dateTime() != null && !dto.dateTime().isBlank()) {
            eventDateTime.setDateTime(new DateTime(dto.dateTime()));
        } else if (dto.date() != null && !dto.date().isBlank()) {
            eventDateTime.setDate(new DateTime(dto.date()));
        }

        if (dto.timeZone() != null) {
            eventDateTime.setTimeZone(dto.timeZone());
        }

        return eventDateTime;
    }
}