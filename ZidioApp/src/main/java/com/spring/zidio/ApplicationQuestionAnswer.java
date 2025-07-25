package com.spring.zidio;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
public class ApplicationQuestionAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "application_id")
    @JsonIgnore // Prevents circular reference during serialization
    private Application application;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "application_question_id")
    @JsonIgnoreProperties({"job", "internship"})
    private ApplicationQuestion applicationQuestion;


    @Column(columnDefinition = "TEXT")
    private String answer; // stores selected option(s) or text input
}

