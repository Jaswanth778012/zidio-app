package com.spring.zidio;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name="sender_username", referencedColumnName="userName")
    @JsonIgnoreProperties({"userFirstName", "userLastName", "userPassword", "userStatus", "roles"})
	private User sender;
    
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recipient_username", referencedColumnName = "userName")
    @JsonIgnoreProperties({"userFirstName", "userLastName", "userPassword", "userStatus", "roles"})
	private User recipient;
    
	private String subject;
	
	@Column(length = 2000)
	private String body;
	
	private boolean isRead=false;
	private LocalDateTime CreatedAt = LocalDateTime.now();
	
}
