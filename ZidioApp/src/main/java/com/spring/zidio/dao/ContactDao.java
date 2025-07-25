package com.spring.zidio.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.zidio.Contact;

public interface ContactDao extends JpaRepository<Contact, Long> {
	// Additional query methods can be defined here if needed
	// For example, you can define methods to find contacts by name, email, etc.

}
