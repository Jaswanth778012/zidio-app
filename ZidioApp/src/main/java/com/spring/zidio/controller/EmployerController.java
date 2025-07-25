package com.spring.zidio.controller;



import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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
import com.spring.zidio.ApplicationStage;
import com.spring.zidio.CalendarEvent;
//import com.spring.zidio.Application;
import com.spring.zidio.EmployerProfile;
import com.spring.zidio.Internship;
import com.spring.zidio.Interview;
import com.spring.zidio.Job;
import com.spring.zidio.Message;
import com.spring.zidio.User;
import com.spring.zidio.dao.ApplicationDao;
import com.spring.zidio.dao.ApplicationQuestionDao;
import com.spring.zidio.dao.InternshipDao;
import com.spring.zidio.dao.JobDao;
import com.spring.zidio.dao.UserDao;
import com.spring.zidio.payload.SendMessageRequest;
import com.spring.zidio.service.ApplicationService;
import com.spring.zidio.service.CalendarEventService;
import com.spring.zidio.service.CloudinaryService;
import com.spring.zidio.service.EmployerProfileService;
import com.spring.zidio.service.InternshipService;
import com.spring.zidio.service.InterviewService;
import com.spring.zidio.service.JobService;
import com.spring.zidio.service.MessageService;
import com.spring.zidio.service.UserService;

@RestController
@RequestMapping("/employer")
@CrossOrigin
public class EmployerController {
	
		@Autowired
	    private JobService jobService;

	    @Autowired
	    private InternshipService internshipService;
	    
	    @Autowired
	    private UserService userService;
	    
	    @Autowired
	    private UserDao userDao;
	    
	    @Autowired
	    private JobDao jobDao;
	    
	    @Autowired
	    private InternshipDao internshipDao;
	    @Autowired
	    private EmployerProfileService employerProfileService;
	    
	    @Autowired
	    private MessageService messageService;
	    
	    @Autowired
	    private ApplicationService applicationService;
	    
	    @Autowired
	    private ApplicationQuestionDao applicationQuestionDao;
	    @Autowired
	    private ApplicationDao applicationDao;
	    
	    @Autowired
	    private InterviewService interviewService;
	    
	    @Autowired
	    private CloudinaryService cloudinaryService;
	    
	    @Autowired
	    private CalendarEventService eventService;
	    
	    
	    @PostMapping("/jobs")
	    public ResponseEntity<Job> createJob(@RequestPart("job") Job job,@RequestPart("file")  MultipartFile file,  Principal principal) {
	    	try {
	    		String imageUrl = cloudinaryService.uploadLogo(file,"CompanyLogos");
	    		job.setCompanyLogo(imageUrl);
	        User employer = userService.findByUsername(principal.getName());
	        Job createdJob = jobService.createJob(job, employer);
	        return ResponseEntity.ok(createdJob);
	    }catch (Exception e) {
	            return ResponseEntity.status(500).body(null); 
	        }
	    }



	    @GetMapping("/jobs")
	    public ResponseEntity<List<Job>> getAllJobs() {
	        return ResponseEntity.ok(jobService.getAllJobs());
	    }

	    @PutMapping("/jobs/{id}")
	    public ResponseEntity<Job> updateJob(@PathVariable Long id, @RequestPart("job") Job updatedJob, @RequestPart(value = "file", required = false) MultipartFile file) {
	    	 try {
	    	if (file != null && !file.isEmpty()) {
	    		String imageUrl = cloudinaryService.uploadLogo(file,"CompanyLogos");
	    		updatedJob.setCompanyLogo(imageUrl);
	        }

	    	Job job = jobService.updateJobDetails(id, updatedJob);
	        return ResponseEntity.ok(job);
	    }catch (Exception e) {
	        return ResponseEntity.status(500).body(null); // Handle error appropriately
	    }
	    }
	    
//	    @PatchMapping("/jobs/{id}/status")
//	    public ResponseEntity<Job> updateJobStatus(@PathVariable Long id, @RequestParam String status) {
//	        Job job = jobService.updateJobStatus(id, status);
//	        return ResponseEntity.ok(job);
//	    }

