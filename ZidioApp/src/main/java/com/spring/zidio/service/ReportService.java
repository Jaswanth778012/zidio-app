package com.spring.zidio.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.spring.zidio.Report;
import com.spring.zidio.dao.ReportDao;

@Service
public class ReportService {

    @Autowired
    private ReportDao reportDao;

    public List<Report> getUnresolvedReports() {
        return reportDao.findByResolvedFalse();
    }

    public void resolveReport(Long id) {
        Report report = reportDao.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found"));

        report.setResolved(true);
        reportDao.save(report);
    }

    public Report submitReport(Report report) {
        return reportDao.save(report);
    }
}
