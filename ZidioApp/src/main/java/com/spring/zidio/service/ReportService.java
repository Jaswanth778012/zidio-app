package com.spring.zidio.service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.zidio.Report;
import com.spring.zidio.ReportStatus;
import com.spring.zidio.User;
import com.spring.zidio.dao.ReportDao;
import com.spring.zidio.dao.UserDao;

@Service
public class ReportService {

    @Autowired
    private ReportDao reportDao;
    
    @Autowired
    private UserDao userDao; // Assuming you have a UserDao to fetch User entities

    public List<Report> getUnresolvedReports() {
        return reportDao.findByResolved(false);
    }
    
    public List<Report> getAllReports() {
        return reportDao.findAll();
    }

    public Report resolveReport(Long id) {
    	Optional<Report> reportOptional = reportDao.findById(id);
        if (reportOptional.isPresent()) {
            Report report = reportOptional.get();
            report.setResolved(true);
            report.setStatus(ReportStatus.valueOf("RESOLVED"));
            return reportDao.save(report);
        }
        throw new RuntimeException("Report not found with ID: " + id);
    }

    public Report submitReport(Report report, Principal principal) {
    	String username = principal.getName();
    	
    	User user = userDao.findByUserName(username)
				.orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    	
    	report.setReportedBy(user); // Set the username of the reporter
    	report.setCreatedAt(LocalDateTime.now());
        return reportDao.save(report);
    }
    
    public void deleteReport(Long id) {
        reportDao.deleteById(id);
    }
    
    public Optional<Report> getReportById(Long id) {
        return reportDao.findById(id);
    }
    
    public Report updateReportStatus(Long id,  ReportStatus status, String resolutionNotes, boolean resolved) {
        if (resolutionNotes == null || resolutionNotes.trim().isEmpty()) {
            throw new IllegalArgumentException("Resolution note is required when updating report status.");
        }

        Report report = reportDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found with ID: " + id));

        // If using enum:
        report.setStatus(status);
        report.setResolutionNotes(resolutionNotes);
        report.setResolved(true);

        return reportDao.save(report);
    }
    
    public List<Report> getReportsByUser(Principal principal) {
    	String username = principal.getName();
        User user = userDao.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        return reportDao.findByReportedBy(user);
    }

}
