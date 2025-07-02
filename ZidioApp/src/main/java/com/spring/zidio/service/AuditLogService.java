package com.spring.zidio.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.spring.zidio.AuditLog;
import com.spring.zidio.CourseAuditLog;
import com.spring.zidio.dao.AuditLogDao;
import com.spring.zidio.dao.CourseAuditLogDao;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogDao auditLogDao;

    public void log(String action, String userName) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setPerformedBy(userName);
        auditLogDao.save(log);
    }

    public List<AuditLog> getAllLogs() {
        return auditLogDao.findAll(Sort.by(Sort.Direction.DESC, "timestamp"));
    }
    
    @Autowired
    private CourseAuditLogDao courseAuditRepo;

    public void log(Long id, String action, String performedBy, String details) {
        CourseAuditLog log = new CourseAuditLog();
        log.setCourseId(id);
        log.setAction(action);
        log.setPerformedBy(performedBy);
        log.setDetails(details);
        log.setTimestamp(LocalDateTime.now());
        courseAuditRepo.save(log);
    }

    public List<CourseAuditLog> getLogs(Long courseId) {
        return courseAuditRepo.findByCourseId(courseId);
    }
}

