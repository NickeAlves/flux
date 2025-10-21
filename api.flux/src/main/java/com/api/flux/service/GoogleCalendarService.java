package com.api.flux.service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.Events;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

@Service
public class GoogleCalendarService {
    private static final String APPLICATION_NAME = "flux";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    public Calendar getCalendarService(String accessToken) throws IOException, GeneralSecurityException {
        GoogleCredentials credentials = GoogleCredentials.create(new AccessToken(accessToken, null));

        return new Calendar.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JSON_FACTORY,
                new HttpCredentialsAdapter(credentials))
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    public List<Event> getEvents(String accessToken, String timeMin, String timeMax) throws Exception {
        Calendar service = getCalendarService(accessToken);

        Events events = service.events().list("primary")
                .setTimeMin(new DateTime(timeMin))
                .setTimeMax(new DateTime(timeMax))
                .setOrderBy("startTime")
                .setSingleEvents(true)
                .execute();

        return events.getItems();
    }

    public Event createEvent(String accessToken, Event event) throws Exception {
        Calendar service = getCalendarService(accessToken);
        return service.events().insert("primary", event).execute();
    }

    public Event updateEvent(String accessToken, String eventId, Event updatedEvent) throws Exception {
        Calendar service = getCalendarService(accessToken);
        return service.events().update("primary", eventId, updatedEvent).execute();
    }

    public void deleteEvent(String accessToken, String eventId) throws Exception {
        Calendar service = getCalendarService(accessToken);
        service.events().delete("primary", eventId).execute();
    }

}
