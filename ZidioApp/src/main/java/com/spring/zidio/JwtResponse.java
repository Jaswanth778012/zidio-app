package com.spring.zidio;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class JwtResponse {
	
	private String userName;
	private String jwtToken;
	private String role;
}
