package com.spring.zidio;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "admin_profiles")
@Data
public class AdminProfile {

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

    private String profilePictureUrl;

}
