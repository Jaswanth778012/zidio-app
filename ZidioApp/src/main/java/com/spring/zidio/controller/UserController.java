package com.spring.zidio.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.spring.zidio.Contact;
import com.spring.zidio.Course;
import com.spring.zidio.CourseEnrollment;
import com.spring.zidio.CourseReview;
import com.spring.zidio.Internship;
import com.spring.zidio.Job;
import com.spring.zidio.Syllabus;
import com.spring.zidio.TeamMember;
import com.spring.zidio.User;
import com.spring.zidio.VideoContent;
import com.spring.zidio.service.CloudinaryService;
import com.spring.zidio.service.CourseEnrollmentService;
import com.spring.zidio.service.CourseReviewService;
import com.spring.zidio.service.CourseService;
import com.spring.zidio.service.EmailService;
import com.spring.zidio.service.InternshipService;
import com.spring.zidio.service.JobService;
import com.spring.zidio.service.SyllabusService;
import com.spring.zidio.service.TeamMemberService;
import com.spring.zidio.service.UserService;
import com.spring.zidio.service.VideoContentService;

import jakarta.annotation.PostConstruct;

@RestController
public class UserController {
	@Autowired
	public UserService userService;
	
	@Autowired
	public CourseService courseService;
	
	@Autowired
	public CourseReviewService reviewService;
	
	@Autowired
	private JobService jobService;
	
	@Autowired
	private InternshipService internshipService;
	
	@Autowired
	private VideoContentService videoContentService;
	
	@Autowired
	private SyllabusService syllabusService;
	
	@Autowired
	private CourseEnrollmentService enrollmentService;
	
	@Autowired
	private EmailService emailService;
	
	@Autowired
	private CloudinaryService cloudinaryService;
	
	@Autowired
	private TeamMemberService teamService;
	
	  @PostConstruct public void initRolesandUsers() {
	  
	  userService.initRolesandUsers();
	  
	  }
	 
	  @PutMapping({ "/auth/updatePassword" })
	  public HttpEntity<String> updatePassword(@RequestBody Map<String, String> request) {
		  String userName = request.get("userName");
		  String currentPassword = request.get("currentPassword");
		  String newPassword = request.get("newPassword");
		  
		  try
		  {
			  userService.updatePassword(userName,currentPassword, newPassword);
			  return ResponseEntity.ok("Password updated successfully");
		  }catch(RuntimeException e)
		  {
			  return ResponseEntity.badRequest().body("Error updating password: " + e.getMessage());
		  }
	  }

	@PostMapping({ "/auth/registerNewUser" })
	public ResponseEntity<?> registerNewUser(@RequestBody User user,@RequestParam String roleName) {

		 String normalizedRole = roleName.trim();

		    // Allow only "Student" and "Employer"
		    if (!normalizedRole.equals("Student") && !normalizedRole.equals("Employer")) {
		        return ResponseEntity
		                .badRequest()
		                .body("Invalid role. Only 'Student' and 'Employer' registrations are allowed.");
		    }

		    try {
		        User createdUser = userService.registerNewUser(user, normalizedRole);
		        return ResponseEntity.ok(createdUser);
		    } catch (Exception e) {
		        return ResponseEntity
		                .internalServerError()
		                .body("User registration failed: " + e.getMessage());
		    }
	}
	
	 @GetMapping("/auth/courses")
	    public List<Course> getCourses() {
	        return courseService.getAllCourses();
	    }
	 
	 @GetMapping("/auth/{id}")
	    public ResponseEntity<List<CourseReview>> getCourseReviews(@PathVariable Long id) {
	        return ResponseEntity.ok(reviewService.getReviewsForCourse(id));
	    }

	    // Get average rating for a course
	    @GetMapping("/auth/{id}/averageRating")
	    public ResponseEntity<Double> getAverageRating(@PathVariable Long id) {
	        return ResponseEntity.ok(reviewService.getAverageRating(id));
	    }
	    
