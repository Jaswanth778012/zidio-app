package com.spring.zidio;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.spring.deserializer.StartDateDeserializer;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
public class Internship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(length = 2000)
    private String description;
    private String location;
    private String duration;  // ✅ New Field (e.g. "3 months")
    
    private String stipend;
    private LocalDateTime applicationDeadline;
    @JsonDeserialize(using = StartDateDeserializer.class)
    private LocalDate startDate;// ✅ Deadline field

    private LocalDateTime postedAt = LocalDateTime.now(); 
    private boolean flagged = false;
    private String companyName; 
    @Column(length=2000)
    private String aboutCompany;        // ✅ New: About Company
    private Integer numberOfOpenings;   // ✅ New: Number of Openings
    @Column(length=2000)
    private String eligibility;         // ✅ New: Eligibility
    private String perks;
    @Enumerated(EnumType.STRING)
    private InternshipType internshipType; // ✅ New: Internship Type
    @Enumerated(EnumType.STRING)
    private InternshipMode internshipMode; // ✅ New: Internship Mode
    
    private String companyLogo; 
    @Enumerated(EnumType.STRING)
    private PostStatus status = PostStatus.PENDING;


    @ManyToOne
    @JoinColumn(name = "employer_username")
    private User postedBy;
    
    @Column(name="application_count")
    private int applicationCount = 0; // ✅ New: Application Count
    
    @OneToMany(mappedBy = "internship",cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Application> applications;
    
    public enum InternshipType{
		FULL_TIME,
		PART_TIME,
		REMOTE,
		HYBRID
	}
    
    public enum InternshipMode {
		REMOTE,
		ONSITE,
		HYBRID
	}
}
