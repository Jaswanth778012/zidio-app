package com.spring.zidio;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.ElementCollection;
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
public class ApplicationQuestion {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String questionText;
	private String questionType; 
	@ElementCollection// e.g., "text", "multiple-choice", etc.
	private List<String> options; // JSON string for multiple-choice options, if applicable
	private boolean isRequired; // Whether the question is mandatory
	
	
	public ApplicationQuestion(String questionText, String questionType, List<String> options, boolean isRequired) {
		this.questionText = questionText;
		this.questionType = questionType;
		this.options = options;
		this.isRequired = isRequired;
	}
	
	@ManyToOne
    @JoinColumn(name = "job_id")
    @JsonIgnore
    private Job job;

    // 🔗 Employer-defined template question for an internship
    @ManyToOne
    @JoinColumn(name = "internship_id")
    @JsonIgnore
    private Internship internship;
	

}
