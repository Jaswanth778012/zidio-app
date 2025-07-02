package com.spring.zidio.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spring.zidio.User;
import com.spring.zidio.service.UserService;

import jakarta.annotation.PostConstruct;

@RestController
public class UserController {
	@Autowired
	public UserService userService;

	
	  @PostConstruct public void initRolesandUsers() {
	  
	  userService.initRolesandUsers();
	  
	  }
	 
	  @PutMapping({ "/updatePassword" })
	  public HttpEntity<String> updatePassword(@RequestBody Map<String, String> request) {
		  String userName = request.get("userName");
		  String currentPassword = request.get("currentPassword");
		  String newPassword = request.get("newPassword");
		  
		  try
		  {
			  userService.updatePassword(userName,currentPassword, newPassword);
			  return ResponseEntity.ok("Password updated successfully");
		  }catch(RuntimeException e)
		  {
			  return ResponseEntity.badRequest().body("Error updating password: " + e.getMessage());
		  }
	  }

	@PostMapping({ "/registerNewUser" })
	public ResponseEntity<?> registerNewUser(@RequestBody User user,@RequestParam String roleName) {

		 String normalizedRole = roleName.trim();

		    // Allow only "Student" and "Employer"
		    if (!normalizedRole.equals("Student") && !normalizedRole.equals("Employer")) {
		        return ResponseEntity
		                .badRequest()
		                .body("Invalid role. Only 'Student' and 'Employer' registrations are allowed.");
		    }

		    try {
		        User createdUser = userService.registerNewUser(user, normalizedRole);
		        return ResponseEntity.ok(createdUser);
		    } catch (Exception e) {
		        return ResponseEntity
		                .internalServerError()
		                .body("User registration failed: " + e.getMessage());
		    }
	}
	
	@GetMapping({ "/forAdmin" })
	@PreAuthorize("hasRole('Admin')")
	public String forAdmin() {
		return "This URL is only accessible to Admins";
	}
	
	@GetMapping({ "/forStudent" })
	@PreAuthorize("hasRole('Student')")
	public String forStudent()
	{
		return "This URL is only accessible to Students";
	}
	
	@GetMapping({ "/forEmployer" })
	@PreAuthorize("hasRole('Employer')")
	public String forEmployer() {
	    return "This URL is only accessible to Employers";
	}
	

}
