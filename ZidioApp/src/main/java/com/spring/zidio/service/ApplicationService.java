package com.spring.zidio.service;

import java.io.IOException;
import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.spring.zidio.Application;
import com.spring.zidio.ApplicationQuestion;
import com.spring.zidio.ApplicationQuestionAnswer;
import com.spring.zidio.ApplicationStage;
import com.spring.zidio.Internship;
import com.spring.zidio.Job;
import com.spring.zidio.User;
import com.spring.zidio.dao.ApplicationDao;
import com.spring.zidio.dao.ApplicationQuestionAnswerDao;
import com.spring.zidio.dao.ApplicationQuestionDao;
import com.spring.zidio.dao.InternshipDao;
import com.spring.zidio.dao.JobDao;
import com.spring.zidio.dao.StudentProfileDao;
import com.spring.zidio.dao.UserDao;

@Service
public class ApplicationService {
	
	
	@Autowired
	private ApplicationDao applicationDao;
	
	@Autowired
	private ApplicationQuestionDao applicationQuestionDao;
	
	@Autowired
	private ApplicationQuestionAnswerDao applicationQuestionAnswerDao;
	
	@Autowired
	private JobDao jobDao;
	
	@Autowired
	private InternshipDao internshipDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private StudentProfileDao studentProfileDao;
	
	@Autowired
	private CloudinaryService cloudinaryService;
	
	//Apply for job
	 public Application applyforJob(Long id,Application application, MultipartFile resume, Principal principal) throws IOException {
	        // Validate Job or Internship presence
		 Job job = jobDao.findById(id)
		            .orElseThrow(() -> new RuntimeException("Job not found"));
		    application.setJob(job);

		     //Validate application deadline
//		    if (job.getApplicationDeadline() != null && LocalDateTime.now().isAfter(job.getApplicationDeadline())) {
//		        throw new RuntimeException("The application deadline for this job has passed.");
//		    }


	        // Validate student
	        User student = principal.getName() != null ? userDao.findByUserName(principal.getName())
	                .orElseThrow(() -> new RuntimeException("Student not found")) : null;
	        application.setStudent(student);
	        
	        studentProfileDao.findByUsername(student.getUserName())
	        .ifPresent(application::setStudentProfilePicture);
//	        StudentProfile profile = studentProfileDao.findByUsername(student).orElse(null);
	        

	        // Check for duplicate applications
	        if (applicationDao.existsByJobAndStudent(job, student)) {
	            throw new RuntimeException("You have already applied for this job");
	        }

	        // Save resume
	        if (resume != null && !resume.isEmpty()) {
	            String resumeUrl = cloudinaryService.uploadresume(resume, "resumes");
	            application.setResumeUrl(resumeUrl);
	        } else {
	            throw new RuntimeException("Resume file is required");
	        }

	        application.setAppliedDate(LocalDate.now());
	        application.setStatus(ApplicationStage.APPLICATIONS_RECEIVED);
//	        application.setStudentProfilePicture(profile);
	        
	        if (application.getEducationHistory() != null) {
	            application.getEducationHistory().forEach(edu -> edu.setApplication(application));
	        }

	        if (application.getWorkExperiences() != null) {
	            application.getWorkExperiences().forEach(exp -> exp.setApplication(application));
	        }

	        if (application.getCertifications() != null) {
	            application.getCertifications().forEach(cert -> cert.setApplication(application));
	        }
	        


	        List<ApplicationQuestion> templateQuestions = applicationQuestionDao.findByJobId(job.getId());
	        List<ApplicationQuestionAnswer> answers = new ArrayList<>();

	        for (ApplicationQuestion template : templateQuestions) {
	            application.getApplicationQuestionAnswers().stream()
	                    .filter(input -> input.getApplicationQuestion().getId().equals(template.getId()))
	                    .findFirst()
	                    .ifPresent(input -> {
	                        ApplicationQuestion fullQuestion = applicationQuestionDao.findById(template.getId())
	                                .orElseThrow(() -> new RuntimeException("Question not found with ID: " + template.getId()));

	                        ApplicationQuestionAnswer answer = new ApplicationQuestionAnswer();
	                        answer.setApplication(application);
	                        answer.setApplicationQuestion(fullQuestion);
	                        answer.setAnswer(input.getAnswer());
	                        answers.add(answer);
	                    });
	        }

	        job.setApplicationCount(job.getApplicationCount() + 1);
	        jobDao.save(job);

	        Application savedApp = applicationDao.save(application);
	        answers.forEach(a -> a.setApplication(savedApp));
	        applicationQuestionAnswerDao.saveAll(answers);
	        
	        savedApp.setApplicationQuestionAnswers(answers);
	        return savedApp;
	    }
	 
