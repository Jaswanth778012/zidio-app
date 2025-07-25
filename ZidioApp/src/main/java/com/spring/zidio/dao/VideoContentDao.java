package com.spring.zidio.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.spring.zidio.Course;
import com.spring.zidio.VideoContent;

public interface VideoContentDao extends JpaRepository<VideoContent, Long> {
	// Additional query methods can be defined here if needed
	List<VideoContent> findBySyllabusId(Long syllabusId);
	 @Query("SELECT v FROM VideoContent v WHERE v.syllabus.course = :course")
	    List<VideoContent> findAllByCourse(@Param("course") Course course);// Find all video contents by syllabus ID

}
