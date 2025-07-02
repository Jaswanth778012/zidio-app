package com.spring.zidio.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.spring.zidio.StudentProfile;
import com.spring.zidio.dao.StudentProfileDao;

@Service
public class StudentProfileService {
	
	@Autowired
	private StudentProfileDao studentProfileDao;
	
	public Optional<StudentProfile> getProfileByUsername(String username) {
        return studentProfileDao.findByUsername(username);
    }

    public StudentProfile saveOrUpdateProfile(StudentProfile profile) {
        return studentProfileDao.save(profile);
    }
}
