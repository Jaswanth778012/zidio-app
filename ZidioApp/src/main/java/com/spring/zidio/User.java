package com.spring.zidio;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) 
public class User {
	
	@Id
	private String userName;
	private String userFirstName;
	private String userLastName;
	private String userPassword;
	
	@Enumerated(EnumType.STRING)
	private UserStatus userStatus = UserStatus.PENDING;
	
	@ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@JoinTable(name = "user_role",
	joinColumns = {
			@JoinColumn(name = "user_name", referencedColumnName = "userName")
	},
	inverseJoinColumns = {
			@JoinColumn(name = "role_id")
	})
	private Set<Role> roles;
}


