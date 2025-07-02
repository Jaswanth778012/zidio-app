package com.spring.zidio.service;



import java.util.Optional;

import org.springframework.stereotype.Service;

import com.spring.zidio.AdminProfile;
import com.spring.zidio.dao.AdminProfileDao;

@Service
public class AdminProfileService {

    private final AdminProfileDao adminProfileDao;

    public AdminProfileService(AdminProfileDao adminProfileDao) {
        this.adminProfileDao = adminProfileDao;
    }

    public Optional<AdminProfile> getProfileByUsername(String username) {
        return adminProfileDao.findByUsername(username);
    }

    public AdminProfile saveOrUpdateProfile(AdminProfile profile) {
        return adminProfileDao.save(profile);
    }
}