package com.spring.zidio.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar; // ✅ CORRECT one
import com.google.api.services.calendar.model.ConferenceData;
import com.google.api.services.calendar.model.ConferenceSolutionKey;
import com.google.api.services.calendar.model.CreateConferenceRequest;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventAttendee;
import com.google.api.services.calendar.model.EventDateTime;
import com.spring.zidio.Interview;

@Service
public class GoogleCalenderService {
	private final Calendar calendar;
	
	@Autowired
	public GoogleCalenderService(Calendar calendar) {
		this.calendar = calendar;
	}
	
	public String createCalendarEvent(Interview interview, String studentEmail, String employerEmail) throws IOException {
		String title = null;

		if (interview.getJob() != null && interview.getJob().getTitle() != null) {
		    title = interview.getJob().getTitle();
		} else if (interview.getInternship() != null && interview.getInternship().getTitle() != null) {
		    title = interview.getInternship().getTitle();
		} else {
		    title = "Unknown Position";
		}
        Event event = new Event()
            .setSummary("Interview for " + title)
            .setDescription(interview.getNotes());

        LocalDateTime startLdt = interview.getInterviewDate().atTime(interview.getStartTime());
        LocalDateTime endLdt = interview.getInterviewDate().atTime(interview.getEndTime());

        // Format to ISO 8601 (RFC3339) without offset
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

        DateTime start = new DateTime(startLdt.format(formatter));
        DateTime end = new DateTime(endLdt.format(formatter));

        event.setStart(new EventDateTime().setDateTime(start).setTimeZone("Asia/Kolkata"));
        event.setEnd(new EventDateTime().setDateTime(end).setTimeZone("Asia/Kolkata"));
        
        List<EventAttendee> attendees = List.of(
                new EventAttendee().setEmail(studentEmail),
                new EventAttendee().setEmail(employerEmail)
            );
            event.setAttendees(attendees);

            // Enable Google Meet
            ConferenceData conferenceData = new ConferenceData()
                .setCreateRequest(new CreateConferenceRequest()
                    .setRequestId(UUID.randomUUID().toString())
                    .setConferenceSolutionKey(new ConferenceSolutionKey().setType("hangoutsMeet"))
                );

            event.setConferenceData(conferenceData);

            Event createdEvent = calendar.events().insert("primary", event)
                .setConferenceDataVersion(1)
                .execute();

            return createdEvent.getHangoutLink(); // returns Google Meet link
        }

}