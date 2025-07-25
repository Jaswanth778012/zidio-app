package com.spring.zidio.controller;

import java.io.IOException;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
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

import com.spring.zidio.Application;
import com.spring.zidio.ApplicationQuestion;
import com.spring.zidio.CalendarEvent;
import com.spring.zidio.Contact;
import com.spring.zidio.Course;
import com.spring.zidio.CourseEnrollment;
import com.spring.zidio.CourseProgress;
import com.spring.zidio.CourseReview;
import com.spring.zidio.Internship;
import com.spring.zidio.Job;
//import com.spring.zidio.Application;
import com.spring.zidio.Message;
import com.spring.zidio.StudentProfile;
import com.spring.zidio.Syllabus;
import com.spring.zidio.User;
import com.spring.zidio.VideoContent;
import com.spring.zidio.dao.ApplicationDao;
import com.spring.zidio.dao.CourseDao;
import com.spring.zidio.dao.CourseEnrollmentDao;
import com.spring.zidio.dao.UserDao;
import com.spring.zidio.dao.VideoContentDao;
//import com.spring.zidio.payload.ApplicationRequest;
import com.spring.zidio.payload.SendMessageRequest;
import com.spring.zidio.service.ApplicationService;
import com.spring.zidio.service.CalendarEventService;
import com.spring.zidio.service.CloudinaryService;
import com.spring.zidio.service.CourseEnrollmentService;
import com.spring.zidio.service.CourseProgressService;
import com.spring.zidio.service.CourseReviewService;
import com.spring.zidio.service.CourseService;
import com.spring.zidio.service.InternshipService;
import com.spring.zidio.service.JobService;
import com.spring.zidio.service.MessageService;
import com.spring.zidio.service.RazorpayService;
import com.spring.zidio.service.StudentProfileService;


@RestController
@RequestMapping("/student")
@CrossOrigin
public class StudentController {
	
	@Autowired
	private StudentProfileService studentProfileService;
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private CourseDao courseDao;
	
	@Autowired
	private ApplicationDao applicationDao;
	
	@Autowired
	private CourseEnrollmentDao courseEnrollmentRepository;
	
	@Autowired
	private JobService jobService;
	
	@Autowired
	private InternshipService internshipService;
	
	@Autowired
	private CourseService courseService;
	
	@Autowired
	private CourseReviewService courseReviewService;
	
	@Autowired
	private MessageService messageService;
	
	@Autowired
	private CloudinaryService cloudinaryService;
	
	@Autowired
	private ApplicationService applicationService;
	
	@Autowired
	private CourseEnrollmentService courseEnrollmentService;
	
	@Autowired
	private RazorpayService razorpayService;
	
	@Autowired
	private VideoContentDao videoContentDao;
	
	@Autowired
	private CourseProgressService courseProgressService;
	
	@Autowired
	private CourseEnrollmentService enrollmentService;
	
