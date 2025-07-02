package com.spring.zidio.dao;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.spring.zidio.Job;
import com.spring.zidio.PostStatus;
import com.spring.zidio.User;

public interface JobDao extends JpaRepository<Job, Long> {
	// Custom query methods can be defined here if needed
	List<Job> findByStatus(PostStatus status);
	long countByStatus(PostStatus status);
	 List<Job> findByPostedBy(User postedBy);
	 Page<Job> findAll(Pageable pageable); // For pagination support
	 
	 @Query("SELECT COUNT(a) FROM Application a WHERE a.job.id = :jobId")
	    int countApplicationsByJobId(@Param("jobId") Long jobId);
	 
	 @Query("SELECT j FROM Job j WHERE " +
		       "(:search IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%')))")
		Page<Job> findFilteredJobs(@Param("search") String search, Pageable pageable);

}
