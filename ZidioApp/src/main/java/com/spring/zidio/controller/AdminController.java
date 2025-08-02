package com.spring.zidio.controller;

import java.io.IOException;
import java.math.BigDecimal;
import java.security.Principal;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.spring.zidio.AdminNotification;
import com.spring.zidio.AdminProfile;
import com.spring.zidio.AuditLog;
import com.spring.zidio.Category;
import com.spring.zidio.Course;
import com.spring.zidio.CourseAuditLog;
import com.spring.zidio.CourseEnrollment;
import com.spring.zidio.CourseReview;
import com.spring.zidio.ImageModel;
import com.spring.zidio.Internship;
import com.spring.zidio.Job;
import com.spring.zidio.Message;
import com.spring.zidio.Report;
import com.spring.zidio.ReportStatus;
import com.spring.zidio.Syllabus;
import com.spring.zidio.User;
import com.spring.zidio.VideoContent;
import com.spring.zidio.dao.UserDao;
import com.spring.zidio.payload.CourseRequest;
import com.spring.zidio.payload.CourseUpdateRequest;
import com.spring.zidio.payload.SendMessageRequest;
import com.spring.zidio.service.AdminNotificationService;
import com.spring.zidio.service.AdminProfileService;
import com.spring.zidio.service.AnalyticsService;
import com.spring.zidio.service.AuditLogService;
import com.spring.zidio.service.CategoryService;
import com.spring.zidio.service.CloudinaryService;
import com.spring.zidio.service.CourseEnrollmentService;

import com.spring.zidio.service.CourseReviewService;
import com.spring.zidio.service.CourseService;
import com.spring.zidio.service.InternshipService;
import com.spring.zidio.service.JobService;
import com.spring.zidio.service.MessageService;
import com.spring.zidio.service.ReportService;
import com.spring.zidio.service.SyllabusService;
import com.spring.zidio.service.UserService;
import com.spring.zidio.service.VideoContentService;

import jakarta.persistence.EntityNotFoundException;