	    @DeleteMapping("/jobs/{id}")
	    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
	        jobService.deleteJob(id);
	        Map<String, String> response = new HashMap<>();
	        response.put("message", "Job deleted successfully");

	        return ResponseEntity.ok(response);
	    }
	    
	    @PatchMapping("/jobs/{id}/flag")
	    public ResponseEntity<Job> updateJobFlagStatus(@PathVariable Long id, @RequestParam boolean flagged) {
	        Job job = jobService.updateJobFlaggedStatus(id, flagged);
	        String message = flagged ? "Job flagged successfully" : "Job unflagged successfully";
	        return ResponseEntity.ok(job);
	    }
	    
	    @GetMapping("/jobs/paged")
	    public Page<Job> searchJobs(
	    	    @RequestParam(defaultValue = "0") int page,
	    	    @RequestParam(defaultValue = "5") int size,
	    	    @RequestParam(required = false) String search
	    	) {
	    	    return jobService.getFilteredJobs(page, size, search);
	    	}
	    



//	    // ----- INTERNSHIP CRUD -----
	    @PostMapping("/internships")
	    public ResponseEntity<Internship> createInternship(@RequestPart("internship") Internship internship,@RequestPart("file")  MultipartFile file, Principal principal) {
	    	try {
	    		String imageUrl = cloudinaryService.uploadInternshipLogo(file,"InternshipLogos");
	    		internship.setCompanyLogo(imageUrl);
	    	User employer = userService.findByUsername(principal.getName());
	        Internship createdIntern = internshipService.createInternship(internship, employer);
	        return ResponseEntity.ok(createdIntern);
	    }catch (Exception e) {
	            return ResponseEntity.status(500).body(null); // Handle error appropriately
	        }
	    }

	    @GetMapping("/internships")
	    public ResponseEntity<List<Internship>> getAllInternships() {
	        return ResponseEntity.ok(internshipService.getAllInternships());
	    }

	    @PutMapping("/internships/{id}")
	    public ResponseEntity<Internship> updateInternship(@PathVariable Long id, @RequestPart("internship") Internship updatedInternship, @RequestPart(value = "file", required = false) MultipartFile file) {
	    	try {
		    	if (file != null && !file.isEmpty()) {
		    		String imageUrl = cloudinaryService.uploadInternshipLogo(file,"InternshipLogos");
		    		updatedInternship.setCompanyLogo(imageUrl);
		        }
	    	Internship internship = internshipService.updateInternshipDetails(id, updatedInternship);
	        return ResponseEntity.ok(internship);
	    }catch (Exception e) {
	        return ResponseEntity.status(500).body(null); // Handle error appropriately
	    }
	    }
	    
	    @PatchMapping("/internships/{id}/flag")
	    public ResponseEntity<Internship> updateInternshipFlagStatus(@PathVariable Long id, @RequestParam boolean flagged) {
	        Internship internship = internshipService.updateInternshipFlaggedStatus(id, flagged);
	        return ResponseEntity.ok(internship);
	    }
	    
	    @PatchMapping("/internships/{id}/status")
	    public ResponseEntity<Internship> updateInternshipStatus(@PathVariable Long id, @RequestParam String status) {
	        Internship internship = internshipService.updateInternshipStatus(id, status);
	        return ResponseEntity.ok(internship);
	    }
	    
	    @DeleteMapping("/internships/{id}")
	    public ResponseEntity<Map<String, String>> deleteInternship(@PathVariable Long id) {
	        internshipService.deleteInternship(id);
	        Map<String, String> response = new HashMap<>();
	        response.put("message", "Internship deleted successfully");
	        return ResponseEntity.ok(response);
	    }
	    
	    @GetMapping("/internships/paged")
	    public Page<Internship> searchInternships(
	    	    @RequestParam(defaultValue = "0") int page,
	    	    @RequestParam(defaultValue = "5") int size,
	    	    @RequestParam(required = false) String search
	    	) {
	    	    return internshipService.getFilteredInternships(page, size, search);
	    	}
	    
	    //Indashboard Message service
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
	    
	    //profile
	    @GetMapping("/profile")
	    public ResponseEntity<EmployerProfile> getProfile(){
	    	String username = SecurityContextHolder.getContext().getAuthentication().getName();
	    	return employerProfileService.getProfileByUsername(username)
	                .map(ResponseEntity::ok)
	                .orElse(ResponseEntity.notFound().build());
	    }
	    
	    @PostMapping("/profile")
	    public ResponseEntity<EmployerProfile> updateProfile(
	    		@RequestParam String userFirstName,
	    		@RequestParam String userLastName,
	    		@RequestParam String email,
	    		@RequestParam(required = false) String phone,
	    		@RequestParam String companyName,
	    		@RequestParam (required = false)String companyWebsiteUrl,
	    		@RequestParam String position,
	    		@RequestParam String industry,
	    		@RequestParam String companyType,
	    		@RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture
	    		
	    		){
	    	String username = SecurityContextHolder.getContext().getAuthentication().getName();
	    	try {
	    		Optional<User> userOpt = userDao.findById(username);
	    		if (userOpt.isPresent()) {
	                User user = userOpt.get();
	                user.setUserFirstName(userFirstName);
	                user.setUserLastName(userLastName);
	                userDao.save(user);
	    		}
	    		EmployerProfile profile = employerProfileService.getProfileByUsername(username)
	    				.orElse(new EmployerProfile());
	    		profile.setUsername(username);
	    		profile.setUserFirstName(userFirstName);
	    		profile.setUserLastName(userLastName);
	    		profile.setEmail(email);
	    		profile.setPhone(phone);
	    		profile.setCompanyName(companyName);
	    		profile.setCompanyWebsiteUrl(companyWebsiteUrl);
	    		profile.setPosition(position);
	    		profile.setIndustry(industry);
	    		profile.setCompanyType(companyType);
	    		if(profilePicture !=null && !profilePicture.isEmpty())
	    		{
	    			String profilePictureUrl = cloudinaryService.uploadprofile(profilePicture,"Employer_ProfilePictures");
	    			profile.setProfilePictureUrl(profilePictureUrl);
	    		}
	    		EmployerProfile updatedProfile = employerProfileService.saveOrUpdateProfile(profile);
	    		return ResponseEntity.ok(updatedProfile);
	    	}catch(Exception e) {
	    		return ResponseEntity.status(500).build(); // Handle error appropriately
	    	}
	    	
	    }
	    

	    //Application features
	    
	    @GetMapping("/job/{jobId}")
	    public ResponseEntity<List<Application>> getByJob(@PathVariable Long jobId) {
	        List<Application> apps = applicationService.getByJobId(jobId);
	        if (apps.isEmpty()) return ResponseEntity.noContent().build();
	        return ResponseEntity.ok(apps);
	    }

	    // Find by internshipId
	    @GetMapping("/internship/{internshipId}")
	    public ResponseEntity<List<Application>> getByInternship(@PathVariable Long internshipId) {
	        List<Application> apps = applicationService.getByInternshipId(internshipId);
	        if (apps.isEmpty()) return ResponseEntity.noContent().build();
	        return ResponseEntity.ok(apps);
	    }

	    // Find by student username
	    @GetMapping("/student/{username}")
	    public ResponseEntity<List<Application>> getByStudent(@PathVariable String username) {
	        List<Application> apps = applicationService.findByStudent(username);
	        if (apps.isEmpty()) return ResponseEntity.noContent().build();
	        return ResponseEntity.ok(apps);
	    }

	    // Update status
	    @PutMapping("/{id}/status")
	    public ResponseEntity<?> updateStatus(@PathVariable Long id,
	                                          @RequestParam ApplicationStage status) {
	        try {
	            Application updatedApp = applicationService.updateStatus(id, status);
	            return ResponseEntity.ok(updatedApp);
	        } catch (RuntimeException e) {
	            return ResponseEntity.badRequest().body(e.getMessage());
	        }
	    }
	    
	    //Delete Application
	    @DeleteMapping("/{id}")
	    public void deleteApplication(@PathVariable Long id) {
	        applicationService.deleteApplication(id);
	    }
	    
	    //Get All Applications
	    @PreAuthorize("hasRole('Employer')")
	    @GetMapping("/All")
	    public List<Application> getAllApplications() {
	        try {
	            return applicationService.getAllApplications();
	        } catch (Exception e) {
	            e.printStackTrace();
	            throw e;  // or return emptyList()
	        }
	    }

	    
	    @GetMapping("/recent")
	    public List<Application> getRecentApplications(){
	    	return applicationDao.findTop3ByOrderByAppliedDateDesc();
	    }
	    
	    @GetMapping("/count")
	    public ResponseEntity<Long> countByStage(@RequestParam("stage") ApplicationStage stage) {
	        return ResponseEntity.ok(applicationService.countByStage(stage));
	    }

	    // ✅ Get applications by stage
	    @GetMapping("/phase")
	    public ResponseEntity<List<Application>> getApplicationsByStage(@RequestParam("stage") ApplicationStage stage) {
	        return ResponseEntity.ok(applicationService.getApplicationsByStage(stage));
	    }
	    
	    //Download Resume
	    @GetMapping("/resume/{id}")
	    public ResponseEntity<?> downloadResume(@PathVariable Long id) {
	        try {
	            String resumeUrl = applicationService.getResumeDownloadUrl(id);
	            HttpHeaders headers = new HttpHeaders();
	            headers.add("Location", resumeUrl);
	            return new ResponseEntity<>(headers, HttpStatus.FOUND); // 302 Redirect
	        } catch (RuntimeException e) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
	        }
	    }

	    
	    //interviews
	    @PostMapping("/interviews")
	    public ResponseEntity<Interview> createInterview(@RequestBody Interview interview, Principal principal) {

	        // Handle Job if present
	        Job job = null;
	        if (interview.getJob() != null && interview.getJob().getId() != null) {
	            job = jobDao.findById(interview.getJob().getId())
	                    .orElseThrow(() -> new RuntimeException("Job not found"));
	            interview.setJob(job);
	        }

	        // Handle Internship if present
	        Internship internship = null;
	        if (interview.getInternship() != null && interview.getInternship().getId() != null) {
	            internship = internshipDao.findById(interview.getInternship().getId())
	                    .orElseThrow(() -> new RuntimeException("Internship not found"));
	            interview.setInternship(internship);
	        }

	        // Student
	        User student = userDao.findByUserName(interview.getStudent().getUserName())
	                .orElseThrow(() -> new RuntimeException("Student not found"));

	        // Employer (from token)
	        User employer = userService.findByUsername(principal.getName());

	        interview.setEmployer(employer);
	        interview.setStudent(student);
	        interview.setStatus(Interview.Status.SCHEDULED); // Set default status

	        Interview createdInterview = interviewService.ScheduleInterview(interview,principal);
	        return ResponseEntity.ok(createdInterview);
	    }

	    
	    @GetMapping("/interviews")
	    public ResponseEntity<List<Interview>> getAllInterviews() {
	        return ResponseEntity.ok(interviewService.getAllInterviews());
	    }
	    
	    @GetMapping("/interviews/employer")
	    public ResponseEntity<List<Interview>> getInterviewsByEmployer(Principal principal) {
	        String userName = principal.getName();
	        List<Interview> interviews = interviewService.getInterviewsByEmployer(userName);
	        return ResponseEntity.ok(interviews);
	    }
	    
	    @GetMapping("/interviews/{id}")
	    public ResponseEntity<Interview> getInterviewById(@PathVariable Long id) {
	        Optional<Interview> interview = interviewService.getInterviewById(id);
	        return interview.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	    }
	    
	    @PutMapping("/interviews/{id}")
	    public ResponseEntity<Interview> updateInterview(@PathVariable Long id, @RequestBody Interview interview,Principal principal) {
	    	User employer = userService.findByUsername(principal.getName());
	    	interview.setEmployer(employer);
	    	interview.setStatus(Interview.Status.RESCHEDULED); // Reset status to scheduled on update
	        Interview updatedInterview = interviewService.updateInterview(id, interview);
	        return ResponseEntity.ok(updatedInterview);
	    	
	    }
	    
	    @DeleteMapping("/interviews/{id}")
	    public ResponseEntity<String> deleteInterview(@PathVariable Long id) {
	        interviewService.deleteInterview(id);
	        return ResponseEntity.ok("Interview with ID " + id + " has been cancelled successfully.");
	    }
	    
	    //Calendar Event
	    @GetMapping("/calendar/events")
	    public List<CalendarEvent> getAllEvents(Principal principal) {
	        return eventService.getAllEvents(principal);
	    }
	    
	    @PostMapping("/calendar/event")
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
	    
	    @GetMapping("/calendar/event/{id}")
	    public ResponseEntity<CalendarEvent> getEventById(@PathVariable Long id) {
	        CalendarEvent event = eventService.getEventById(id);
	        if (event != null) {
	            return ResponseEntity.ok(event);
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    }
	    @PutMapping("/calendar/event/{id}")
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
	    
	    @DeleteMapping("/calendar/event/{id}")
	    public ResponseEntity<Void> deleteEvent(@PathVariable Long id,Principal principal) {
	        eventService.deleteEvent(id,principal);
	        return ResponseEntity.noContent().build();
	    }
	    
	    @GetMapping("/upcoming")
	    public List<CalendarEvent> getUpcomingEvents(Principal principal) {
	        return eventService.getUpcomingEvents(principal);
	    }
	    
	    @PostMapping("/job/{jobId}")
	    public List<ApplicationQuestion> addQuestionsToJob(@PathVariable Long jobId, @RequestBody List<ApplicationQuestion> questions) {
	        Job job = jobDao.findById(jobId)
	            .orElseThrow(() -> new RuntimeException("Job not found"));

	        questions.forEach(q -> {
	            // Validation
	            if (q.getQuestionText() == null || q.getQuestionText().trim().isEmpty()) {
	                throw new RuntimeException("Question text cannot be empty");
	            }
	            if (q.getQuestionType() == null || (!q.getQuestionType().equalsIgnoreCase("TEXT") &&
	                                                !q.getQuestionType().equalsIgnoreCase("MULTIPLE_CHOICE"))) {
	                throw new RuntimeException("Question type must be TEXT or MULTIPLE_CHOICE");
	            }
	            if (q.getQuestionType().equalsIgnoreCase("MULTIPLE_CHOICE") && (q.getOptions() == null || q.getOptions().isEmpty())) {
	                throw new RuntimeException("Options must be provided for multiple-choice questions");
	            }

	            q.setJob(job);
	            q.setInternship(null); // Not an internship question
	        });

	        return applicationQuestionDao.saveAll(questions);
	    }

	    @PostMapping("/internship/{internshipId}")
	    public List<ApplicationQuestion> addQuestionsToInternship(@PathVariable Long internshipId, @RequestBody List<ApplicationQuestion> questions) {
	        Internship internship = internshipDao.findById(internshipId)
	            .orElseThrow(() -> new RuntimeException("Internship not found"));

	        questions.forEach(q -> {
	            // Validation
	            if (q.getQuestionText() == null || q.getQuestionText().trim().isEmpty()) {
	                throw new RuntimeException("Question text cannot be empty");
	            }
	            if (q.getQuestionType() == null || (!q.getQuestionType().equalsIgnoreCase("TEXT") &&
	                                                !q.getQuestionType().equalsIgnoreCase("MULTIPLE_CHOICE"))) {
	                throw new RuntimeException("Question type must be TEXT or MULTIPLE_CHOICE");
	            }
	            if (q.getQuestionType().equalsIgnoreCase("MULTIPLE_CHOICE") && (q.getOptions() == null || q.getOptions().isEmpty())) {
	                throw new RuntimeException("Options must be provided for multiple-choice questions");
	            }

	            q.setInternship(internship);
	            q.setJob(null); // Not a job question
	        });

	        return applicationQuestionDao.saveAll(questions);
	    }

	    
	    
	    @DeleteMapping("/application-questions/{id}")
	    public ResponseEntity<String> deleteQuestion(@PathVariable Long id) {
	        applicationService.deleteApplicationQuestion(id);
	        return ResponseEntity.ok("Question deleted successfully");
	    }


	    
	    
}
