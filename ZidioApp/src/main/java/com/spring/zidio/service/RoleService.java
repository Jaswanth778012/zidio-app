package com.spring.zidio.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

import com.spring.zidio.Role;
import com.spring.zidio.dao.RoleDao;

@Service
public class RoleService {
	
	@Autowired
	private RoleDao roleDao;
	
	public Role createRole(Role role) {
		return ((CrudRepository<Role, String>) roleDao).save(role);
	}
}
