package com.spring.zidio.service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.spring.zidio.JwtRequest;
import com.spring.zidio.JwtResponse;
import com.spring.zidio.Role;
import com.spring.zidio.User;
import com.spring.zidio.dao.UserDao;
import com.spring.zidio.util.JwtUtil;

@Service
public class JwtService implements UserDetailsService{
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	public JwtResponse createJwtToken(JwtRequest jwtRequest) throws Exception
	{
		String userName = jwtRequest.getUserName();
		String userPassword = jwtRequest.getUserPassword();
		authenticate(userName, userPassword);
		
		User user = userDao.findById(userName).orElseThrow(() -> new UsernameNotFoundException("User not found"));
		 UserDetails userDetails = loadUserByUsername(userName);
		String role = user.getRoles().stream().findFirst().get().getRoleName();
		String newGeneratedToken = jwtUtil.generateToken(userDetails,role);
		return new JwtResponse(user.getUserName(), newGeneratedToken,role);
	}
	@Override
	public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
		// TODO Auto-generated method stub
		User user = userDao.findById(userName).get();
		
		if(user != null)
		{
			return new org.springframework.security.core.userdetails.User(user.getUserName(), user.getUserPassword(), getAuthorities(user));
		}else
		{
			throw new UsernameNotFoundException("Username not found");
		}
	}
	
	private Set getAuthorities(User user)
	{
		Set authorities = new HashSet();
		user.getRoles().forEach(role->{
			authorities.add(new SimpleGrantedAuthority("ROLE_"+role.getRoleName()));
		});
		
		return authorities;
	}
	
	private void authenticate(String userName, String userPassword) throws Exception
	{
		try
		{
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userName, userPassword));
		}catch (DisabledException e) {
			throw new Exception("user is disabled");
		}
		catch(BadCredentialsException e)
		{
			throw new Exception("Invalid credentials");
		}
		catch (Exception e) {
			throw new RuntimeException("Invalid credentials");
		}
	}

}
