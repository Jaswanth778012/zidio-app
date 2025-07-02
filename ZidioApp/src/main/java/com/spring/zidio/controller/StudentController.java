package com.spring.zidio.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.util.List;
import java.util.Optional;

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
//import com.spring.zidio.Application;
import com.spring.zidio.Message;
import com.spring.zidio.StudentProfile;
import com.spring.zidio.User;
import com.spring.zidio.dao.UserDao;
//import com.spring.zidio.payload.ApplicationRequest;
import com.spring.zidio.payload.SendMessageRequest;
import com.spring.zidio.service.ApplicationService;
import com.spring.zidio.service.MessageService;
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
	private MessageService messageService;
	
	@Autowired
	private ApplicationService applicationService;
	private static final String UPLOAD_DIR = "uploads/";
	
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
                String fileName = System.currentTimeMillis() + "-" + profilePicture.getOriginalFilename();
                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(profilePicture.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                profile.setProfilePictureUrl("/" + UPLOAD_DIR + fileName);
            }

            StudentProfile savedProfile = studentProfileService.saveOrUpdateProfile(profile);
            return ResponseEntity.ok(savedProfile);
        } catch (IOException e) {
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
//	    @GetMapping("/applications/job/{jobId}")
//	    public ResponseEntity<List<Application>> getApplicationsByJob(@PathVariable Long jobId) {
//	        List<Application> applications = applicationService.getByJob(jobId);
//	        return ResponseEntity.ok(applications);
//	    }
//	    
//	    @GetMapping("/internship/{internshipId}")
//	    public ResponseEntity<List<Application>> getApplicationsByInternship(@PathVariable Long internshipId) {
//	        return ResponseEntity.ok(applicationService.getApplicationsByInternship(internshipId));
//	    }
	    @PostMapping("/apply/job")
	    public ResponseEntity<?> applyforJob(
	            @RequestPart("application") Application application,
	            @RequestPart("resume") MultipartFile resume) {
	        try {
	            Application savedApp = applicationService.applyforJob(application, resume);
	            return ResponseEntity.ok(savedApp);
	        } catch (RuntimeException | IOException e) {
	            return ResponseEntity.badRequest().body(e.getMessage());
	        }
	    }
	    
	    @PostMapping("/apply/internship")
	    public ResponseEntity<?> applyForInternship(
	            @RequestPart("application") Application application,
	            @RequestPart("resume") MultipartFile resume) {
	        try {
	            Application savedApp = applicationService.applyForInternship(application, resume);
	            return ResponseEntity.ok(savedApp);
	        } catch (RuntimeException | IOException e) {
	            return ResponseEntity.badRequest().body(e.getMessage());
	        }
	    }
	    
	    

}
