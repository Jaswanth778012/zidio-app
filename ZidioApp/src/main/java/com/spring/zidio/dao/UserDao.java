package com.spring.zidio.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.spring.zidio.User;

public interface UserDao extends JpaRepository<User, String> {
	// Custom query methods can be defined here if needed
	// For example, to find a user by username:
	// User findByUserName(String userName);
	Optional<User> findByUserName(String userName);
	
//	User findByUserName(String userName);
	
	@Query("SELECT u FROM User u JOIN u.roles r WHERE r.roleName = 'Employer'")
	List<User> findAllEmployers();

	
	@Query("SELECT u FROM User u JOIN u.roles r WHERE r.roleName = 'Student'")
	List<User> findAllStudents();
	
	@Query("SELECT u FROM User u JOIN u.roles r WHERE r.roleName != 'Admin'")
	List<User> findAllNonAdminUsers();
	
	@Query("SELECT u FROM User u JOIN u.roles r WHERE r.roleName = 'Admin'")
    List<User> findAllAdmins();
}
