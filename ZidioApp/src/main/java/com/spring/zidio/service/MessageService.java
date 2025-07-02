package com.spring.zidio.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.spring.zidio.Message;
import com.spring.zidio.User;
import com.spring.zidio.dao.MessageDao;
import com.spring.zidio.dao.UserDao;

@Service
public class MessageService {
	
	@Autowired
	private MessageDao messageRepository;
	
	@Autowired
	private UserDao userDao;
	
//	public Message sendMessage(Message message) {
////		String userName = SecurityContextHolder.getContext().getAuthentication().getName();
////		message.setSender(userName);
//		return messageRepository.save(message);
//	}
	 public Message sendMessage(String recipientUserName, String subject, String body) {

	        // ── 1️⃣  Get the logged-in user name from Spring Security
	        String currentUserName = SecurityContextHolder.getContext()
	                                                      .getAuthentication()
	                                                      .getName();

	        // ── 2️⃣  Load sender & recipient entities
	        User sender = userDao.findByUserName(currentUserName)
	                .orElseThrow(() -> new UsernameNotFoundException("Sender not found"));

	        User recipient = userDao.findByUserName(recipientUserName)
	                .orElseThrow(() -> new UsernameNotFoundException("Recipient not found"));

	        // ── 3️⃣  Build and save the message
	        Message message = new Message();
	        message.setSender(sender);
	        message.setRecipient(recipient);
	        message.setSubject(subject);
	        message.setBody(body);
	        // CreatedAt will already default to LocalDateTime.now()

	        return messageRepository.save(message);
	    }
	
	
	 public List<Message> getAllMessages() {
	        return messageRepository.findAll();
	    }
	
	public Page<Message> getMessagesFromRecipient(String userName, Pageable pageable) {
		return messageRepository.findByRecipientUserName(userName, pageable);
	}
	
	public Page<Message> getMessagesFromSender(String userName, Pageable pageable) {
		return messageRepository.findBySenderUserName(userName, pageable);
	}
	
	public Optional<Message> getMessageById(Long id) {
	        return messageRepository.findById(id);
	 }
	
	public Message markAsRead(Long id) {
        Optional<Message> optional = messageRepository.findById(id);
        if (optional.isPresent()) {
            Message message = optional.get();
            message.setRead(true);
            return messageRepository.save(message);
        }
        throw new RuntimeException("Message not found");
    }
	
	 public void deleteMessage(Long id) {
	        messageRepository.deleteById(id);
	    }
	 public void deleteAllSentMessages(String userName) {
		    List<Message> messages = messageRepository.findBySenderUserName(userName);
		    messageRepository.deleteAll(messages);
		}
	 public void deleteAllInboxMessages(String userName) {
		    List<Message> messages = messageRepository.findByRecipientUserName(userName);
		    messageRepository.deleteAll(messages);
		}

	 public List<Message> markAllAsReadFromRecipient(String userName) {
	        List<Message> messages = messageRepository.findByRecipientUserName(userName);
	        for (Message message : messages) {
	            message.setRead(true);
	        }
	        return messageRepository.saveAll(messages);
	    }
	 public List<Message> markAllAsReadFromSender(String userName) {
	        List<Message> messages = messageRepository.findBySenderUserName(userName);
	        for (Message message : messages) {
	            message.setRead(true);
	        }
	        return messageRepository.saveAll(messages);
	 }
	
}
