package com.spring.zidio;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Interview {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name ="job_id", nullable = true)
	private Job job;
	
	@ManyToOne
	@JoinColumn(name ="internship_id", nullable = true)
	private Internship internship;
	
	@ManyToOne
	@JoinColumn(name ="student_username", referencedColumnName = "userName", nullable = false)
	private User student;
	
	@ManyToOne(optional=false)
	@JoinColumn(name ="interviewer_username", referencedColumnName = "userName", nullable = false)
	private User employer;
	
	private LocalDate interviewDate;
	
	private LocalTime startTime;
	
	private LocalTime endTime;
	@Enumerated(EnumType.STRING)
	private Mode mode;
	
	private String location;
	
	private String notes;
	
	private String meetingLink;
	 
	@Enumerated(EnumType.STRING)
	private Status status;
	
	public enum Mode {
        ONLINE, ONSITE
    }
	
	public enum Status {
        SCHEDULED, RESCHEDULED, CANCELLED, COMPLETED
    }
}
