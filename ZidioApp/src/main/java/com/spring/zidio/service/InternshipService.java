package com.spring.zidio.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.spring.zidio.Internship;
import com.spring.zidio.Internship.InternshipMode;
import com.spring.zidio.Internship.InternshipType;
import com.spring.zidio.PostStatus;
import com.spring.zidio.User;
import com.spring.zidio.dao.InternshipDao;

@Service
public class InternshipService {

    @Autowired
    private InternshipDao internshipDao;

    public List<Internship> getAllInternships() {
        return internshipDao.findAll();
    }

    public List<Internship> getFlaggedInternships() {
        return internshipDao.findByStatus(PostStatus.FLAGGED);
    }
    public List<Internship> getInternshipsByEmployer(User employer) {
        return internshipDao.findByPostedBy(employer);
    }
    
    public Internship createInternship(Internship internship, User employer) {
        internship.setPostedBy(employer);
        internship.setStatus(PostStatus.PENDING);
        internship.setFlagged(false);
        internship.setPostedAt(LocalDateTime.now());
        
        if(internship.getInternshipType() == null) {
        	internship.setInternshipType(InternshipType.FULL_TIME); // Default to FULL_TIME if not set
        }
        
        if(internship.getInternshipMode() == null)
        {
        	internship.setInternshipMode(InternshipMode.ONSITE); // Default to ON_SITE if not set
        }
        return internshipDao.save(internship);
    }
    public Internship updateInternshipDetails(Long id, Internship updatedInternship) {
        return internshipDao.findById(id)
            .map(internship -> {
                internship.setTitle(updatedInternship.getTitle());
                internship.setDescription(updatedInternship.getDescription());
                internship.setDuration(updatedInternship.getDuration());
                internship.setStipend(updatedInternship.getStipend());
                internship.setApplicationDeadline(updatedInternship.getApplicationDeadline());
                internship.setStartDate(updatedInternship.getStartDate());
                internship.setLocation(updatedInternship.getLocation());
                internship.setCompanyName(updatedInternship.getCompanyName());          // ✅ New
                internship.setAboutCompany(updatedInternship.getAboutCompany());        // ✅ New
                internship.setNumberOfOpenings(updatedInternship.getNumberOfOpenings()); // ✅ New
                internship.setEligibility(updatedInternship.getEligibility());          // ✅ New
                internship.setPerks(updatedInternship.getPerks());
                if (updatedInternship.getCompanyLogo() != null) {
                    internship.setCompanyLogo(updatedInternship.getCompanyLogo());
                }
                if(updatedInternship.getInternshipType() != null) {
                	internship.setInternshipType(updatedInternship.getInternshipType());
                }
                if(updatedInternship.getInternshipMode() != null) {
					internship.setInternshipMode(updatedInternship.getInternshipMode());
				}
                return internshipDao.save(internship);
            })
            .orElseThrow(() -> new RuntimeException("Internship not found"));
    }

    public Internship updateInternshipStatus(Long id, String status) {
        Internship internship = internshipDao.findById(id)
        		.orElseThrow(() -> new RuntimeException("Job not found"));
        try {
            // ✅ Convert string to enum safely
            PostStatus parsedStatus = PostStatus.valueOf(status.toUpperCase());
            internship.setStatus(parsedStatus);
            if (parsedStatus == PostStatus.FLAGGED) {
                internship.setFlagged(true);
            } else {
                internship.setFlagged(false);
            }
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status. Use APPROVED, REJECTED, FLAGGED, or PENDING.");
        }
        return internshipDao.save(internship);
    }
    
    public Internship updateInternshipFlaggedStatus(Long id, boolean flagged) {
        Internship internship = internshipDao.findById(id)
            .orElseThrow(() -> new RuntimeException("Internship not found"));

        internship.setFlagged(flagged);

        if (flagged) {
            internship.setStatus(PostStatus.FLAGGED);
        } else if (internship.getStatus() == PostStatus.FLAGGED) {
            internship.setStatus(PostStatus.PENDING);
        }

        return internshipDao.save(internship);
    }

    public void deleteInternship(Long id) {
        internshipDao.deleteById(id);
    }
    
    public Page<Internship> getFilteredInternships(int page, int size, String search) {
        return internshipDao.findFilteredInternships(
            (search == null || search.isEmpty()) ? null : search,
            PageRequest.of(page, size)
        );
    }


}