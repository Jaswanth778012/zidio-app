package com.spring.zidio.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.zidio.TeamMember;

public interface TeamMemberDao extends JpaRepository<TeamMember, Long> {
	// Additional query methods can be defined here if needed
	// For example, you might want to find team members by team ID or user ID
	// List<TeamMember> findByTeamId(Long teamId);
	// List<TeamMember> findByUserId(Long userId);

}
