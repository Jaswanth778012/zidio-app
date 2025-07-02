package com.spring.zidio.configuration;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.spring.zidio.service.JwtService;
import com.spring.zidio.util.JwtUtil;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private JwtService jwtService;
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
		final String header =request.getHeader(HttpHeaders.AUTHORIZATION);
		
		String jwtToken = null;
		String userName = null;
		
		if (header != null && header.startsWith("Bearer ")) {
            jwtToken = header.substring(7);
            try {
                Claims claims = jwtUtil.getAllClaimsFromToken(jwtToken);
                userName = claims.getSubject();

                // ✅ Read authorities from token
                List<?> rolesRaw = (List<?>) claims.get("authorities");
                List<SimpleGrantedAuthority> authorities = rolesRaw.stream()
                        .map(role -> {
                            Map<?, ?> roleMap = (Map<?, ?>) role;
                            return new SimpleGrantedAuthority((String) roleMap.get("authority"));
                        })
                        .collect(Collectors.toList());


                if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                	System.out.println("JWT Filter triggered for: " + request.getRequestURI());
                    System.out.println("✅ Authenticated user: " + userName);
                    System.out.println("➡️ Authorities: " + authorities);
                    System.out.println("JWT Token: " + jwtToken);
                    System.out.println("Username from token: " + userName);

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userName, null, authorities);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("Authorities from UserDetails: " + authorities);
                }

            } catch (IllegalArgumentException e) {
                handleException(response, "Unable to get JWT Token: " + e.getMessage(), HttpServletResponse.SC_UNAUTHORIZED);
                return;
            } catch (ExpiredJwtException e) {
                handleException(response, "JWT Token has expired: " + e.getMessage(), HttpServletResponse.SC_UNAUTHORIZED);
                return;
            } catch (SignatureException | MalformedJwtException e) {
                handleException(response, "Invalid JWT Token: " + e.getMessage(), HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        } else {
            System.out.println("JWT token does not start with Bearer");
        }
		
		filterChain.doFilter(request, response);
	}
	private void handleException(HttpServletResponse response, String message, int status) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", message);
        errorResponse.put("status", status);
        new ObjectMapper().writeValue(response.getWriter(), errorResponse);
    }
	
	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
	    String path = request.getServletPath();
	    return path.startsWith("/admin/courses/image/");
	}

}
