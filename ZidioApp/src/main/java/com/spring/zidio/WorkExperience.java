package com.spring.zidio;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
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
public class WorkExperience {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String employerName;
	private String jobTitle;
	private String startDate; // Format: YYYY-MM-DD
	private String endDate; // Format: YYYY-MM-DD
	private String employerCountry;
	private String employerCity;
	
	@Column(length = 2000)
	private String responsibilities; // Detailed description of responsibilities
	
	@ManyToOne
	@JoinColumn(name = "application_id")
	@JsonIgnore
	private Application application;
	
}
