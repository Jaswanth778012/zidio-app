package com.spring.zidio.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.zidio.Course;
import com.spring.zidio.Syllabus;
import com.spring.zidio.dao.CourseDao;
import com.spring.zidio.dao.SyllabusDao;

@Service
public class SyllabusService {
	
	@Autowired
	private SyllabusDao syllabusDao;
	
	@Autowired
	private CourseDao courseRepository; // Assuming you have a CourseDao to fetch Course entities
	
	public Syllabus createSyllabus(Syllabus syllabus) {
	    if (syllabus.getCourse() != null && syllabus.getCourse().getId() != null) {
	        Course course = courseRepository.findById(syllabus.getCourse().getId())
	                .orElseThrow(() -> new RuntimeException("Course not found with id: " + syllabus.getCourse().getId()));
	        syllabus.setCourse(course); // ✅ attach managed course entity
	    } else {
	        throw new RuntimeException("Course ID must be provided");
	    }
	    return syllabusDao.save(syllabus);
	}

	
	public List<Syllabus> getByCourseId(Long courseId) {
		return syllabusDao.findByCourseId(courseId);
	}
	
	public List<Syllabus> getAllSyllabus() {
		return syllabusDao.findAll();
	}
	
	public Syllabus getById(Long id) {
		return syllabusDao.findById(id).orElse(null);
	}
	
	public void deleteSyllabus(Long id) {
		syllabusDao.deleteById(id);
	}
	
	public Syllabus update(Long id, Syllabus newSyllabus) {
	    Syllabus existingSyllabus = syllabusDao.findById(id)
	        .orElseThrow(() -> new RuntimeException("Syllabus not found"));

	    existingSyllabus.setTitle(newSyllabus.getTitle());
	    existingSyllabus.setDescription(newSyllabus.getDescription());

	    // Properly fetch and set course
	    Long courseId = newSyllabus.getCourse().getId();
	    Course course = courseRepository.findById(courseId)
	        .orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));

	    existingSyllabus.setCourse(course);

	    return syllabusDao.save(existingSyllabus);
	}


	

}
