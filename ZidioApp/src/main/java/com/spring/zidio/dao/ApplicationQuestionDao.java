package com.spring.zidio.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.zidio.ApplicationQuestion;

public interface ApplicationQuestionDao extends JpaRepository<ApplicationQuestion, Long> {
	// Custom query methods can be defined here if needed
	// For example, to find questions by application ID or other criteria
	List<ApplicationQuestion> findByJobId(Long jobId);
    List<ApplicationQuestion> findByInternshipId(Long internshipId);
}
