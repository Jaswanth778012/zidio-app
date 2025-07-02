package com.spring.zidio.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.spring.zidio.Role;

import jakarta.transaction.Transactional;

public interface RoleDao extends JpaRepository<Role, String> {
	// Custom query methods can be defined here if needed
	@Transactional
	@Modifying
	@Query(value = "DELETE FROM user_role WHERE user_name = :userName", nativeQuery = true)
	void deleteRolesByUserName(@Param("userName") String userName);

}
