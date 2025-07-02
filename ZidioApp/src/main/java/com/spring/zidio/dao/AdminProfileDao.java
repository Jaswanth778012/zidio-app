package com.spring.zidio.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.zidio.AdminProfile;
import com.spring.zidio.StudentProfile;

public interface AdminProfileDao extends JpaRepository<AdminProfile, Long> {
	// Custom query methods can be defined here if needed
	Optional<AdminProfile> findByUsername(String username);
	Optional<AdminProfile> findByEmail(String email);
	

}
