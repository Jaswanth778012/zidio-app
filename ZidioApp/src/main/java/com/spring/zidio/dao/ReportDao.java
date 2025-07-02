package com.spring.zidio.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.zidio.Report;

public interface ReportDao extends JpaRepository<Report, Long> {
    List<Report> findByResolvedFalse();
}

