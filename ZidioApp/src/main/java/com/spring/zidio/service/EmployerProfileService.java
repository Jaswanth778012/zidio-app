package com.spring.zidio.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.zidio.EmployerProfile;
import com.spring.zidio.dao.EmployerProfileDao;

@Service
public class EmployerProfileService {
	
	@Autowired
	private EmployerProfileDao employerProfileDao;
	
	public Optional<EmployerProfile> getProfileByUsername(String username) {
		return employerProfileDao.findByUsername(username);
	}
	public EmployerProfile saveOrUpdateProfile(EmployerProfile profile) {
		return employerProfileDao.save(profile);
	}
}
