package com.spring.zidio;

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
public class VideoContent {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id; // Unique identifier for the video content
	
	private String title; // Title of the video content
	
	private String description; // Description of the video content
	
	private String videoUrl; // URL of the video content
	
	private int duration; // Duration of the video in seconds
	
	@ManyToOne
	@JoinColumn(name = "syllabus_id")
	@JsonBackReference
	private Syllabus syllabus; // The syllabus this video content belongs to
}
