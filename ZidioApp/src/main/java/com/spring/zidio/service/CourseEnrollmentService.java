package com.spring.zidio.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.razorpay.Order;
import com.spring.zidio.Course;
import com.spring.zidio.CourseEnrollment;
import com.spring.zidio.EnrollmentStatus;
import com.spring.zidio.User;
import com.spring.zidio.dao.CourseDao;
import com.spring.zidio.dao.CourseEnrollmentDao;
import com.spring.zidio.dao.StudentProfileDao;
import com.spring.zidio.dao.UserDao;

@Service
public class CourseEnrollmentService {
	
	@Autowired
	private CourseEnrollmentDao courseEnrollmentDao;
	
	@Autowired
	private CourseDao courseDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private StudentProfileDao studentProfileDao;
	
	@Autowired
	private RazorpayService razorpayService;
	
	
	public String enrollInFreeCourse(Long courseId, String username) {
	    Course course = courseDao.findById(courseId)
	            .orElseThrow(() -> new RuntimeException("Course not found"));

	    if (course.getPrice() != null && course.getPrice().compareTo(BigDecimal.ZERO) > 0) {
	        return "This is a paid course. Payment required.";
	    }

	    User student = userDao.findByUserName(username)
	            .orElseThrow(() -> new RuntimeException("User not found"));
	    
	    
	    
	    if (courseEnrollmentDao.existsByStudentAndCourse(student, course)) {
	        return "Already enrolled in this course.";
	    }

	    CourseEnrollment enrollment = new CourseEnrollment();
	    enrollment.setCourse(course);
	    enrollment.setStudent(student);
	    enrollment.setEnrollmentStatus(EnrollmentStatus.ENROLLED);
        
        studentProfileDao.findByUsername(student.getUserName())
        .ifPresent(enrollment::setStudentProfilePicture);
	    courseEnrollmentDao.save(enrollment); // ✅ Save to enrollment repository

	    course.setEnrollmentCount(course.getEnrollmentCount() + 1);
	    courseDao.save(course); // ✅ Save updated course

	    return "Successfully enrolled in the course.";
	}
	
	public String enrollInPaidCourse(Long courseId, String username) {
	    Course course = courseDao.findById(courseId)
	            .orElseThrow(() -> new RuntimeException("Course not found"));

	    if (course.getPrice() == null || course.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
	        return "This is a free course. No payment required.";
	    }

	    User student = userDao.findByUserName(username)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    boolean alreadyEnrolled = courseEnrollmentDao
	            .findByStudentAndCourse(student, course)
	            .stream()
	            .anyMatch(enrollment -> "SUCCESS".equals(enrollment.getPaymentStatus()));

	    if (alreadyEnrolled) {
	        return "Already enrolled in this course.";
	    }

	    // ✅ Reuse existing PENDING enrollment if exists
	    Optional<CourseEnrollment> existingPending = courseEnrollmentDao
	            .findByStudentAndCourse(student, course)
	            .stream()
	            .filter(enrollment -> "PENDING".equals(enrollment.getPaymentStatus()))
	            .findFirst();

	    if (existingPending.isPresent()) {
	        String existingOrderId = existingPending.get().getRazorpayOrderId();
	        return "order exists-> Order ID: " + existingOrderId;
	    }


	    try {
	        // Create Razorpay Order
	        String receipt = "order_rcptid_" + System.currentTimeMillis();
	        Order order = razorpayService.createOrder(course.getDiscountedPrice(), "INR", receipt);
	        String razorpayOrderId = order.get("id");

	        // 🔥 Save initial enrollment with just orderId
	        CourseEnrollment enrollment = new CourseEnrollment();
	        enrollment.setCourse(course);
	        enrollment.setStudent(student);
	        enrollment.setRazorpayOrderId(razorpayOrderId);
	        enrollment.setPaymentStatus("PENDING");
	        courseEnrollmentDao.save(enrollment);

	        return "order created-> Order ID: " + razorpayOrderId;


	    } catch (Exception e) {
	        e.printStackTrace();
	        return "Failed to initiate payment.";
	    }
	}
	
