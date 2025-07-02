package com.spring.zidio.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.spring.zidio.Category;
import com.spring.zidio.Course;
import com.spring.zidio.User;
import com.spring.zidio.dao.CategoryDao;
import com.spring.zidio.dao.CourseDao;
import com.spring.zidio.dao.UserDao;
import com.spring.zidio.payload.CourseRequest;
import com.spring.zidio.payload.CourseUpdateRequest;

@Service
public class CourseService {

    @Autowired 
    private CourseDao courseDao;
    @Autowired private UserDao userDao;
    @Autowired private CategoryDao categoryDao;
    @Autowired private AuditLogService auditLogService;
    @Autowired private AdminNotificationService notificationService;
//    public Course addCourse(String courseName) {
//        Course course = new Course();
//        course.setCourseName(courseName);
//        return courseDao.save(course);
//    }

    public Course assignFaculty(Long id, String userName) {
        Course course = courseDao.findById(id).orElseThrow();
        User faculty = userDao.findById(userName).orElseThrow();
        course.setFaculty(faculty);
        return courseDao.save(course);
    }

    public List<Course> getAllCourses() {
        return courseDao.findAll();
    }
    
//    public Course updateCourse(Long id, String courseName) {
//        Course course = courseDao.findById(id)
//                .orElseThrow(() -> new RuntimeException("Course not found"));
//        course.setCourseName(courseName);
//        return courseDao.save(course);
//    }
    