	    // Apply for internship
	 public Application applyForInternship(Long id,Application application, MultipartFile resume, Principal principal) throws IOException {
		    // Validate Internship presence
		   Internship internship = internshipDao.findById(id)
		            .orElseThrow(() -> new RuntimeException("Internship not found"));
		    application.setInternship(internship);
		    
//		    if (internship.getApplicationDeadline() != null && LocalDateTime.now().isAfter(internship.getApplicationDeadline())) {
//		        throw new RuntimeException("The application deadline for this job has passed.");
//		    }
		    // Validate student
		    User student = principal.getName() != null ? userDao.findByUserName(principal.getName())
		            .orElseThrow(() -> new RuntimeException("Student not found")) : null;
		    application.setStudent(student);
		    
		    studentProfileDao.findByUsername(student.getUserName())
	        .ifPresent(application::setStudentProfilePicture);
//	        StudentProfile profile = studentProfileDao.findByUsername(student).orElse(null);
		    // Check for duplicate internship application
		    if (internship!=null&&applicationDao.existsByInternshipAndStudent(internship, student)) {
		        throw new RuntimeException("You have already applied for this internship");
		    }

		    // Save resume
		    if (resume != null && !resume.isEmpty()) {
		       String resumeUrl = cloudinaryService.uploadresume(resume, "resumes");
		        application.setResumeUrl(resumeUrl);
		    } else {
		        throw new RuntimeException("Resume file is required");
		    }

		    application.setAppliedDate(LocalDate.now());
		    application.setStatus(ApplicationStage.APPLICATIONS_RECEIVED);
		   
		    if (application.getEducationHistory() != null) {
	            application.getEducationHistory().forEach(edu -> edu.setApplication(application));
	        }

	        if (application.getWorkExperiences() != null) {
	            application.getWorkExperiences().forEach(exp -> exp.setApplication(application));
	        }

	        if (application.getCertifications() != null) {
	            application.getCertifications().forEach(cert -> cert.setApplication(application));
	        }

	        List<ApplicationQuestion> templateQuestions = applicationQuestionDao.findByInternshipId(internship.getId());
	        List<ApplicationQuestionAnswer> answers = new ArrayList<>();

	        for (ApplicationQuestion template : templateQuestions) {
	            application.getApplicationQuestionAnswers().stream()
	                    .filter(input -> input.getApplicationQuestion().getId().equals(template.getId()))
	                    .findFirst()
	                    .ifPresent(input -> {
	                        ApplicationQuestionAnswer answer = new ApplicationQuestionAnswer();
	                        answer.setApplication(application);
	                        answer.setApplicationQuestion(template);
	                        answer.setAnswer(input.getAnswer());
	                        answers.add(answer);
	                    });
	        }

	        internship.setApplicationCount(internship.getApplicationCount() + 1);
	        internshipDao.save(internship);

	        Application savedApp = applicationDao.save(application);
	        answers.forEach(a -> a.setApplication(savedApp));
	        applicationQuestionAnswerDao.saveAll(answers);
	        savedApp.setApplicationQuestionAnswers(answers);
	        return savedApp;
		}



	    // Find applications by job
	 public List<Application> findByJob(Job job) {
		    return applicationDao.findByJob(job)
		    .orElse(List.of());
		}
	 
	 public List<Application> getByJobId(Long jobId) {
		    Job job = jobDao.findById(jobId)
		            .orElseThrow(() -> new RuntimeException("Job not found"));

		    return applicationDao.findByJob(job)
		    		.orElse(List.of());
		           
		}

	    // Find applications by internship
	   public List<Application> findByInternship(Internship internship) {
	        return applicationDao.findByInternship(internship)
	        		.orElse(List.of());
	    }
	   
