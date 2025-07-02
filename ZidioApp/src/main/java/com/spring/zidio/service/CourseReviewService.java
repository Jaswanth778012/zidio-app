package com.spring.zidio.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.zidio.Course;
import com.spring.zidio.CourseReview;
import com.spring.zidio.dao.CourseDao;
import com.spring.zidio.dao.CourseReviewDao;

@Service
public class CourseReviewService {

    @Autowired private CourseDao courseDao;
    @Autowired private CourseReviewDao reviewRepo;
    @Autowired private AdminNotificationService notificationService;
    public List<CourseReview> getReviewsForCourse(Long id) {
        Course course = courseDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return reviewRepo.findByCourse(course);
    }

    public List<CourseReview> getFlaggedReviews() {
        return reviewRepo.findByFlaggedTrue();
    }

    public CourseReview submitReview(Long id, String userName, int rating, String comment) {
        Course course = courseDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        CourseReview review = new CourseReview();
        review.setCourse(course);
        review.setReviewerUsername(userName);
        review.setRating(rating);
        review.setComment(comment);
        review.setCreatedAt(LocalDateTime.now());

        return reviewRepo.save(review);
    }

    public void flagReview(Long reviewId) {
        CourseReview review = reviewRepo.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setFlagged(true);
        
        notificationService.createNotification(
        	    "FLAGGED_CONTENT",
        	    "Course review flagged",
        	    "A course review was flagged for: " + review.getCourse().getCourseName(),
        	    "HIGH",
        	    review.getId().toString()
        	);

        reviewRepo.save(review);
    }

    public void deleteReview(Long reviewId) {
        reviewRepo.deleteById(reviewId);
    }
}
