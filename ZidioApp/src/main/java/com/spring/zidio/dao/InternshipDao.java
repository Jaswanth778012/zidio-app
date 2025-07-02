package com.spring.zidio.dao;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.spring.zidio.Internship;
import com.spring.zidio.PostStatus;
import com.spring.zidio.User;

public interface InternshipDao extends JpaRepository<Internship, Long> {
	 List<Internship> findByStatus(PostStatus status);
	 long countByStatus(PostStatus status);
	 List<Internship> findByPostedBy(User postedBy);
	 Page<Internship> findAll(Pageable pageable);
	 
	 @Query("SELECT i FROM Internship i WHERE " +
		       "(:search IS NULL OR LOWER(i.title) LIKE LOWER(CONCAT('%', :search, '%')))")
		Page<Internship> findFilteredInternships(@Param("search") String search, Pageable pageable);

}
