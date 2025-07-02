package com.spring.zidio.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.zidio.Application;
import com.spring.zidio.Internship;
import com.spring.zidio.Job;
import com.spring.zidio.User;

public interface ApplicationDao extends JpaRepository<Application, Long>{
	
	  boolean existsByJobAndStudent(Job job, User student);
	    boolean existsByInternshipAndStudent(Internship internship, User student);
	    
	    Optional<Application> findByJobAndStudent(Job job, User student);
	    Optional<Application> findByInternshipAndStudent(Internship internship, User student);
	    
	    Optional<Application> findByJob(Job job);
	    Optional<Application> findByInternship(Internship internship);
	    
	    List<Application> findTop3ByOrderByAppliedDateDesc();
	    
	    
}
