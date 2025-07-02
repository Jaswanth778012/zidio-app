package com.spring.zidio.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.zidio.StudentProfile;
import com.spring.zidio.User;

public interface StudentProfileDao extends JpaRepository<StudentProfile, Long> {
	Optional<StudentProfile> findByEmail(String email);
	Optional<StudentProfile> findByUsername(String username);
	 
}
