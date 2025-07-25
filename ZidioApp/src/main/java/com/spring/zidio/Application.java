package com.spring.zidio;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
public class Application {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "job_id",nullable = true)
	private Job job;
	
	@ManyToOne
	@JoinColumn(name ="internship_id",nullable = true)
	private Internship internship;
	
	@ManyToOne
	@JoinColumn(name ="student_username",referencedColumnName ="userName",nullable = false)
	private User student;
	
	private LocalDate appliedDate;
	@Enumerated(EnumType.STRING)
	private ApplicationStage status = ApplicationStage.APPLICATIONS_RECEIVED;
	private String resumeUrl;
	private LocalDateTime timestamp = LocalDateTime.now();
	
	//personal information
	private String userFirstName;
	private String userLastName;
	private String gender;
	private LocalDate dateOfBirth;
	
	//contact information
	private String email;
	private String countryCode;
	private String phone;
	
	//Student profile picture
	@ManyToOne
	@JoinColumn(name = "student_profile_picture_id", referencedColumnName = "id",unique = false)
	private StudentProfile studentProfilePicture;
	
	
	//address information
	@Embedded
	@AttributeOverrides({
		@AttributeOverride(name="line1", column = @Column(name = "address_line1")),
		@AttributeOverride(name="line2", column = @Column(name = "address_line2")),
		@AttributeOverride(name="country", column = @Column(name = "address_country")),
		@AttributeOverride(name="state", column = @Column(name = "address_state")),
		@AttributeOverride(name="city", column = @Column(name = "address_city")),
		@AttributeOverride(name="zipCode", column = @Column(name = "address_zip_code"))
	})
	private Address currentAddress;
	
	@Embedded
	@AttributeOverrides({
		@AttributeOverride(name="line1", column = @Column(name = "permenant_line1")),
		@AttributeOverride(name="line2", column = @Column(name = "permenant_line2")),
		@AttributeOverride(name="country", column = @Column(name = "permenant_country")),
		@AttributeOverride(name="state", column = @Column(name = "permenant_state")),
		@AttributeOverride(name="city", column = @Column(name = "permenant_city")),
		@AttributeOverride(name="zipCode", column = @Column(name = "permenant_zip_code"))
	})
	private Address permanentAddress;
	
	private boolean currentAddressSameAsPermanent = false;
	
	//Identity information
	private String aadharNumber;
	
	
	
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "application", orphanRemoval = true)
    private List<Education> educationHistory;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "application", orphanRemoval = true)
    private List<WorkExperience> workExperiences;

    @ElementCollection
    private List<String> skills;

    @ElementCollection
    private List<String> languages;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "application", orphanRemoval = true)
    private List<Certification> certifications;
    
    @OneToMany(mappedBy = "application" ,orphanRemoval = true)
    private List<ApplicationQuestionAnswer> applicationQuestionAnswers;
    
  //E-signature
  	private String eSignature;
	
	public boolean isForJob() {
		return job != null;
	}
	
	public boolean isForInternship() {
		return internship != null;
	}
}