	    @GetMapping("/auth/courses/{id}")
	    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
	        Course course = courseService.getCourseById(id);
	        return new ResponseEntity<>(course, HttpStatus.OK);
	    }
	    
	    @GetMapping("/auth/jobs")
	    public List<Job> getAllJobs() {
	        return jobService.getAllJobs();
	    }
	    
	    @GetMapping("/auth/internships")
	    public List<Internship> getAllInternships() {
	        return internshipService.getAllInternships();
	    }
	    
	    @GetMapping("/auth/jobs/{id}")
	    public Job getJobById(@PathVariable Long id) {
	        return jobService.getJobById(id);
	    }
	    
	    @GetMapping("/auth/internships/{id}")
	    public Internship getInternshipById(@PathVariable Long id) {
	        return internshipService.getInternshipById(id);
	    }
	    
	    @GetMapping("/auth/video-content/{syllabusId}")
	    public ResponseEntity<List<VideoContent>> getVideosBySyllabusId(@PathVariable Long syllabusId) {
	        List<VideoContent> videos = videoContentService.getBySyllabusId(syllabusId);
	        return new ResponseEntity<>(videos, HttpStatus.OK);
	    }
	    
	    @GetMapping("/auth/course/{courseId}")
	    public ResponseEntity<List<Syllabus>> getSyllabusByCourseId(@PathVariable Long courseId) {
	        List<Syllabus> syllabusList = syllabusService.getByCourseId(courseId);
	        return new ResponseEntity<>(syllabusList, HttpStatus.OK);
	    }
	    
	    @GetMapping("/auth/courseEnroll/{id}")
	    public ResponseEntity<CourseEnrollment> getEnrollmentForCurrentUser(
	            @PathVariable Long id,
	            Principal principal) {
	        
	        String username = principal.getName();
	        CourseEnrollment enrollment = enrollmentService.getEnrollmentForUserAndCourse(username, id);
	        return ResponseEntity.ok(enrollment);
	    }
	    
	    //contact
	    @PostMapping("/auth/contact")
	    public ResponseEntity<Map<String, String>> handleContactForm(@RequestBody Contact message) {
	        String formatted = String.format(
	            "New Contact Message Received\n\nFrom: %s <%s>\nSubject: %s\n\nMessage:\n%s",
	            message.getName(),
	            message.getEmail(),
	            message.getSubject(),
	            message.getMessage()
	        );

	        emailService.sendInterviewEmail(
	            message.getEmail(),                         // from: user-provided email
	            "pothinajaswanth123@gmail.com",             // to: site admin/support
	            "Contact Us: " + message.getSubject(),
	            formatted
	        );

	        Map<String, String> response = new HashMap<>();
	        response.put("message", "Message sent successfully");
	        return ResponseEntity.ok(response);
	    }
	    //TeamMember
	    @PostMapping("/auth/upload")
	    public ResponseEntity<?> uploadTeamMemberWithPhoto(
	            @RequestParam("file") MultipartFile file,
	            @RequestParam("name") String name,
	            @RequestParam("role") String role,
	            @RequestParam("bio") String bio
	    ) {
	        try {
	            String imageUrl = cloudinaryService.uploadteamphoto(file, "team_photos");

	            TeamMember member = new TeamMember();
	            member.setName(name);
	            member.setRole(role);
	            member.setBio(bio);
	            member.setImageUrl(imageUrl);

	            TeamMember saved = teamService.createTeamMember(member);
	            return ResponseEntity.ok(saved);

	        } catch (Exception e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                    .body("Failed to upload image and save member: " + e.getMessage());
	        }
	    }
	    
	    @GetMapping("/auth/teamMembers")
	    public List<TeamMember> getAll() {
	        return teamService.getAllMembers();
	    }

	    
	  
	
	@GetMapping({ "/forAdmin" })
	@PreAuthorize("hasRole('Admin')")
	public String forAdmin() {
		return "This URL is only accessible to Admins";
	}
	
	@GetMapping({ "/forStudent" })
	@PreAuthorize("hasRole('Student')")
	public String forStudent()
	{
		return "This URL is only accessible to Students";
	}
	
	@GetMapping({ "/forEmployer" })
	@PreAuthorize("hasRole('Employer')")
	public String forEmployer() {
	    return "This URL is only accessible to Employers";
	}
	

}
