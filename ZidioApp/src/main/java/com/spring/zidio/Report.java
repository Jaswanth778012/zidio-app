package com.spring.zidio;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reason;

    private String type; 

    private boolean resolved = false;
    
    private String description;

    @ManyToOne
    @JoinColumn(name = "reported_by")
    private User reportedBy;
    
    private String attachmentUrl;
    
    @Enumerated(EnumType.STRING)
    private ReportStatus status = ReportStatus.PENDING;

    private String resolutionNotes;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = true)
    private Job job;

    @ManyToOne
    @JoinColumn(name = "internship_id", nullable = true)
    private Internship internship;

    private LocalDateTime createdAt = LocalDateTime.now();
}

