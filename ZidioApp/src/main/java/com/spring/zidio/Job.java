package com.spring.zidio;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    @Column(length = 2000)
    private String description;
    private String location;
    private String skillsRequired;
    private String salary;
    private String startDate;
    private boolean flagged = false;
    
    private LocalDateTime postedAt = LocalDateTime.now();
    private LocalDateTime applicationDeadline;
    private String companyName;         // ✅ New: Company Name
    @Column(length = 2000)
    private String aboutCompany;        // ✅ New: About Company
    private Integer numberOfOpenings;   // ✅ New: Number of Openings
    @Column(length = 2000)
    private String eligibility;         // ✅ New: Eligibility
    private String perks; 
    @Enumerated(EnumType.STRING)
    private JobType jobType;
    @Enumerated(EnumType.STRING)
    private JobMode jobMode;
    
    private String companyLogo; 
    @Enumerated(EnumType.STRING)
    private PostStatus status = PostStatus.PENDING;


    @ManyToOne
    @JoinColumn(name = "employer_username")
    private User postedBy;
    
    @Column(name="application_count")
    private int applicationCount = 0; // ✅ New: Application Count
    
    @OneToMany(mappedBy = "job",cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Application> applications; // ✅ New: List of Applications
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "job_id")
    @JsonIgnore
    private List<ApplicationQuestion> jobApplicationQuestions;

    public enum JobType {
        FULL_TIME,
        PART_TIME,
        CONTRACT,
        INTERNSHIP,
        FREELANCE,
        TEMPORARY
    }
    public enum JobMode {
        REMOTE,
        ONSITE,
        HYBRID
    }
}
