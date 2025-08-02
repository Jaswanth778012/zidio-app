package com.spring.zidio.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.zidio.Report;
import com.spring.zidio.User;

public interface ReportDao extends JpaRepository<Report, Long> {
	List<Report> findByResolved(boolean resolved);
	List<Report> findByReportedBy(User user);
}