	@Autowired
	private CalendarEventService eventService;
	
	
	@GetMapping("/profile")
    public ResponseEntity<StudentProfile> getProfile(Principal principal) {
		String username = principal.getName();
        return studentProfileService.getProfileByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
	
	@PostMapping("/profile")
    public ResponseEntity<StudentProfile> updateProfile(
            @RequestParam String userFirstName,
            @RequestParam String userLastName,
            @RequestParam String email,
            @RequestParam(required = false) String phone,
            @RequestParam String college,
            @RequestParam String branch,
            @RequestParam String department,
            @RequestParam String graduationYear,
            @RequestParam String skills,
            @RequestParam String resumeUrl,
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
            StudentProfile profile = studentProfileService.getProfileByUsername(username)
                    .orElse(new StudentProfile());
            profile.setUsername(username);
            profile.setUserFirstName(userFirstName);
            profile.setUserLastName(userLastName);
            profile.setEmail(email);
            profile.setPhone(phone);
            profile.setCollege(college);
            profile.setBranch(branch);
            profile.setDepartment(department);
            profile.setGraduationYear(graduationYear);
            profile.setSkills(skills);
            profile.setResumeUrl(resumeUrl);

            if (profilePicture != null && !profilePicture.isEmpty()) {
                // Save file
                String imageUrl = cloudinaryService.uploadprofile(profilePicture, "student_profile_pictures");
                profile.setProfilePictureUrl(imageUrl);
            }

            StudentProfile savedProfile = studentProfileService.saveOrUpdateProfile(profile);
            return ResponseEntity.ok(savedProfile);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
	//message service
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
	    public ResponseEntity<Message> markAsRead(@PathVariable Long id) {
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
	    
	    //Application service
//	    @PostMapping("/apply")
//	    public ResponseEntity<?> applyForJob(@RequestBody ApplicationRequest request) {
//	        try {
//	            Application application = applicationService.apply(request);
//	            return ResponseEntity.ok(application);
//	        } catch (Exception e) {
//	            e.printStackTrace();
//	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//	                                 .body("Error: " + e.getMessage());
//	        }
//	    }
	    
	    @GetMapping("/jobs/{id}")
	    public Job getJobById(@PathVariable Long id) {
	        return jobService.getJobById(id);
	    }
	    
	    @GetMapping("/internships/{id}")
	    public Internship getInternshipById(@PathVariable Long id) {
	        return internshipService.getInternshipById(id);
	    }
//	    
	    @GetMapping("/internship/{internshipId}")
	    public ResponseEntity<List<Application>> getApplicationsByInternship(@PathVariable Long internshipId) {
	        return ResponseEntity.ok(applicationService.getByInternshipId(internshipId));
	    }
	    @PostMapping("/apply/job/{id}")
	    public ResponseEntity<?> applyforJob(
	    		@PathVariable Long id,
	            @RequestPart("application") Application application,
	            @RequestPart("resume") MultipartFile resume, Principal principal) {
	        try {
	            Application savedApp = applicationService.applyforJob(id,application, resume, principal);
	            return ResponseEntity.ok(savedApp);
	        } catch (RuntimeException | IOException e) {
	        	e.printStackTrace(); 
	            return ResponseEntity.badRequest().body(e.getMessage());
	        }
	    }
	    
	    @PostMapping("/apply/internship/{id}")
	    public ResponseEntity<?> applyForInternship(
	    		@PathVariable Long id,
	            @RequestPart("application") Application application,
	            @RequestPart("resume") MultipartFile resume, Principal principal) {
	        try {
	        		          
	            System.out.println("Applying for internship with ID: " + id);
	        	System.out.println("Received application data: " + application);
	            System.out.println("Resume file name: " + resume.getOriginalFilename());
	            Application savedApp = applicationService.applyForInternship(id,application, resume, principal);
	            return ResponseEntity.ok(savedApp);
	        } catch (RuntimeException | IOException e) {
	        	e.printStackTrace();
	            return ResponseEntity.badRequest().body(e.getMessage());
	        }
	    }
	    
	    @GetMapping("/jobs/{jobId}/questions")
	    public ResponseEntity<List<ApplicationQuestion>> getQuestionsByJobId(@PathVariable Long jobId) {
	        List<ApplicationQuestion> questions = applicationService.getApplicationQuestionsByJobId(jobId);
	        return ResponseEntity.ok(questions);
	    }
	    @GetMapping("/internships/{internshipId}/questions")
	    public ResponseEntity<List<ApplicationQuestion>> getQuestionsByInternshipId(@PathVariable Long internshipId) {
	        List<ApplicationQuestion> questions = applicationService.getApplicationQuestionsByInternshipId(internshipId);
	        return ResponseEntity.ok(questions);
	    }

	    
	    @GetMapping("/courses")
	    public List<Course> getCourses() {
	        return courseService.getAllCourses();
	    }
	    
	    @PostMapping("/apply/course/{courseId}")
	    public ResponseEntity<String> enrollInFreeCourse(@PathVariable Long courseId, Principal principal) {
	        String username = principal.getName();
	        String response = courseEnrollmentService.enrollInFreeCourse(courseId, username);
	        return ResponseEntity.ok(response);
	    }
	    
	    @PostMapping("/apply/course/paid/{courseId}")
	    public ResponseEntity<String> enrollInPaidCourse(@PathVariable Long courseId, Principal principal) {
	        String username = principal.getName();
	        String response = courseEnrollmentService.enrollInPaidCourse(courseId, username);
	        return ResponseEntity.ok(response);
	    }
	    @PostMapping("/update-payment")
	    public String updatePaymentStatus(@RequestParam String orderId,
	                                      @RequestParam String paymentId,
	                                      @RequestParam String signature,
	                                      @RequestParam String status,
	                                      Principal principal) {

	        String username = principal.getName();

	        boolean updated = courseEnrollmentService.updatePaymentStatus(orderId, paymentId, signature, username, status);

	        return updated ? "Payment status updated." : "Enrollment not found.";
	    }

	    @PostMapping("/verify-payment")
	    public String verifyPayment(
	            @RequestParam String orderId,
	            @RequestParam String paymentId,
	            @RequestParam String signature,
	            Principal principal) {

	        String username = principal.getName();

	        boolean valid = razorpayService.verifyPaymentSignature(orderId, paymentId, signature);

	        if (!valid) {
	            return "Invalid payment signature.";
	        }

	        boolean enrolled = courseEnrollmentService.confirmEnrollmentAfterPayment(orderId, paymentId, signature, username);

	        if (!enrolled) {
	            return "Enrollment not found or already confirmed.";
	        }

	        return "Payment verified and enrollment confirmed.";
	    }

	    
	    @GetMapping("/my-courses")
	    public ResponseEntity<List<Course>> getMyCourses(Principal principal) {
	        String username = principal.getName(); // This gets the logged-in user's username
	        List<Course> courses = courseEnrollmentService.getEnrolledCoursesForStudent(username);
	        return ResponseEntity.ok(courses);
	    }
	    
	    @GetMapping("/applied-jobs")
	    public ResponseEntity<List<Application>> getAppliedJobs(Principal principal) {
	        String username = principal.getName();
	        List<Application> applications = applicationService.getAppliedJobs(username);
	        return ResponseEntity.ok(applications);
	    }

	    @GetMapping("/applied-internships")
	    public ResponseEntity<List<Application>> getAppliedInternships(Principal principal) {
	        String username = principal.getName();
	        List<Application> applications = applicationService.getAppliedInternships(username);
	        return ResponseEntity.ok(applications);
	    }
	    
	    @GetMapping("/application/all")
	    public List<Application> getAllApplicationsByStudent(Principal principal) {
	        return applicationService.findByStudent(principal.getName());
	    }
	    
	    //course review service
	    @PostMapping("/course/{id}")
	    public ResponseEntity<CourseReview> submitReview(@PathVariable Long id,
	                                                     Principal principal,
	                                                     @RequestParam int rating,
	                                                     @RequestParam String comment) {
	    		        String username = principal.getName();
	        CourseReview review = courseReviewService.submitReview(id, username, rating, comment);
	        return ResponseEntity.ok(review);
	    }
	    
	    

	    @PostMapping("/courseProgress/update/{videoId}")
	    public CourseProgress updateProgressAfterVideoWatch(
	            Principal principal,
	            @PathVariable Long videoId) {

	        String username = principal.getName();
	        User student = userDao.findByUserName(username)
	                .orElseThrow(() -> new RuntimeException("User not found"));

	        // Fetch video
	        VideoContent video = videoContentDao.findById(videoId)
	                .orElseThrow(() -> new RuntimeException("Video not found"));

	        // Get syllabus → course
	        Syllabus syllabus = video.getSyllabus();
	        Course course = syllabus.getCourse();

	        // Get or create course progress
	        CourseProgress progress = courseProgressService.getByStudentAndCourse(student, course);
	        if (progress == null) {
	            progress = new CourseProgress();
	            progress.setStudent(student);
	            progress.setCourse(course);
	        }

	        // Mark video as watched
	        courseProgressService.markVideoAsWatched(student, course, video);

	        // Get all videos in course
	        List<VideoContent> allVideos = videoContentDao.findAllByCourse(course);
	        Set<Long> watchedVideoIds = courseProgressService.getWatchedVideoIds(student, course);

	        int watchedCount = watchedVideoIds.size();
	        int totalVideos = allVideos.size();
	        int progressPercent = (int) ((watchedCount * 100.0) / totalVideos);
	        boolean completed = watchedCount == totalVideos;

	        // Update progress
	        progress.setVideo(video); // Last watched
	        progress.setWatchedVideosCount(watchedCount);
	        progress.setProgressPercentage(progressPercent);
	        progress.setCompleted(completed);
	        progress.setLastWatched(LocalDateTime.now());

	        return courseProgressService.save(progress);
	    }

	    
	    @GetMapping("/course/{courseId}")
	    public List<CourseProgress> getByCourseId(@PathVariable Long courseId) {
	        return courseProgressService.getByCourseId(courseId);
	    }

	    @GetMapping("/video/{videoId}")
	    public List<CourseProgress> getByVideoId(@PathVariable Long videoId) {
	        return courseProgressService.getByVideoId(videoId);
	    }
	    
	    @GetMapping("/courseEnroll/{id}")
	    public ResponseEntity<CourseEnrollment> getEnrollmentForCurrentUser(
	            @PathVariable Long id,
	            Principal principal) {
	        
	        String username = principal.getName();
	        CourseEnrollment enrollment = enrollmentService.getEnrollmentForUserAndCourse(username, id);
	        return ResponseEntity.ok(enrollment);
	    }
	    
	    //calendar events
	    @GetMapping("/s/calendar/events")
	    public List<CalendarEvent> getAllEvents(Principal principal) {
	        return eventService.getAllEvents(principal);
	    }
	    
	    @PostMapping("/s/calendar/event")
	    public ResponseEntity<Map<String, Object>> createEvent(@RequestBody CalendarEvent event,Principal principal) {
	        try {
	            CalendarEvent createdEvent = eventService.createEvent(event,principal);
	            Map<String, Object> response = new HashMap<>();
	            response.put("message", "Event created successfully.");
	            response.put("event", createdEvent);
	            return ResponseEntity.status(201).body(response);
	        } catch (RuntimeException e) {
	            Map<String, Object> error = new HashMap<>();
	            error.put("message", "Failed to create event.");
	            return ResponseEntity.badRequest().body(error);
	        }
	    }
	    
	    @GetMapping("/s/calendar/event/{id}")
	    public ResponseEntity<CalendarEvent> getEventById(@PathVariable Long id) {
	        CalendarEvent event = eventService.getEventById(id);
	        if (event != null) {
	            return ResponseEntity.ok(event);
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    }
	    @PutMapping("/s/calendar/event/{id}")
	    public ResponseEntity<Map<String, Object>> updateEvent(@PathVariable Long id, @RequestBody CalendarEvent updatedEvent,Principal principal) {
	        try {
	            CalendarEvent event = eventService.updateEvent(id, updatedEvent,principal);
	            Map<String, Object> response = new HashMap<>();
	            response.put("message", "Event updated successfully.");
	            response.put("event", event);
	            return ResponseEntity.ok(response);
	        } catch (RuntimeException e) {
	            Map<String, Object> error = new HashMap<>();
	            error.put("message", "Event not found or update failed.");
	            return ResponseEntity.status(404).body(error);
	        }
	    }
	    
	    @DeleteMapping("/s/calendar/event/{id}")
	    public ResponseEntity<Void> deleteEvent(@PathVariable Long id,Principal principal) {
	        eventService.deleteEvent(id,principal);
	        return ResponseEntity.noContent().build();
	    }
	    
	    @GetMapping("/s/calendar/upcoming")
	    public List<CalendarEvent> getUpcomingEvents(Principal principal) {
	        return eventService.getUpcomingEvents(principal);
	    }
	    
	    //dashboard counts
	    @GetMapping("/counts")
	    public Map<String, Long> getDashboardCounts(Principal principal) {
	        String username = principal.getName();
	        User student = userDao.findByUserName(username)
	                .orElseThrow(() -> new RuntimeException("User not found"));

	        Long appliedJobs = applicationDao.countByStudentAndJobIsNotNull(student);
	        Long appliedInternships = applicationDao.countByStudentAndInternshipIsNotNull(student);
	        Long enrolledPaidCourses = courseEnrollmentRepository.countByStudentAndCourse_PriceGreaterThan(student, 0.0);
	        Long enrolledFreeCourses = courseEnrollmentRepository.countByStudentAndCourse_PriceEquals(student, 0.0);

	        Map<String, Long> result = new HashMap<>();
	        result.put("appliedJobs", appliedJobs);
	        result.put("appliedInternships", appliedInternships);
	        result.put("paidCourses", enrolledPaidCourses);
	        result.put("freeCourses", enrolledFreeCourses);
	        return result;
	    }
	    




}
