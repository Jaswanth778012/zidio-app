package com.spring.zidio.service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.zidio.CalendarEvent;
import com.spring.zidio.User;
import com.spring.zidio.dao.CalendarEventDao;
import com.spring.zidio.dao.UserDao;

@Service
public class CalendarEventService {
	
	@Autowired
	private CalendarEventDao calendarEventDao;
	
	@Autowired
	private UserDao userDao; // Assuming you have a UserDao to fetch User entities
	
	public List<CalendarEvent> getAllEvents(Principal principal) {
		String username = principal.getName();
		User user = userDao.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
		
		return calendarEventDao.findByUser(user);
	}
	
	public CalendarEvent getEventById(Long id) {
		return calendarEventDao.findById(id).orElse(null);
	}
	
	public CalendarEvent createEvent(CalendarEvent event, Principal principal) {
		String username = principal.getName();
		User user = userDao.findByUserName(username)
				.orElseThrow(() -> new RuntimeException("User not found with username: " + username));
		event.setUser(user); // Set the user for the event
		return calendarEventDao.save(event);
	}
	
	public CalendarEvent updateEvent(Long id, CalendarEvent updatedevent,Principal principal) {
		String username = principal.getName();
		User user = userDao.findByUserName(username)
				.orElseThrow(() -> new RuntimeException("User not found with username: " + username));
		return calendarEventDao.findById(id)
				.map(event -> {
					if (!event.getUser().getUserName().equals(user.getUserName())) {
						throw new RuntimeException("You do not have permission to update this event");
					}
					event.setTitle(updatedevent.getTitle());
					event.setDescription(updatedevent.getDescription());
					event.setDateTime(updatedevent.getDateTime());
					return calendarEventDao.save(event);
				})
				.orElseThrow(()-> new RuntimeException("Event not found with id: " + id));
	}
	
	public void deleteEvent(Long id,Principal principal) {
		CalendarEvent event = calendarEventDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));

        if (!event.getUser().getUserName().equals(principal.getName())) {
            throw new RuntimeException("Unauthorized to delete this event");
        }

		calendarEventDao.deleteById(id);
	}
	
	public List<CalendarEvent> getUpcomingEvents(Principal principal) {
			    String username = principal.getName();
			    	    User user = userDao.findByUserName(username)
	            .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
	    LocalDateTime now = LocalDateTime.now();
	    return calendarEventDao.findByUserAndDateTimeAfterOrderByDateTimeAsc(user,now)
	            .stream()
	            .limit(10)
	            .collect(Collectors.toList());
	}

}
