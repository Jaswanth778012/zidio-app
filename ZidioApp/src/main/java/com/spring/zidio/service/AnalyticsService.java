package com.spring.zidio.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.zidio.PostStatus;
import com.spring.zidio.User;
import com.spring.zidio.UserStatus;
import com.spring.zidio.dao.CourseDao;
import com.spring.zidio.dao.CourseEnrollmentDao;
import com.spring.zidio.dao.InternshipDao;
import com.spring.zidio.dao.JobDao;
import com.spring.zidio.dao.UserDao;

@Service
public class AnalyticsService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private JobDao jobDao;

    @Autowired
    private InternshipDao internshipDao;

    @Autowired
    private CourseDao courseDao;
    
    @Autowired
    private CourseEnrollmentDao courseEnrollmentDao;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Users
        List<User> allUsers = userDao.findAll();
        long totalUsers = allUsers.size();
        long admins = allUsers.stream().filter(u ->
        u.getRoles().stream().anyMatch(r -> r.getRoleName().equals("Admin"))).count();
        long employers = allUsers.stream().filter(u ->
                u.getRoles().stream().anyMatch(r -> r.getRoleName().equals("Employer"))).count();
        long students = allUsers.stream().filter(u ->
                u.getRoles().stream().anyMatch(r -> r.getRoleName().equals("Student"))).count();
        long approvedUsers = allUsers.stream().filter(u -> u.getUserStatus() == UserStatus.APPROVED).count();
        long pendingUsers = allUsers.stream().filter(u -> u.getUserStatus() == UserStatus.PENDING).count();
        long blockedUsers = allUsers.stream().filter(u -> u.getUserStatus() == UserStatus.BLOCKED).count();
        // Listings
        long jobCount = jobDao.count();
        long internshipCount = internshipDao.count();
        long courseCount = courseDao.count();
        
        long courseEnrollmentCount = courseEnrollmentDao.count();
        
        long approvedJobs = jobDao.countByStatus(PostStatus.APPROVED);
        long pendingJobs = jobDao.countByStatus(PostStatus.PENDING);
        long flaggedJobs = jobDao.countByStatus(PostStatus.FLAGGED);

        long approvedInternships = internshipDao.countByStatus(PostStatus.APPROVED);
        long pendingInternships = internshipDao.countByStatus(PostStatus.PENDING);
        long flaggedInternships = internshipDao.countByStatus(PostStatus.FLAGGED);
        
//        long approvedCourses = courseDao.countByStatus(PostStatus.APPROVED);
//        long rejectedCourses = courseDao.countByStatus(PostStatus.REJECTED);

        stats.put("totalUsers", totalUsers);
        stats.put("studentsCount", students);
        stats.put("adminsCount", admins);
        stats.put("employersCount", employers);
        stats.put("approvedUsers", approvedUsers);
        stats.put("pendingUsers", pendingUsers);
        stats.put("blockedUsers", blockedUsers);

        stats.put("jobsCount", jobCount);
        stats.put("internshipsCount", internshipCount);
        stats.put("coursesCount", courseCount);
        stats.put("courseEnrollmentCount", courseEnrollmentCount);

        stats.put("approvedJobs", approvedJobs);
        stats.put("pendingJobs", pendingJobs);
        stats.put("flaggedJobs", flaggedJobs);

        stats.put("approvedInternships", approvedInternships);
        stats.put("pendingInternships", pendingInternships);
        stats.put("flaggedInternships", flaggedInternships);
        
//        stats.put("approvedCourses", approvedCourses);
//        stats.put("rejectedCourses", rejectedCourses);
        
        Map<String, Long> statusBreakdown = new HashMap<>();
        statusBreakdown.put("APPROVED", approvedUsers);
        statusBreakdown.put("PENDING", pendingUsers);
        statusBreakdown.put("BLOCKED", blockedUsers);
        stats.put("statusBreakdown", statusBreakdown);
        return stats;
    }
}

