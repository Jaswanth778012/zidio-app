package com.spring.zidio.dao;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.zidio.CalendarEvent;
import com.spring.zidio.User;

public interface CalendarEventDao extends JpaRepository<CalendarEvent, Long> {
	// Additional query methods can be defined here if needed
	List<CalendarEvent> findByUser(User user);
	List<CalendarEvent> findByDateTime(LocalDateTime dateTime);
	List<CalendarEvent> findByUserAndDateTimeAfterOrderByDateTimeAsc(User user, LocalDateTime dateTime);

}
