package com.spring.zidio.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.spring.zidio.AdminNotification;
import com.spring.zidio.dao.AdminNotificationDao;


import jakarta.transaction.Transactional;

@Service
public class AdminNotificationService {

    private final AdminNotificationDao adminNotificationDao;

    public AdminNotificationService(AdminNotificationDao adminNotificationDao) {
        this.adminNotificationDao = adminNotificationDao;
    }

    public List<AdminNotification> getUnreadNotifications() {
        return adminNotificationDao.findByResolvedFalseOrderByTimestampDesc();
    }

    public Page<AdminNotification> getAllNotifications(Pageable pageable) {
        return adminNotificationDao.findAll(pageable);
    }
    
    public List<AdminNotification> getUnresolvedNotifications() {
        return adminNotificationDao.findByResolvedFalseOrderByTimestampDesc();
    }
    
    public AdminNotification getNotificationById(Long id) {
        return adminNotificationDao.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found with id: " + id));
    }
    
    public void resolveNotification(Long id) {
        AdminNotification notif = getNotificationById(id);
        
            notif.setResolved(true);
            adminNotificationDao.save(notif);
        
    }
    
    public AdminNotification createNotification(AdminNotification notification) {
        return adminNotificationDao.save(notification);
    }
    
    public AdminNotification createNotification(String type, String title, String message, String priority, String referenceId) {
        AdminNotification notification = new AdminNotification();
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setPriority(priority);
        notification.setReferenceId(referenceId);
        return adminNotificationDao.save(notification);
    }
    public void markAsRead(Long id) {
        AdminNotification notification = getNotificationById(id);
        notification.setRead(true);
        adminNotificationDao.save(notification);
    }
    
    @Transactional
    public void markAllAsRead() {
        adminNotificationDao.markAllAsRead();
    }
    
    public  void deleteAllNotifications() {
        adminNotificationDao.deleteAll();
    }

    public void resolveAllNotifications() {
        List<AdminNotification> notifications = adminNotificationDao.findAll();
        for (AdminNotification notification : notifications) {
            notification.setResolved(true);
        }
        adminNotificationDao.saveAll(notifications);
    }
    
    public List<AdminNotification> getByPriority(String priority) {
        return adminNotificationDao.findByPriorityOrderByTimestampDesc(priority);
    }
    
    public List<AdminNotification> getUnreadByType(String type) {
        return adminNotificationDao.findByTypeAndReadFalseOrderByTimestampDesc(type);
    }
    
    public void deleteNotification(Long id) {
        AdminNotification notification = getNotificationById(id);
        notification.setDeleted(true);
        adminNotificationDao.save(notification);
    }
}