	public boolean confirmEnrollmentAfterPayment(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature, String username) {
	    User student = userDao.findByUserName(username)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    CourseEnrollment enrollment = courseEnrollmentDao.findByRazorpayOrderId(razorpayOrderId)
	            .stream()
	            .filter(e -> e.getStudent().getUserName().equals(username))
	            .findFirst()
	            .orElse(null);

	    if (enrollment == null) {
	        throw new RuntimeException("Enrollment not found for this order and student");
	    }


	    // If already marked SUCCESS, prevent double update
	    if ("SUCCESS".equals(enrollment.getPaymentStatus())) {
	        return false;
	    }

	    enrollment.setRazorpayPaymentId(razorpayPaymentId);
	    enrollment.setRazorpaySignature(razorpaySignature);
	    enrollment.setPaymentStatus("SUCCESS");
	    enrollment.setEnrollmentStatus(EnrollmentStatus.ENROLLED);

	    studentProfileDao.findByUsername(student.getUserName())
	            .ifPresent(enrollment::setStudentProfilePicture);

	    courseEnrollmentDao.save(enrollment);

	    Course course = enrollment.getCourse();
	    course.setEnrollmentCount(course.getEnrollmentCount() + 1);
	    courseDao.save(course);

	    return true;
	}


	
	public boolean updatePaymentStatus(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature, String username, String newStatus) {
	    CourseEnrollment enrollment = courseEnrollmentDao.findByRazorpayOrderId(razorpayOrderId)
	            .stream()
	            .filter(e -> e.getStudent().getUserName().equals(username))
	            .findFirst()
	            .orElse(null);

	    if (enrollment == null) {
	        return false;
	    }

	    enrollment.setPaymentStatus(newStatus);
	    enrollment.setRazorpayPaymentId(razorpayPaymentId);
	    enrollment.setRazorpaySignature(razorpaySignature);
	    courseEnrollmentDao.save(enrollment);
	    return true;
	}

	
	public List<CourseEnrollment> getEnrollmentsByCourseId(Long courseId) {
        return courseEnrollmentDao.findByCourseId(courseId);
    }

    public List<CourseEnrollment> getEnrollmentsByStudentUsername(String username) {
        return courseEnrollmentDao.findByStudent_UserName(username);
    }
    public List<CourseEnrollment> getAllEnrollments() {
        return courseEnrollmentDao.findAll();
    }
    public boolean isStudentEnrolledInCourse(User student, Course course) {
		return courseEnrollmentDao.existsByStudentAndCourse(student, course);
	}
    
    public List<Course> getEnrolledCoursesForStudent(String username) {
        List<CourseEnrollment> enrollments = courseEnrollmentDao.findByStudent_UserName(username);
        return enrollments.stream()
                .map(CourseEnrollment::getCourse)
                .toList();
    }


	public CourseEnrollment getEnrollmentById(Long id) {
		return courseEnrollmentDao.findById(id)
				.orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + id));
	}
	
	public boolean deleteEnrollment(Long enrollmentId) {
	    CourseEnrollment enrollment = courseEnrollmentDao.findById(enrollmentId)
	            .orElse(null);

	    if (enrollment == null) {
	        return false;
	    }

	    Course course = enrollment.getCourse();
	    if (course != null && course.getEnrollmentCount() > 0) {
	        course.setEnrollmentCount(course.getEnrollmentCount() - 1);
	        courseDao.save(course);
	    }

	    courseEnrollmentDao.delete(enrollment);
	    return true;
	}
	
	public CourseEnrollment getEnrollmentForUserAndCourse(String username, Long courseId) {
	    return courseEnrollmentDao.findByStudent_UserNameAndCourse_Id(username, courseId)
	            .orElse(null); // ✅ return null instead of throwing exception
	}


    
	
	
	

}
