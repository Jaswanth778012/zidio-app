package com.spring.zidio.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.zidio.EmployerProfile;
import com.spring.zidio.User;


public interface EmployerProfileDao extends JpaRepository<EmployerProfile, Long> {
	Optional<EmployerProfile> findByEmail(String email);
	Optional<EmployerProfile> findByUsername(String username);
	
}
