package com.spring.zidio;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Syllabus {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String title; // Title of the syllabus
	
	private String description; // Description of the syllabus
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "course_id")
	@JsonIgnoreProperties({
	    "syllabus", "reviews", "faculty", "courseImages", "progress"
	})
	private Course course; // The course this syllabus belongs to
	
	@OneToMany(mappedBy = "syllabus",cascade= CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference
	private List<VideoContent> videos;
	
}
