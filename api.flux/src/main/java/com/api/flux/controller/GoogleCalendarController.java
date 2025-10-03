package com.api.flux.controller;

import com.api.flux.service.GoogleCalendarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.google.api.services.calendar.model.Event;

import java.util.List;


@RestController
@RequestMapping("/api/calendar")
public class GoogleCalendarController {

    @Autowired
    private GoogleCalendarService googleCalendarService;

    @GetMapping("/events")
    public ResponseEntity<List<Event>> getEvents(@RequestHeader("Authorization") String token,
                                                 @RequestParam String timeMin,
                                                 @RequestParam String timeMax) {
        try {
            String accessToken = token.replace("Bearer ", "");
            return ResponseEntity.ok(googleCalendarService.getEvents(accessToken, timeMin, timeMax));
        } catch (Exception exception) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/events")
    public ResponseEntity<Event> createEvent(
            @RequestHeader("Authorization") String token,
            @RequestBody Event event) {
        try {
            String accessToken = token.replace("Bearer ", "");
            return ResponseEntity.ok(googleCalendarService.createEvent(accessToken, event));
        } catch (Exception exception) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/events/{eventId}")
    public ResponseEntity<Event> updateEvent(
            @RequestHeader("Authorization") String token,
            @PathVariable String eventId,
            @RequestBody Event event) {
        try {
            String accessToken = token.replace("Bearer ", "");
            return ResponseEntity.ok(googleCalendarService.updateEvent(accessToken, eventId, event));
        } catch (Exception exception) {
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<Void> deleteEvent(
            @RequestHeader("Authorization") String token,
            @PathVariable String eventId) {
        try {
            String accessToken = token.replace("Bearer ", "");
            googleCalendarService.deleteEvent(accessToken, eventId);
            return ResponseEntity.noContent().build();
        } catch (Exception exception) {
            return ResponseEntity.status(500).build();
        }
    }

}
