package com.spring.zidio.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.zidio.TeamMember;
import com.spring.zidio.dao.TeamMemberDao;

@Service
public class TeamMemberService {
	
	@Autowired
	private TeamMemberDao teamMemberDao;
	
	public TeamMember createTeamMember(TeamMember member) {
        return teamMemberDao.save(member);
    }

    public List<TeamMember> getAllMembers() {
        return teamMemberDao.findAll();
    }

    public TeamMember getMemberById(Long id) {
        return teamMemberDao.findById(id).orElse(null);
    }

    public TeamMember updateMember(Long id, TeamMember updated) {
        TeamMember existing = getMemberById(id);
        if (existing == null) return null;

        existing.setName(updated.getName());
        existing.setRole(updated.getRole());
        existing.setBio(updated.getBio());
        existing.setImageUrl(updated.getImageUrl());
        return teamMemberDao.save(existing);
    }

    public void deleteMember(Long id) {
    	teamMemberDao.deleteById(id);
    }
}
