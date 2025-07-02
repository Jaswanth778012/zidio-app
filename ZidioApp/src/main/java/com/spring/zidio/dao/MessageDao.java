package com.spring.zidio.dao;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.zidio.Message;

public interface MessageDao extends JpaRepository<Message, Long> {
	
	Page<Message> findBySenderUserName(String userName, Pageable pageable);
	Page<Message> findByRecipientUserName(String userName, Pageable pageable);
	List<Message> findBySenderUserName(String userName);
	List<Message> findByRecipientUserName(String userName);
	
	
}