    public Course updateCourse(Long id, CourseUpdateRequest request) {
    	if (id == null) {
            throw new IllegalArgumentException("Course ID must not be null");
        }
        if (request.getCategoryId() == null) {
            throw new IllegalArgumentException("Category ID must not be null");
        }
    	Course course = courseDao.findById(id)
            .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setCourseName(request.getCourseName());
        course.setDescription(request.getDescription());
        course.setTags(request.getTags());
        course.setContentType(request.getContentType());
        course.setPreviewUrl(request.getPreviewUrl());
        course.setPrerequisites(request.getPrerequisites());
        course.setCertificate(request.isCertificate());
        course.setSelfPaced(request.isSelfPaced());
        course.setStartDate(request.getStartDate());
        course.setEndDate(request.getEndDate());
        course.setPrice(request.getPrice());
        course.setDiscountedPrice(request.getDiscountedPrice());
        if (request.getCourseImages() != null && !request.getCourseImages().isEmpty()) {
            // Clear old images if you want to replace them
            course.getCourseImages().clear();

            // Add new images
            course.getCourseImages().addAll(request.getCourseImages());
        }
        // Update category
        Category category = categoryDao.findById(request.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found"));
        course.setCategory(category);
        auditLogService.log(course.getId(), "UPDATED", "admin", "Course updated via Admin Panel");
        return courseDao.save(course);
    }

//    public void deleteCourse(Long id) {
//        courseDao.deleteById(id);
//    }
    public void archiveCourse(Long id) {
        Course course = courseDao.findById(id)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setArchived(true);
        courseDao.save(course);
    }
    public void unarchiveCourse(Long id) throws Exception {
        Course course = courseDao.findById(id)
            .orElseThrow(() -> new Exception("Course not found with id: " + id));
        course.setArchived(false); // Mark course as not archived
        courseDao.save(course);
    }
//    public boolean deleteCourse(Long id) {
//        if (courseDao.existsById(id)) {
//        	 Course course = courseDao.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
//        	 notificationService.createNotification(
//        	            "COURSE_DELETED",
//        	            "Course deleted: " + course.getCourseName(),
//        	            "Course deleted by admin: " + course.getFaculty().getUserName(),
//        	            "HIGH",
//        	            course.getId().toString()
//        	        );
//
//        	        auditLogService.log(course.getId(), "DELETED", "admin", "Course deleted via Admin Panel");
//            courseDao.deleteById(id);
//            return true;   // deletion successful
//        } else {
//            return false;  // course not found, no deletion
//        }
//    }

    
    public boolean deleteCourse(Long id) {
        if (courseDao.existsById(id)) {
            Course course = courseDao.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));

            String facultyUserName = (course.getFaculty() != null) ? course.getFaculty().getUserName() : "Unknown";

            try {
                notificationService.createNotification(
                    "COURSE_DELETED",
                    "Course deleted: " + course.getCourseName(),
                    "Course deleted by admin: " + facultyUserName,
                    "HIGH",
                    course.getId().toString()
                );
            } catch (Exception e) {
                System.err.println("Notification error: " + e.getMessage());
                // Decide if you want to fail here or continue
            }

            try {
                auditLogService.log(course.getId(), "DELETED", "admin", "Course deleted via Admin Panel");
            } catch (Exception e) {
                System.err.println("Audit log error: " + e.getMessage());
                // Decide if you want to fail here or continue
            }

            try {
                courseDao.deleteById(id);
            } catch (Exception e) {
                System.err.println("Error deleting course: " + e.getMessage());
                throw e;  // Let the controller catch it
            }

            return true;
        } else {
            return false;
        }
    }

    public Course addCourse(CourseRequest request) {
        Course course = new Course();

        course.setCourseName(request.getCourseName());
        course.setDescription(request.getDescription());
        course.setTags(request.getTags() != null ? String.join(",", request.getTags().stream().map(String::trim).toList()) : "");
        course.setContentType(request.getContentType());
        course.setPreviewUrl(request.getPreviewUrl());
        List<String> prerequisites = request.getPrerequisites();
        course.setPrerequisites(prerequisites != null ? String.join(",", prerequisites) : "");
        course.setCertificate(request.isCertificate());
        course.setSelfPaced(request.isSelfPaced());
        course.setStartDate(request.getStartDate());
        course.setEndDate(request.getEndDate());
        course.setPrice(request.getPrice());
        course.setDiscountedPrice(request.getDiscountedPrice());
        course.setCourseImages(request.getCourseImages());

        // Fetch Creator
//        User creator = userDao.findByUserName(request.getCreatorUsername())
//                .orElseThrow(() -> new RuntimeException("Creator '" + request.getCreatorUsername() + "' not found"));
//        course.setFaculty(creator);

        // Fetch Category
     // Check if categoryId is provided
        if (request.getCategoryId() == null) {
            throw new RuntimeException("Category ID must not be null");
        }

        // Fetch Category
        Category category = categoryDao.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        course.setCategory(category);


        // 🔽 Add this for multiple categories if needed
        
 // <- assuming your Course entity has a `extraCategories` field

        course.setStatus("PENDING");
        course.setEnrollmentCount(0);
        course.setCreatedAt(LocalDateTime.now());

        

        course = courseDao.save(course);
        System.out.println("Saved images: " + course.getCourseImages());
        String facultyName = course.getFaculty() != null ? course.getFaculty().getUserName() : "Unknown";

        notificationService.createNotification(
            "NEW_COURSE_SUBMISSION",
            "New course submitted: " + course.getCourseName(),
            "New course submitted by employer: " + facultyName,
            "MEDIUM",
            course.getId().toString()
        );

        auditLogService.log(course.getId(), "CREATED", "admin", "Course updated via Admin Panel");
        return course;
        
    }

    
    public Course toggleVisibility(Long courseId, boolean active) {
        Course course = courseDao.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setStatus(active ? "ACTIVE" : "INACTIVE");
        return courseDao.save(course);
    }
    
    public Course updateCourseStatus(Long courseId, String newStatus) {
        Course course = courseDao.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!List.of("PENDING", "APPROVED", "REJECTED", "ACTIVE", "INACTIVE").contains(newStatus.toUpperCase())) {
            throw new RuntimeException("Invalid status value.");
        }

        course.setStatus(newStatus.toUpperCase());
        

        return courseDao.save(course);
    }
    
    public Page<Course> filterCourses(Long categoryId, String status, String creatorType,
            Integer minEnroll, Integer maxEnroll, String search,BigDecimal minPrice, BigDecimal maxPrice,
            int page, int size) {
Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
return courseDao.filterCourses(categoryId, status, minEnroll, maxEnroll, minPrice, maxPrice, search, pageable);
}
 

}

