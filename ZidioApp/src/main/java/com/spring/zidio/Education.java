package com.spring.zidio;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
public class Education {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String degree;
	private String fieldOfSpecialization;
	private String courseType; // Bachelors, Masters, Diploma, etc.
	private String gpaorPercentage; // GPA or Percentage
	private String UniversityName; // Name of the University or College
	private LocalDate startDate; // Start date of the course
	private LocalDate endDate; // End date of the course
	private String country;
	private String city;// City where the institution is located
	
	@ManyToOne
    @JoinColumn(name = "application_id")
	@JsonIgnore
    private Application application;
}
