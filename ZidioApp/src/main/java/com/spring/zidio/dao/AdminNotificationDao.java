package com.spring.zidio.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.spring.zidio.AdminNotification;

public interface AdminNotificationDao extends JpaRepository<AdminNotification, Long> {
    List<AdminNotification> findByResolvedFalseOrderByTimestampDesc();
    List<AdminNotification> findByPriorityOrderByTimestampDesc(String priority);

    List<AdminNotification> findByTypeAndReadFalseOrderByTimestampDesc(String type);
    
    @Modifying
    @Query("UPDATE AdminNotification n SET n.read = true WHERE n.read = false")
    void markAllAsRead();
    
    @Modifying
    @Query("UPDATE AdminNotification n SET n.resolved = true WHERE n.resolved = false")
    void resolveAll();
}