package com.spring.zidio;

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
public class ApplicationQuestion {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String questionText;
	private String questionType; // e.g., "text", "multiple-choice", etc.
	private String options; // JSON string for multiple-choice options, if applicable
	private boolean isRequired; // Whether the question is mandatory
	
	public ApplicationQuestion(String questionText, String questionType, String options, boolean isRequired) {
		this.questionText = questionText;
		this.questionType = questionType;
		this.options = options;
		this.isRequired = isRequired;
	}
	
	@ManyToOne
	@JoinColumn(name = "application_id")
	@JsonIgnore
	private Application application; // Link to the application this question belongs to
}
