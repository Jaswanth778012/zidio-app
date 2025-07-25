package com.spring.zidio;

import java.time.LocalDateTime;

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
public class CourseReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reviewerUsername;

    @ManyToOne
    @JoinColumn(name = "course_id")
    @JsonBackReference 
    private Course course;

    private int rating; // 1 to 5
    private String comment;

    private boolean flagged = false;
    private boolean resolved = false;

    private LocalDateTime createdAt;
}
