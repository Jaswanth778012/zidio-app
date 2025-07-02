package com.spring.zidio.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.zidio.AuditLog;

public interface AuditLogDao extends JpaRepository<AuditLog, Long> {
}
