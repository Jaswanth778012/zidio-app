package com.spring.zidio.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.zidio.Course;
import com.spring.zidio.CourseEnrollment;
import com.spring.zidio.User;

public interface CourseEnrollmentDao extends JpaRepository<CourseEnrollment, Long> {
	List<CourseEnrollment> findByCourseId(Long courseId);
	List<CourseEnrollment> findByStudent_UserName(String username);
	List<CourseEnrollment> findByStudentAndCourse(User student, Course course);
	boolean existsByStudentAndCourse(User student, Course course);
	List<CourseEnrollment> findByRazorpayOrderId(String razorpayOrderId);

	Optional<CourseEnrollment> findByStudent_UserNameAndCourse_Id(String username, Long courseId);
	
	
	 Long countByStudentAndCourse_PriceGreaterThan(User student, double price);
	 Long countByStudentAndCourse_PriceEquals(User student, double price);
	
}
