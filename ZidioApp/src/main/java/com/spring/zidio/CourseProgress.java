package com.spring.zidio;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
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
public class CourseProgress {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id; // Unique identifier for the course progress record
	
	private boolean completed; // Indicates if the course is completed
	
	private int progressPercentage; // Progress percentage of the course (0-100)
	
	private int watchedVideosCount; // Number of videos watched in the course
	
	private LocalDateTime lastWatched;
	
	@ManyToOne
	@JoinColumn(name ="student_username",referencedColumnName ="userName")
	private User student;
	
	@ManyToOne
	@JoinColumn(name = "course_id", nullable= true)
	@JsonBackReference
	private Course course; // The course this progress record belongs to
	
	@ManyToOne
	@JoinColumn(name="video_id", nullable = true)
	private VideoContent video; // The video content this progress record belongs to
}
