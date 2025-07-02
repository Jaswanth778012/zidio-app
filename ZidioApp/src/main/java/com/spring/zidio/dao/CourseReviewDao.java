package com.spring.zidio.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.zidio.Course;
import com.spring.zidio.CourseReview;

public interface CourseReviewDao extends JpaRepository<CourseReview, Long> {
    List<CourseReview> findByCourse(Course course);
    List<CourseReview> findByFlaggedTrue();
}