package com.spring.zidio.dao;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.zidio.Interview;

public interface InterviewDao extends JpaRepository<Interview, Long>{
	
	List<Interview> findByEmployer_UserName(String userName);
	List<Interview> findByStudent_UserName(String userName);
	List<Interview> findByInterviewDate(LocalDate interviewDate);
}
