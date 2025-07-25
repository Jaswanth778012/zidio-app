package com.spring.zidio.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.spring.zidio.Job;
import com.spring.zidio.Job.JobMode;
import com.spring.zidio.Job.JobType;
import com.spring.zidio.PostStatus;
import com.spring.zidio.User;
import com.spring.zidio.dao.JobDao;

@Service
public class JobService {

    @Autowired
    private JobDao jobDao;

    public List<Job> getAllJobs() {
        return jobDao.findAll();
    }

    public List<Job> getFlaggedJobs() {
        return jobDao.findByStatus(PostStatus.FLAGGED);
    }
    
    public List<Job> getJobsByEmployer(User employer) {
        return jobDao.findByPostedBy(employer);
    }
    public Job createJob(Job job, User employer) {
        job.setPostedBy(employer); // Link the employer who is creating the job
        job.setStatus(PostStatus.PENDING); // Default status
        job.setFlagged(false); // Default flagged status
        job.setPostedAt(LocalDateTime.now()); 
        
        if (job.getJobType() == null) {
            job.setJobType(JobType.FULL_TIME); // or any default
        }
        if (job.getJobMode() == null) {
            job.setJobMode(JobMode.ONSITE); // or any default
        }
        return jobDao.save(job);
    }
    
    public Job updateJobDetails(Long id, Job updatedJob) {
        return jobDao.findById(id)
            .map(job -> {
                job.setTitle(updatedJob.getTitle());
                job.setDescription(updatedJob.getDescription());
                job.setLocation(updatedJob.getLocation());
                job.setSkillsRequired(updatedJob.getSkillsRequired());
                job.setSalary(updatedJob.getSalary());
                job.setApplicationDeadline(updatedJob.getApplicationDeadline());
                job.setStartDate(updatedJob.getStartDate());
                job.setCompanyName(updatedJob.getCompanyName());          // ✅ New
                job.setAboutCompany(updatedJob.getAboutCompany());        // ✅ New
                job.setNumberOfOpenings(updatedJob.getNumberOfOpenings()); // ✅ New
                job.setEligibility(updatedJob.getEligibility());          // ✅ New
                job.setPerks(updatedJob.getPerks());
                if (updatedJob.getCompanyLogo() != null) {
                    job.setCompanyLogo(updatedJob.getCompanyLogo());
                }
                
                if (updatedJob.getJobType() != null) {
                    job.setJobType(updatedJob.getJobType());
                }
                if (updatedJob.getJobMode() != null) {
                    job.setJobMode(updatedJob.getJobMode());
                }
                return jobDao.save(job);
            })
            .orElseThrow(() -> new RuntimeException("Job not found"));
    }
    public Job updateJobStatus(Long id, String status) {
        Job job = jobDao.findById(id)
            .orElseThrow(() -> new RuntimeException("Job not found"));

        try {
            // ✅ Convert string to enum safely
            PostStatus parsedStatus = PostStatus.valueOf(status.toUpperCase());
            job.setStatus(parsedStatus);
            if (parsedStatus == PostStatus.FLAGGED) {
                job.setFlagged(true);
            } else {
                job.setFlagged(false);
            }

        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status. Use APPROVED, REJECTED, FLAGGED, or PENDING.");
        }

        return jobDao.save(job);
    }
    
    public Job getJobById(Long id) {
        return jobDao.findById(id)
            .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
    }


    public void deleteJob(Long id) {
        jobDao.deleteById(id);
    }
    
    public Job updateJobFlaggedStatus(Long id, boolean flagged) {
        Job job = jobDao.findById(id)
            .orElseThrow(() -> new RuntimeException("Job not found"));
        
        job.setFlagged(flagged);
        
        // Optional: if you want to sync status too:
        if (flagged) {
            job.setStatus(PostStatus.FLAGGED);
        } else if (job.getStatus() == PostStatus.FLAGGED) {
            job.setStatus(PostStatus.PENDING); // or whatever default status you prefer
        }

        return jobDao.save(job);
    }
    
    public Page<Job> getFilteredJobs(int page, int size, String search) {
        return jobDao.findFilteredJobs(search == null || search.isEmpty() ? null : search, PageRequest.of(page, size));
    }


}