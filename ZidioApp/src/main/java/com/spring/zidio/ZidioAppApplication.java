package com.spring.zidio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.spring.zidio.service.UserService;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.spring.zidio.dao")
public class ZidioAppApplication implements CommandLineRunner {
	
	@Autowired
	private UserService userService;
	
	public static void main(String[] args) {
		SpringApplication.run(ZidioAppApplication.class, args);
	}
	@Override
    public void run(String... args) throws Exception {
        userService.initRolesandUsers();  // ✅ This line is critical
    }
}
