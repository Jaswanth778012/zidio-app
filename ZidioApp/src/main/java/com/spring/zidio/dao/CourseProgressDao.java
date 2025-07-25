package com.spring.zidio.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.zidio.Course;
import com.spring.zidio.CourseProgress;
import com.spring.zidio.User;
import com.spring.zidio.VideoContent;

public interface CourseProgressDao extends JpaRepository<CourseProgress, Long> {
	
	// Custom query methods can be added here if needed
	// For example, to find progress by user and course:
	// List<CourseProgress> findByUserIdAndCourseId(Long userId, Long courseId);
	
	// Or to find all progress for a specific course:
	 List<CourseProgress> findByCourseId(Long courseId);
	 List<CourseProgress> findByStudentUserName(String userName);
	 List<CourseProgress> findByVideoId(Long videoId);
	 CourseProgress findByStudentAndVideo(User student, VideoContent video);
	 CourseProgress findByStudentAndCourse(User student, Course course);

}
