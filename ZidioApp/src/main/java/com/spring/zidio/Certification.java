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
public class Certification {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String certificationName;
	private String issuingOrganization;
	private String issueDate; // Format: YYYY-MM-DD
	private String fileUrl; // URL to the certificate file
	
	@ManyToOne
	@JoinColumn(name = "application_id")
	@JsonIgnore
	private Application application; // Link to the application this certification is associated with
}
