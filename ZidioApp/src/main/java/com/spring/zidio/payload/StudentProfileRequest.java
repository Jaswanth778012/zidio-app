package com.spring.zidio.payload;

import lombok.Data;

@Data
public class StudentProfileRequest {
	private String userFirstName;
	private String userLastName;
	
	private String username;
	private String email;
	private String phone;
	private String profilePictureUrl;
	private String college;
	private String branch;
	private String graduationYear;
	private String skills;
	private String resumeUrl;
}
