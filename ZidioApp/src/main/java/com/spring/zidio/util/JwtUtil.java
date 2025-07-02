package com.spring.zidio.util;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;


@Component
public class JwtUtil {
	
	private static final String SECRET_KEY = "learn_programming_jwt_secret_key_2025_08_05_12345";
	private static final Key SIGNING_KEY = new SecretKeySpec(SECRET_KEY.getBytes(), SignatureAlgorithm.HS384.getJcaName());
	
	private static final int TOKEN_VALIDITY = 3600 * 5;
	
	public String getUserNameFromToken(String token) {
		return getClaimFromToken(token, Claims::getSubject); 
	}
	
	private <T> T getClaimFromToken(String token, Function<Claims, T> claimResolver) {
		final Claims claims = getAllClaimsFromToken(token);
		return claimResolver.apply(claims);
	}
	
	public Claims getAllClaimsFromToken(String token) {
		
		    try {
		        return Jwts.parserBuilder()
		                .setSigningKey(SIGNING_KEY)
		                .build()
		                .parseClaimsJws(token)
		                .getBody();
		    } catch (Exception e) {
		        throw new RuntimeException("Invalid or expired token: " + e.getMessage());
		    }
		}

	
	
	public boolean validateToken(String token, UserDetails userDetails) {
		String userName = getUserNameFromToken(token);
		return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
	}
	
	private boolean isTokenExpired(String token)
	{
		final Date expirationDate =getExpirationDateFromToken(token);
		return expirationDate.before(new Date());
	}
	
	private Date getExpirationDateFromToken(String token)
	{
		return getClaimFromToken(token, Claims::getExpiration);
	}
	
	public String generateToken(UserDetails userDetails, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", userDetails.getUsername());
        claims.put("authorities", userDetails.getAuthorities());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + TOKEN_VALIDITY * 1000))
                .signWith(SIGNING_KEY, SignatureAlgorithm.HS384)
                .compact();
    }
}
