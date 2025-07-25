package com.spring.zidio.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.spring.zidio.Syllabus;

public interface SyllabusDao extends JpaRepository<Syllabus, Long> {
	// Additional query methods can be defined here if needed
	List<Syllabus> findByCourseId(Long courseId); // Find syllabi by course ID
	
	@Query("SELECT s FROM Syllabus s LEFT JOIN FETCH s.course WHERE s.id = :id")
    Optional<Syllabus> findWithCourseById(@Param("id") Long id);
}
// LEFT JOIN FETCH s.videos