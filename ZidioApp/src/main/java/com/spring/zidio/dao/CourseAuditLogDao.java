package com.spring.zidio.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.zidio.CourseAuditLog;

public interface CourseAuditLogDao extends JpaRepository<CourseAuditLog, Long> {
    List<CourseAuditLog> findByCourseId(Long courseId);
}