	    public List<Application> getByInternshipId(Long internshipId) {
	        Internship internship = internshipDao.findById(internshipId)
	                .orElseThrow(() -> new RuntimeException("Internship not found"));

	        return applicationDao.findByInternship(internship)
	        		.orElse(List.of());
	    }

	    // Find applications by student
	    public List<Application> findByStudent(String username) {
	    	User student = userDao.findByUserName(username)
	                .orElseThrow(() -> new RuntimeException("Student not found"));
	        return applicationDao.findAll().stream()
	                .filter(app -> app.getStudent().equals(student))
	                .toList();
	    }

	    // Update status
	    public Application updateStatus(Long id, ApplicationStage status) {
	        Application app = applicationDao.findById(id)
	                .orElseThrow(() -> new RuntimeException("Application not found"));
	        app.setStatus(status);
	        return applicationDao.save(app);
	    }
	    
	    //Delete Application
	    public void deleteApplication(Long id) {
	    	Application application = applicationDao.findById(id)
	    	        .orElseThrow(() -> new RuntimeException("Application not found"));

	    	    // Step 2: Check if it's for a job and adjust the count
	    	    if (application.getJob() != null) {
	    	        Job job = application.getJob();
	    	        if (job.getApplicationCount() > 0) {
	    	            job.setApplicationCount(job.getApplicationCount() - 1);
	    	            jobDao.save(job);
	    	        }
	    	    }
	    	    // Step 2: Check if it's for a internship and adjust the count
	    	    if (application.getInternship() != null) {
	    	        Internship internship = application.getInternship();
	    	        if (internship.getApplicationCount() > 0) {
	    	            internship.setApplicationCount(internship.getApplicationCount() - 1);
	    	            internshipDao.save(internship);
	    	        }
	    	    }
	        applicationDao.deleteById(id);
	    }
	   
	   // Get all applications 
	    public List<Application> getAllApplications() {
	        return applicationDao.findAll();
	    }
	    
	    public String getResumeDownloadUrl(Long applicationId) {
	        Application application = applicationDao.findById(applicationId)
	                .orElseThrow(() -> new RuntimeException("Application not found"));

	        if (application.getResumeUrl() == null || application.getResumeUrl().isEmpty()) {
	            throw new RuntimeException("No resume found for this application");
	        }

	        return application.getResumeUrl(); // This is the Cloudinary URL
	    }
	    
	 // ✅ NEW: Get count by stage (for dashboard)
	    public Long countByStage(ApplicationStage stage) {
	        return applicationDao.countByStatus(stage);
	    }

	    // ✅ NEW: Get all applications in a specific stage
	    public List<Application> getApplicationsByStage(ApplicationStage stage) {
	        return applicationDao.findByStatus(stage);
	    }
	    
	 // ✅ Returns all job applications by student (with status info)
	    public List<Application> getAppliedJobs(String username) {
	        return findByStudent(username).stream()
	                .filter(app -> app.getJob() != null)
	                .toList();
	    }

	    // ✅ Returns all internship applications by student (with status info)
	    public List<Application> getAppliedInternships(String username) {
	        return findByStudent(username).stream()
	                .filter(app -> app.getInternship() != null)
	                .toList();
	    }

	    
	    public void deleteApplicationQuestion(Long questionId) {
	        ApplicationQuestion question = applicationQuestionDao.findById(questionId)
	                .orElseThrow(() -> new RuntimeException("Application question not found"));
	        applicationQuestionDao.deleteById(questionId);
	    }
	    
	    public List<ApplicationQuestion> getApplicationQuestionsByJobId(Long jobId) {
	        Job job = jobDao.findById(jobId)
	                .orElseThrow(() -> new RuntimeException("Job not found"));

	        return applicationQuestionDao.findByJobId(jobId);
	    }
	    public List<ApplicationQuestion> getApplicationQuestionsByInternshipId(Long internshipId) {
	        Internship internship = internshipDao.findById(internshipId)
	                .orElseThrow(() -> new RuntimeException("Internship not found"));

	        return applicationQuestionDao.findByInternshipId(internshipId);
	    }
	    
	    public Application getApplicationById(Long id) {
	        return applicationDao.findById(id)
	                .orElseThrow(() -> new RuntimeException("Application not found with ID: " + id));
	    }






	    
}
