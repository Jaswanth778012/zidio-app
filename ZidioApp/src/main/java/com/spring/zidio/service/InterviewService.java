package com.spring.zidio.service;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.zidio.EmployerProfile;
import com.spring.zidio.Interview;
import com.spring.zidio.StudentProfile;
import com.spring.zidio.dao.EmployerProfileDao;
import com.spring.zidio.dao.InterviewDao;
import com.spring.zidio.dao.StudentProfileDao;

@Service
public class InterviewService {
	@Autowired
	private InterviewDao interviewDao;
	
	@Autowired
	private GoogleCalenderService googleCalendarService;

	@Autowired
	private StudentProfileDao studentProfileRepository;

	@Autowired
	private EmployerProfileDao employerProfileRepository;
	
	@Autowired
	private EmailService emailService;

	public Interview ScheduleInterview(Interview interview, Principal principal)
	{
		String studentEmail = studentProfileRepository.findByUsername(interview.getStudent().getUserName())
				.map(StudentProfile::getEmail)
				.orElseThrow(() -> new RuntimeException("Student email not found"));
		
		String employerUserName = principal.getName();
		
		String employerEmail = employerProfileRepository.findByUsername(interview.getEmployer().getUserName())
				.map(EmployerProfile::getEmail)
				.orElseThrow(() -> new RuntimeException("Employer email not found"));
		
		try {
	        String meetLink = googleCalendarService.createCalendarEvent(interview, studentEmail, employerEmail);
	        interview.setMeetingLink(meetLink);
	        
	        String subject = "Interview Scheduled";
	        String body = "Hi " + interview.getStudent().getUserName() + ",\n\n" +
	        			"Thank you for your interest in the"+(interview.getJob() != null ? interview.getJob().getTitle() : interview.getInternship().getTitle())  + " position at" +(interview.getJob() != null ? interview.getJob().getCompanyName() : interview.getInternship().getCompanyName())  + ".\n\n" +
	                      "We’d like to invite you to interview with us. please use the below meeting link to join the interview\n\n" +
	                      "Interview Details:\n" +
	                      "Position: " + (interview.getJob() != null ? interview.getJob().getTitle() : interview.getInternship().getTitle()) + "\n" +
	                      "Date: " + interview.getInterviewDate() + "\n" +
	                      "Time: " + interview.getStartTime() + " to " + interview.getEndTime() + "\n" +
	                      "Mode: " + interview.getMode() + "\n" +
	                      "Meeting Link: " + meetLink + "\n\n" +
	                      "If you have any questions or technical difficulties, feel free to reply to this email.\n"+
	                      "Best regards,\n" +
	                      employerUserName;

	        emailService.sendInterviewEmail(employerEmail, studentEmail, subject, body);
	    } catch (IOException e) {
	        e.printStackTrace();
	        throw new RuntimeException("Failed to schedule calendar event: " + e.getMessage());
	    }
		return interviewDao.save(interview);
	}
	
	public List<Interview> getAllInterviews()
	{
		return interviewDao.findAll();
	}
	public List<Interview> getInterviewsByEmployer(String userName)
	{
		return interviewDao.findByEmployer_UserName(userName);
	}
	
	public Optional<Interview> getInterviewById(Long id) {
	        return interviewDao.findById(id);
	}
	
	public Interview updateInterview(Long id, Interview interview)
	{
		if (!interviewDao.existsById(id)) {
			throw new RuntimeException("Interview not found");
		}
		Interview existingInterview = interviewDao.findById(id).orElseThrow(() -> new RuntimeException("Interview not found"));
		existingInterview.setJob(interview.getJob());
		existingInterview.setInternship(interview.getInternship());
		existingInterview.setStudent(interview.getStudent());
		existingInterview.setEmployer(interview.getEmployer());
		existingInterview.setInterviewDate(interview.getInterviewDate());
		existingInterview.setStartTime(interview.getStartTime());
		existingInterview.setEndTime(interview.getEndTime());
		existingInterview.setMode(interview.getMode());
		existingInterview.setLocation(interview.getLocation());
		existingInterview.setNotes(interview.getNotes());
		existingInterview.setStatus(interview.getStatus());
		if (interview.getStatus() == Interview.Status.RESCHEDULED) {
	        String studentEmail = studentProfileRepository.findByUsername(interview.getStudent().getUserName())
	                .map(StudentProfile::getEmail)
	                .orElseThrow(() -> new RuntimeException("Student email not found"));

	        String employerEmail = employerProfileRepository.findByUsername(interview.getEmployer().getUserName())
	                .map(EmployerProfile::getEmail)
	                .orElseThrow(() -> new RuntimeException("Employer email not found"));

	        try {
	            String newMeetLink = googleCalendarService.createCalendarEvent(interview, studentEmail, employerEmail);
	            existingInterview.setMeetingLink(newMeetLink);
	            String subject = "Interview Rescheduled";
	            String body = "Hi " + interview.getStudent().getUserName() + ",\n\n" +
	                          "Your interview for the "+(interview.getJob() != null ? interview.getJob().getTitle() : interview.getInternship().getTitle())+"has been successfully rescheduled.\n\n" +
	            			  "Please find the updated details below:\n\n" +
	                          "New Date: " + interview.getInterviewDate() + "\n" +
	                          "Time: " + interview.getStartTime() + " to " + interview.getEndTime() + "\n" +
	                          "Mode: " + interview.getMode() + "\n" +
	                          "Location: " + interview.getLocation() + "\n" +
	                          "New Meeting Link: " + newMeetLink + "\n\n" +
	                          "Notes: " + interview.getNotes() + "\n\n" +
	                          "Regards,\n" + interview.getEmployer().getUserName();

	            emailService.sendInterviewEmail(employerEmail, studentEmail, subject, body);

	        } catch (IOException e) {
	            e.printStackTrace();
	            throw new RuntimeException("Failed to update calendar event: " + e.getMessage());
	        }
	    }
		return interviewDao.save(existingInterview);
	}
	
	public void deleteInterview(Long id)
	{
		if (!interviewDao.existsById(id)) {
			throw new RuntimeException("Interview not found");
		}
		interviewDao.deleteById(id);
	}
}
