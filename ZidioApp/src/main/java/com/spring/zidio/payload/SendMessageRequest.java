package com.spring.zidio.payload;

import lombok.Data;

@Data
public class SendMessageRequest {
	 private String recipientUserName;
	    private String subject;
	    private String body;
}
