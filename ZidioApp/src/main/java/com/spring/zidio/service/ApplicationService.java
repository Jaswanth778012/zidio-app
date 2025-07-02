package com.spring.zidio.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.spring.zidio.Application;
import com.spring.zidio.Internship;
import com.spring.zidio.Job;
import com.spring.zidio.StudentProfile;
import com.spring.zidio.User;
import com.spring.zidio.dao.ApplicationDao;
import com.spring.zidio.dao.InternshipDao;
import com.spring.zidio.dao.JobDao;
import com.spring.zidio.dao.StudentProfileDao;
import com.spring.zidio.dao.UserDao;

@Service
public class ApplicationService {
	
	private final String UPLOAD_DIR = "uploads/resumes/";
	
	@Autowired
	private ApplicationDao applicationDao;
	
	@Autowired
	private JobDao jobDao;
	
	@Autowired
	private InternshipDao internshipDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private StudentProfileDao studentProfileDao;
	
	//Apply for job
	 public Application applyforJob(Application application, MultipartFile resume) throws IOException {
	        // Validate Job or Internship presence
	        Job job = null;

	        if (application.getJob() != null) {
	            job = jobDao.findById(application.getJob().getId())
	                    .orElseThrow(() -> new RuntimeException("Job not found"));
	            application.setJob(job);
	        }


	        // Validate student
	        User student = userDao.findByUserName(application.getStudent().getUserName())
	                .orElseThrow(() -> new RuntimeException("Student not found"));
	        application.setStudent(student);
	        
	        studentProfileDao.findByUsername(student.getUserName())
	        .ifPresent(application::setStudentProfilePicture);
//	        StudentProfile profile = studentProfileDao.findByUsername(student).orElse(null);
	        

	        // Check for duplicate applications
	        if (job != null && applicationDao.existsByJobAndStudent(job, student)) {
	            throw new RuntimeException("You have already applied for this job");
	        }

	        // Save resume
	        if (resume != null && !resume.isEmpty()) {
	            String fileName = System.currentTimeMillis() + "_" + StringUtils.cleanPath(resume.getOriginalFilename());
	            Path uploadPath = Paths.get(UPLOAD_DIR);
	            if (!Files.exists(uploadPath)) {
	                Files.createDirectories(uploadPath);
	            }
	            Path filePath = uploadPath.resolve(fileName);
	            Files.copy(resume.getInputStream(), filePath);
	            application.setResumeUrl(filePath.toString());
	        } else {
	            throw new RuntimeException("Resume file is required");
	        }

	        application.setAppliedDate(LocalDate.now());
	        application.setStatus("Pending");
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

	        if (application.getApplicationQuestions() != null) {
	            application.getApplicationQuestions().forEach(q -> q.setApplication(application));
	        }
	        if (job != null) {
	            job.setApplicationCount(job.getApplicationCount() + 1);
	            jobDao.save(job);
	        }
	        return applicationDao.save(application);
	    }
	 
	    // Apply for internship
	 public Application applyForInternship(Application application, MultipartFile resume) throws IOException {
		    // Validate Internship presence
		    Internship internship = null;

		    if (application.getInternship() != null) {
		        internship = internshipDao.findById(application.getInternship().getId())
		                .orElseThrow(() -> new RuntimeException("Internship not found"));
		        application.setInternship(internship);
		    }

		    // Validate student
		    User student = userDao.findByUserName(application.getStudent().getUserName())
		            .orElseThrow(() -> new RuntimeException("Student not found"));
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
		        String fileName = System.currentTimeMillis() + "_" + StringUtils.cleanPath(resume.getOriginalFilename());
		        Path uploadPath = Paths.get(UPLOAD_DIR);
		        if (!Files.exists(uploadPath)) {
		            Files.createDirectories(uploadPath);
		        }
		        Path filePath = uploadPath.resolve(fileName);
		        Files.copy(resume.getInputStream(), filePath);
		        application.setResumeUrl(filePath.toString());
		    } else {
		        throw new RuntimeException("Resume file is required");
		    }

		    application.setAppliedDate(LocalDate.now());
		    application.setStatus("Pending");
		   
		    if (application.getEducationHistory() != null) {
	            application.getEducationHistory().forEach(edu -> edu.setApplication(application));
	        }

	        if (application.getWorkExperiences() != null) {
	            application.getWorkExperiences().forEach(exp -> exp.setApplication(application));
	        }

	        if (application.getCertifications() != null) {
	            application.getCertifications().forEach(cert -> cert.setApplication(application));
	        }

	        if (application.getApplicationQuestions() != null) {
	            application.getApplicationQuestions().forEach(q -> q.setApplication(application));
	        }
	        if (internship != null) {
	            internship.setApplicationCount(internship.getApplicationCount() + 1);
	            internshipDao.save(internship);
	        }

		    return applicationDao.save(application);
		}


	    // Find applications by job
	    public List<Application> findByJob(Long jobId) {
	        Job job = jobDao.findById(jobId)
	                .orElseThrow(() -> new RuntimeException("Job not found"));
	        return applicationDao.findByJob(job)
	                .map(List::of)
	                .orElse(List.of());
	    }

	    // Find applications by internship
	    public List<Application> findByInternship(Long internshipId) {
	        Internship internship = internshipDao.findById(internshipId)
	                .orElseThrow(() -> new RuntimeException("Internship not found"));
	        return applicationDao.findByInternship(internship)
	                .map(List::of)
	                .orElse(List.of());
	    }

	    // Find applications by student
	    public List<Application> findByStudent(String username) {
	        User student = userDao.findByUserName(username)
	                .orElseThrow(() -> new RuntimeException("Student not found"));
	        // No DAO method? Let's create a custom query or filter manually
	        return applicationDao.findAll().stream()
	                .filter(app -> app.getStudent().equals(student))
	                .toList();
	    }

	    // Update status
	    public Application updateStatus(Long id, String status) {
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
	    
	    //Download resume
	    public Resource loadResume(String fileName) {
	        try {
	            Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName).normalize();
	            Resource resource = new UrlResource(filePath.toUri());
	            if (resource.exists() && resource.isReadable()) {
	                return resource;
	            } else {
	                throw new RuntimeException("Resume not found or not readable: " + fileName);
	            }
	        } catch (MalformedURLException e) {
	            throw new RuntimeException("Error while loading resume: " + fileName, e);
	        }
	    }
}
