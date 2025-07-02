package com.spring.zidio;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployerProfile {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String userFirstName;
	private String userLastName;
	@Column(unique = true)
	private String username;
	@Column(unique = true)
	private String email;
	private String phone;
	private String position;
	private String profilePictureUrl;
	private String companyName;
	private String companyWebsiteUrl;
	private String industry;
	private String companyType;
	
	@OneToOne
	@JoinColumn(name = "user_name", referencedColumnName = "userName")
	private User user;
}