@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private UserService userService;
    
    @Autowired 
    private CourseService courseService;
    
    @Autowired
    private UserDao userDao;
    
    @Autowired
    private InternshipService internshipService;
    
    @Autowired
    private JobService jobService;
    
    @Autowired
    private AnalyticsService analyticsService;
    
    @Autowired
    private ReportService reportService;
    
    @Autowired
    private AuditLogService auditLogService;
    
    @Autowired
    private  AdminNotificationService adminNotificationService;
    
    @Autowired
    private CategoryService categoryService;
    
    @Autowired
    private CourseReviewService courseReviewService;
    
    @Autowired
    private AdminProfileService adminProfileService;
    
    @Autowired
    private MessageService messageService;
    
    @Autowired
    private CloudinaryService cloudinaryService;
    
    @Autowired
    private CourseEnrollmentService courseEnrollmentService;
    
    @Autowired
    private SyllabusService syllabusService;
    
    @Autowired
    private VideoContentService videoContentService;
    
    
    //Users and students employers custtomization
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/users/{userName}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable String userName, @RequestParam("status") String userStatus) {
    	try {
            userService.updateUserStatus(userName, userStatus);
            Map<String, String> response = new HashMap<>();
            response.put("message", "User status updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
    
    
    
    @GetMapping("/employers")
    public List<User> getAllEmployers() {
        return userService.getAllEmployers();
    }

    @PutMapping("/employers/{userName}/status")
    public ResponseEntity<?> updateEmployerStatus(@PathVariable String userName,
                                                  @RequestParam("status") String userStatus) {
    	try {
            userService.updateEmployerStatus(userName, userStatus);
            Map<String, String> response = new HashMap<>();
            response.put("message","Employer status updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
    
    @GetMapping("/students")
    public List<User> getAllStudents() {
        return userService.getAllStudents();
    }

    @PutMapping("/students/{userName}/status")
    public ResponseEntity<?> updateStudentStatus(@PathVariable String userName,
                                                  @RequestParam("status") String userStatus) {
    	try {
            userService.updateStudentStatus(userName, userStatus);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Student status updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/users/{userName}")
    public ResponseEntity<?> removeUser(@PathVariable String userName) {
        return userService.deleteUser(userName);
    }

    
    
    
    //Courses customization and assignation
    @PostMapping(value="/courses",consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Map<String, Object>> addCourse(@RequestPart("course") CourseRequest request, @RequestPart(name = "imageFile", required = false) MultipartFile[] file) {
        Map<String, Object> response = new HashMap<>();
        try {
        	Set<ImageModel> images = uploadImage(file);
        	request.setCourseImages(images);
            Course savedCourse = courseService.addCourse(request);
            response.put("message", "Course added successfully");
            response.put("status", "success");
            response.put("course", savedCourse);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("message", "Error adding course: " + e.getMessage());
            response.put("status", "error");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    public Set<ImageModel> uploadImage(MultipartFile[] multipartFiles) throws IOException {
    	Set<ImageModel> imageModels = new HashSet<>();
    	if(multipartFiles != null) {
    	for (MultipartFile file : multipartFiles) {
    		String url = cloudinaryService.uploadFile(file);
    		ImageModel imageModel = new ImageModel(
    				file.getOriginalFilename(),
    				file.getContentType(),
    				url
    				);
            imageModels.add(imageModel);
        }
    	}
    	return imageModels;
    }




    @PutMapping("/courses/{id}/assign")
    public ResponseEntity<Course> assignFaculty(@PathVariable Long id, @RequestParam String userName) {
        return ResponseEntity.ok(courseService.assignFaculty(id, userName));
    }

    @GetMapping("/courses")
    public List<Course> getCourses() {
        return courseService.getAllCourses();
    }
    
    @PutMapping(value ="/courses/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Course> updateCourse(@PathVariable Long id,
    		@RequestPart(name="course") CourseUpdateRequest request, @RequestPart(name = "imageFile", required = false) MultipartFile[] files) {
    	try {
            Set<ImageModel> images = (files != null && files.length > 0) ? uploadImage(files) : null;
            request.setCourseImages(images); // assuming you have a setter for this

            Course updatedCourse = courseService.updateCourse(id, request);
            return ResponseEntity.ok(updatedCourse);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    
    @PutMapping("/courses/{id}/visibility")
    public ResponseEntity<Course> toggleVisibility(@PathVariable Long id, @RequestParam boolean active) {
        return ResponseEntity.ok(courseService.toggleVisibility(id, active));
    }
    @PutMapping("/courses/{id}/status")
    public ResponseEntity<Course> updateCourseStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(courseService.updateCourseStatus(id, status));
    }
    
    @PutMapping("/courses/{id}/archive")
    public ResponseEntity<?> archiveCourse(@PathVariable Long id) {
        try {
            courseService.archiveCourse(id);
            return ResponseEntity.ok(Collections.singletonMap("message", "Course archived successfully."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
    
    @PutMapping("/courses/{id}/unarchive")
    public ResponseEntity<?> unarchiveCourse(@PathVariable Long id) {
        try {
            courseService.unarchiveCourse(id);
            return ResponseEntity.ok(Collections.singletonMap("message", "Course Unarchived successfully."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
    
    @GetMapping("/course/enroll/all")
    public List<CourseEnrollment> getAllEnrollments() {
        return courseEnrollmentService.getAllEnrollments();
    }

    @GetMapping("/course/enroll/{courseId}")
    public List<CourseEnrollment> getByCourseId(@PathVariable Long courseId) {
        return courseEnrollmentService.getEnrollmentsByCourseId(courseId);
    }

    @GetMapping("/course/enroll/student/{username}")
    public List<CourseEnrollment> getByStudentUsername(@PathVariable String username) {
        return courseEnrollmentService.getEnrollmentsByStudentUsername(username);
    }
    
    @GetMapping("/course/enrollby/{id}")
    public CourseEnrollment getEnrollmentById(@PathVariable Long id) {
        return courseEnrollmentService.getEnrollmentById(id);
    }
    
    @DeleteMapping("/course/{enrollmentId}")
    public String deleteEnrollmentById(@PathVariable Long enrollmentId) {
        boolean deleted = courseEnrollmentService.deleteEnrollment(enrollmentId);
        return deleted ? "Enrollment deleted." : "Enrollment not found.";
    }
    


    @DeleteMapping("/courses/{id}/delete")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        System.out.println("Delete request for course id: " + id);
        try {
            boolean deleted = courseService.deleteCourse(id);
            System.out.println("Deletion success: " + deleted);
            if (deleted) {
                return ResponseEntity.ok("Course permanently deleted.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                     .body(Collections.singletonMap("message", "Course not found."));
            }
        } catch (Exception e) {
            System.err.println("Error deleting course: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Collections.singletonMap("message", "Failed to delete course: " + e.getMessage()));
        }
    }
    
    @GetMapping("/courses/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Course course = courseService.getCourseById(id);
        return new ResponseEntity<>(course, HttpStatus.OK);
    }
    


    
  //filter by search
    @GetMapping("/courses/filter")
    public ResponseEntity<Page<Course>> filterCourses(
        @RequestParam(required = false) Long categoryId,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String creatorType,
        @RequestParam(required = false) Integer minEnroll,
        @RequestParam(required = false) Integer maxEnroll,
        @RequestParam(required = false) BigDecimal minPrice,
        @RequestParam(required = false) BigDecimal maxPrice,
        @RequestParam(required = false) String search,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(courseService.filterCourses(categoryId, status, creatorType, minEnroll, maxEnroll,search, maxPrice, minPrice, page, size));
    }
    //Audit files
    @GetMapping("/courses/{id}/audit")
    public ResponseEntity<List<CourseAuditLog>> getCourseAudit(@PathVariable Long id) {
        return ResponseEntity.ok(auditLogService.getLogs(id));
    }

    //reviews of courses
    @GetMapping("course/reviews/flagged")
    public ResponseEntity<List<CourseReview>> getFlaggedReviews() {
        return ResponseEntity.ok(courseReviewService.getFlaggedReviews());
    }


    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        courseReviewService.deleteReview(id);
        return ResponseEntity.ok().build();
    }
    

    //Internship customization
    
    @GetMapping("/internships")
    public List<Internship> getAllInternships() {
        return internshipService.getAllInternships();
    }

    @GetMapping("/internships/flagged")
    public List<Internship> getFlaggedInternships() {
        return internshipService.getFlaggedInternships();
    }

    @DeleteMapping("/internships/{id}")
    public ResponseEntity<?> deleteInternship(@PathVariable Long id) {
        internshipService.deleteInternship(id);
        return ResponseEntity.ok("Internship deleted");
    }
    // Moderate Internship Status (Approve/Reject/Flag)	
    @PutMapping("/internships/{id}/status")
    public ResponseEntity<Internship> updateInternshipStatus(@PathVariable Long id,
                                                             @RequestParam("status") String status) {
        return ResponseEntity.ok(internshipService.updateInternshipStatus(id, status));
    }
    
    //Jobs customization
    @GetMapping("/jobs")
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    @GetMapping("/jobs/flagged")
    public List<Job> getFlaggedJobs() {
        return jobService.getFlaggedJobs();
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        
        AdminNotification notification = new AdminNotification();
        notification.setType("AuditLog");
        notification.setTitle("Job Deleted");
        notification.setMessage("Admin deleted job ID " + id);
        notification.setPriority("MEDIUM");
 	   notification.setReferenceId(String.valueOf(id));
        adminNotificationService.createNotification(notification);
        return ResponseEntity.ok("Job deleted");
    }
    
 // Moderate Job Status (Approve/Reject/Flag)
    @PutMapping("/jobs/{id}/status")
    public ResponseEntity<Job> updateJobStatus(@PathVariable Long id,
                                               @RequestParam("status") String status) {
        return ResponseEntity.ok(jobService.updateJobStatus(id, status));
    }
    
    @GetMapping("/admin/test-token")
    public String testToken(Principal principal) {
        return "Authenticated as: " + principal.getName();
    }
    
    //analytics
    
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getDashboardAnalytics() {
        return ResponseEntity.ok(analyticsService.getDashboardStats());
    }

    //getting reports from users
    @GetMapping("/unresolvedreports")
    public List<Report> getReports() {
        return reportService.getUnresolvedReports();
    }

    @PutMapping("/reports/{id}/resolve")
    public ResponseEntity<String> resolveReport(@PathVariable Long id) {
        reportService.resolveReport(id);
        return ResponseEntity.ok("Report resolved.");
    }
    
    @GetMapping("/Allreports")
    public List<Report> getAllReports() {
		return reportService.getAllReports();
	}
    
    @GetMapping("/reports/{id}")
    public ResponseEntity<Report> getReportById(@PathVariable Long id) {
		Optional<Report> report = reportService.getReportById(id);
		return report.map(ResponseEntity::ok)
					 .orElse(ResponseEntity.notFound().build());
	}
    
    @PutMapping("/{id}/update-status")
    public ResponseEntity<Report> updateStatus(
            @PathVariable Long id,
            @RequestParam ReportStatus status,
            @RequestParam(required = false) String resolutionNotes,
            @RequestParam(defaultValue = "false") boolean resolved
    ) {
        Report updatedReport = reportService.updateReportStatus(id, status, resolutionNotes, resolved);
        return ResponseEntity.ok(updatedReport);
    }
    
    @DeleteMapping("/reports/{id}")
    public void deleteReport(@PathVariable Long id) {
		reportService.deleteReport(id);
		
		AdminNotification notification = new AdminNotification();
		notification.setType("Report");
		notification.setTitle("Report Deleted");
		notification.setMessage("Admin deleted report ID " + id);
		notification.setPriority("MEDIUM");
 	   notification.setReferenceId(String.valueOf(id));
		adminNotificationService.createNotification(notification);
	}
    
    
    //auditlog services
    @GetMapping("/logs")
    public List<AuditLog> getLogs() {
        return auditLogService.getAllLogs();
    }
    
    //reset-password
    @PutMapping("/users/{userName}/reset-password")
    public ResponseEntity<?> resetPassword2(@PathVariable String userName, @RequestParam String newPassword) {
        userService.updatePassword1(userName, newPassword);
        return ResponseEntity.ok("Password updated successfully");
    }
    @PutMapping("/employers/{userName}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable String userName, @RequestParam String newPassword) {
        userService.updatePassword1(userName, newPassword);
        return ResponseEntity.ok("Password updated successfully");
    }

    
    @PutMapping("/students/{userName}/reset-password")
    public ResponseEntity<?> resetPassword1(@PathVariable String userName, @RequestParam String newPassword) {
        userService.updatePassword1(userName, newPassword);
        return ResponseEntity.ok("Password updated successfully");
    }
    
    ///Notification service
    
    @GetMapping("/notifications")
    public ResponseEntity<Page<AdminNotification>> getAllNotifications(@RequestParam(defaultValue ="0")int page, @RequestParam(defaultValue = "10") int size) {
    	Page<AdminNotification> result = adminNotificationService.getAllNotifications(PageRequest.of(page, size));
        return ResponseEntity.ok(result);
    }

    @GetMapping("/notifications/unread")
    public ResponseEntity<List<AdminNotification>> getUnread() {
    	return ResponseEntity.ok(adminNotificationService.getUnreadNotifications());
    }
    
    @GetMapping("/notifications/unresolved")
    public ResponseEntity<List<AdminNotification>> getUnresolved() {
        return ResponseEntity.ok(adminNotificationService.getUnresolvedNotifications());
    }

    @PostMapping
    public AdminNotification create(@RequestBody AdminNotification notification) {
        return adminNotificationService.createNotification(
            notification.getType(),
            notification.getTitle(),
            notification.getMessage(),
            notification.getPriority(),
            notification.getReferenceId()
        );
    }
    
    @GetMapping("/notifications/priority/{priority}")
    public ResponseEntity<List<AdminNotification>> getByPriority(@PathVariable String priority) {
        return ResponseEntity.ok(adminNotificationService.getByPriority(priority));
    }

    // Get unread notifications by type
    @GetMapping("/notifications/type/{type}")
    public ResponseEntity<List<AdminNotification>> getUnreadByType(@PathVariable String type) {
        return ResponseEntity.ok(adminNotificationService.getUnreadByType(type));
    }

    @PutMapping("/notifications/{id}/read")
    public void markAsRead(@PathVariable Long id) {
    	adminNotificationService.markAsRead(id);
    }
    
    @PutMapping("/notifications/read-all")
    public ResponseEntity<Void> markAllAsRead() {
        adminNotificationService.markAllAsRead();
        return ResponseEntity.ok().build();
    }

    @PutMapping("/notifications/{id}/resolve")
    public void resolve(@PathVariable Long id) {
    	adminNotificationService.resolveNotification(id);
    }
    
    @DeleteMapping("/notifications/{id}")
    public ResponseEntity<String> deleteNotification(@PathVariable Long id) {
        try {
            adminNotificationService.deleteNotification(id);
            return ResponseEntity.ok("Notification deleted successfully");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Notification not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the notification");
        }
    }
    
    @DeleteMapping("/notifications/deleteAll")
    public ResponseEntity<Map<String, String>> deleteAllNotifications() {
        adminNotificationService.deleteAllNotifications();
        Map<String, String> response = new HashMap<>();
        response.put("message", "All notifications deleted");
        return ResponseEntity.ok(response);
    }


    @PutMapping("/notifications/resolve-all")
    public ResponseEntity<Map<String, String>> resolveAllNotifications() {
        adminNotificationService.resolveAllNotifications();
        Map<String, String> response = new HashMap<>();
        response.put("message", "All notifications resolved successfully.");
        return ResponseEntity.ok(response);
    }

    
    //Category endpoints
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        return ResponseEntity.ok(categoryService.createCategory(category));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        return ResponseEntity.ok(categoryService.updateCategory(id, category));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok("Category deleted successfully.");
    }
    
    //profiles
    @GetMapping("/profile")
    public ResponseEntity<AdminProfile> getProfile() {
    	String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return adminProfileService.getProfileByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/profile")
    public ResponseEntity<AdminProfile> updateProfile(
            @RequestParam String userFirstName,
            @RequestParam String userLastName,
            @RequestParam String email,
            @RequestParam(required = false) String phone,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture
    ) {
    	String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
        	Optional<User> userOpt = userDao.findById(username);
        	 if (userOpt.isPresent()) {
                 User user = userOpt.get();
                 user.setUserFirstName(userFirstName);
                 user.setUserLastName(userLastName);
                 userDao.save(user);
        	 }
            AdminProfile profile = adminProfileService.getProfileByUsername(username)
                    .orElse(new AdminProfile());
            profile.setUsername(username);
            profile.setUserFirstName(userFirstName);
            profile.setUserLastName(userLastName);
            profile.setEmail(email);
            profile.setPhone(phone);

            if (profilePicture != null && !profilePicture.isEmpty()) {
            	String imageUrl = cloudinaryService.uploadprofile(profilePicture, "admin-profile_pictures");
				profile.setProfilePictureUrl(imageUrl);
            }

            AdminProfile savedProfile = adminProfileService.saveOrUpdateProfile(profile);
            return ResponseEntity.ok(savedProfile);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    
    //in-dashboard messaging
    @PostMapping("/messages")
    public ResponseEntity<?> sendMessage(@RequestBody SendMessageRequest request) {
       try {
    	Message saved = messageService.sendMessage(
            request.getRecipientUserName(),
            request.getSubject(),
            request.getBody());
        return ResponseEntity.ok(saved);
       }catch (Exception e) {
           e.printStackTrace();
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Error: " + e.getMessage());
       }
    }

//    
    @GetMapping("/messages")
    public List<Message> getAllMessages() {
        return messageService.getAllMessages();
    }
    
    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/messages/recipient/{userName}")
    public ResponseEntity<Page<Message>> getMessagesFromRecipient(@PathVariable String userName,@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {
    	Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(messageService.getMessagesFromRecipient(userName,pageable));
    }
    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/messages/sender/{userName}")
    public ResponseEntity<Page<Message>> getMessagesFromSender(@PathVariable String userName, @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {
    	Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(messageService.getMessagesFromSender(userName,pageable));
    }

    @GetMapping("/messages/{id}")
    public ResponseEntity<Message> getMessageById(@PathVariable Long id) {
        return messageService.getMessageById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/messages/{id}/read")
    public ResponseEntity<Message> markAsReadMessage(@PathVariable Long id) {
        return ResponseEntity.ok(messageService.markAsRead(id));
    }
    
    @DeleteMapping("/messages/sender/{userName}/deleteAll")
    public ResponseEntity<Void> deleteAllSentMessages(@PathVariable String userName) {
        messageService.deleteAllSentMessages(userName);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/messages/recipient/{userName}/deleteAll")
    public ResponseEntity<Void> deleteAllInboxMessages(@PathVariable String userName) {
        messageService.deleteAllInboxMessages(userName);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/messages/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        messageService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/messages/recipient/{userName}/read")
    public ResponseEntity<List<Message>> markAllAsReadFromRecipient(@PathVariable String userName) {
        return ResponseEntity.ok(messageService.markAllAsReadFromRecipient(userName));
    }
    
    @PutMapping("/messages/sender/{userName}/read")
    public ResponseEntity<List<Message>> markAllAsReadFromSender(@PathVariable String userName) {
        return ResponseEntity.ok(messageService.markAllAsReadFromSender(userName));
    }
    
    //syllabus
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Syllabus>> getSyllabusByCourseId(@PathVariable Long courseId) {
        List<Syllabus> syllabusList = syllabusService.getByCourseId(courseId);
        return new ResponseEntity<>(syllabusList, HttpStatus.OK);
    }
    @PostMapping("/syllabus")
    public ResponseEntity<Syllabus> createSyllabus(@RequestBody Syllabus syllabus) {
        Syllabus createdSyllabus = syllabusService.createSyllabus(syllabus);
        return ResponseEntity.ok(createdSyllabus);
    }
    
    @PutMapping("/upsyllabus/{id}")
    public Syllabus updateSyllabus(@PathVariable Long id,@RequestBody Syllabus syllabus)
    {
    	return syllabusService.update(id,syllabus);
    }
    
    @GetMapping("/syllabus")
    public List<Syllabus> getAllSyllabus() {
		return syllabusService.getAllSyllabus();
	}
    
    @GetMapping("/syll/{id}")
    public Syllabus getSyllabusById(@PathVariable Long id) {
		return syllabusService.getById(id);
	}
    
    @DeleteMapping("/syllabus/{id}")
    public void deleteSyllabus(@PathVariable Long id) {
		syllabusService.deleteSyllabus(id);
	}
    
    //Video Content
    
    @PostMapping("/syllabus/{syllabusId}/video-content")
    public VideoContent saveVideoContent(
            @PathVariable Long syllabusId,
            @RequestParam(required = false) MultipartFile file,
            @RequestParam(required = false) String videoUrl,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam(required = false) Integer duration
    ) {
        VideoContent videoContent = new VideoContent();
        videoContent.setTitle(title);
        videoContent.setDescription(description);

        if (file != null && !file.isEmpty()) {
            Map uploadResult = cloudinaryService.uploadVideo(file, "courseVideos");
            String uploadedUrl = uploadResult.get("url").toString();
            Double durationSec = (Double) uploadResult.getOrDefault("duration", 0.0);

            videoContent.setVideoUrl(uploadedUrl);
            videoContent.setDuration(durationSec.intValue());
        } else if (videoUrl != null && !videoUrl.isBlank()) {
            if (duration == null || duration <= 0) {
                throw new RuntimeException("Duration must be provided when using a video URL.");
            }
            videoContent.setVideoUrl(videoUrl);
            videoContent.setDuration(duration);
        } else {
            throw new RuntimeException("Either a video file or videoUrl must be provided.");
        }

        Syllabus syllabus = syllabusService.getById(syllabusId);
        if (syllabus == null) {
            throw new RuntimeException("Syllabus not found with id: " + syllabusId);
        }

        videoContent.setSyllabus(syllabus);
        return videoContentService.create(videoContent);
    }

 
    @PutMapping("/video-content/{id}")
    public VideoContent updateVideoContent(
            @PathVariable Long id,
            @RequestParam(required = false) MultipartFile file,
            @RequestParam(required = false) String videoUrl,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam(required = false) Integer duration
            
    ) {
        VideoContent videoContent = videoContentService.getById(id);
        if (videoContent == null) {
            throw new RuntimeException("VideoContent not found with id: " + id);
        }

        videoContent.setTitle(title);
        videoContent.setDescription(description);

        if (file != null && !file.isEmpty()) {
        	 Map uploadResult = cloudinaryService.uploadVideo(file, "courseVideos");
             String uploadedUrl = uploadResult.get("url").toString();
             Double durationSec = (Double) uploadResult.getOrDefault("duration", 0.0);

             videoContent.setVideoUrl(uploadedUrl);
             videoContent.setDuration(durationSec.intValue());
        } else if (videoUrl != null && !videoUrl.isBlank()) {
        	if (duration == null || duration <= 0) {
                throw new RuntimeException("Duration must be provided when using a video URL.");
            }
            videoContent.setVideoUrl(videoUrl);
            videoContent.setDuration(duration);
        }
        
        

        return videoContentService.update(videoContent);
    }

    @GetMapping("/videos-content/{id}")
    public VideoContent getVideoById(@PathVariable Long id) {
        return videoContentService.getById(id);
    }

    @DeleteMapping("/video-content/{id}")
    public void deleteVideo(@PathVariable Long id) {
        videoContentService.delete(id);
    }
    
    @GetMapping("/video-content/{syllabusId}")
    public ResponseEntity<List<VideoContent>> getVideosBySyllabusId(@PathVariable Long syllabusId) {
        List<VideoContent> videos = videoContentService.getBySyllabusId(syllabusId);
        return new ResponseEntity<>(videos, HttpStatus.OK);
    }
    
    //courseProgress
    
}


