package com.spring.zidio.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.spring.zidio.AdminNotification;
import com.spring.zidio.Role;
import com.spring.zidio.User;
import com.spring.zidio.UserStatus;
import com.spring.zidio.dao.RoleDao;
import com.spring.zidio.dao.UserDao;

@Service
public class UserService {
	
	@Autowired
	private UserDao userDao;
	
	
	 @Autowired 
	 private RoleDao roleDao;
	 
	 @Autowired
	 private PasswordEncoder passwordEncoder;
	 
	 @Autowired
	 private AdminNotificationService adminNotificationService;
	
	public User registerNewUser(User user, String roleName) {
		
		Role role = roleDao.findById(roleName).get();
		
		Set<Role> roles = new HashSet<>();
		roles.add(role);
		user.setRoles(roles);
		user.setUserPassword(getEncodedPassword(user.getUserPassword()));
		
		
		
		if (roleName.equals("Student")) {
	    AdminNotification notification = new AdminNotification();
	    notification.setType("UserRegistration");
	    notification.setTitle("New Student Registered");
	    notification.setMessage("Student '"+ user.getUserName() + "' has registered.");
	    notification.setPriority("LOW");
	    notification.setReferenceId(user.getUserName());
	    adminNotificationService.createNotification(notification);
		}
		
		if (roleName.equals("Employer")) {
		    AdminNotification notification = new AdminNotification();
		    notification.setType("UserRegistration");
		    notification.setTitle("New Employer Registered");
		    notification.setMessage("Employer '"+ user.getUserName()  + " has registered.");
		    notification.setPriority("LOW");
		    notification.setReferenceId(user.getUserName());
		    adminNotificationService.createNotification(notification);
			}
		
		return userDao.save(user);
		
	}
	
	public void updatePassword(String userName, String currentPassword, String newPassword) {
	    if (userName == null || userName.isEmpty()) {
	        throw new IllegalArgumentException("Username must not be null or empty");
	    }

	    Optional<User> userOpt = userDao.findById(userName);

	    if (userOpt.isPresent()) {
	        User user = userOpt.get();
	        if(!passwordEncoder.matches(currentPassword, user.getUserPassword()))
	        {
	        	throw new RuntimeException("Current password is incorrect for user: " + userName);
	        }
	        System.out.println("Updating password for user: " + user.getUserName());

	        user.setUserPassword(getEncodedPassword(newPassword));
	        userDao.save(user);  // This works because userName is the @Id
	    } else {
	        throw new RuntimeException("User not found with username: " + userName);
	    }
	}
	
	public void updatePassword1(String userName, String newPassword) {
	    if (userName == null || userName.isEmpty()) {
	        throw new IllegalArgumentException("Username must not be null or empty");
	    }

	    Optional<User> userOpt = userDao.findById(userName);

	    if (userOpt.isPresent()) {
	        User user = userOpt.get();
	        System.out.println("Updating password for user: " + user.getUserName());

	        user.setUserPassword(getEncodedPassword(newPassword));
	        userDao.save(user);  // This works because userName is the @Id
	    } else {
	        throw new RuntimeException("User not found with username: " + userName);
	    }
	}
	
	 public void initRolesandUsers() { 
		 Role adminRole = new Role();
	 adminRole.setRoleName("Admin"); 
	 adminRole.setRoleDescription("Admin Role for managing the users");
	 roleDao.save(adminRole);
	 
	 Role userRole = new Role(); 
	 userRole.setRoleName("User");
	 userRole.setRoleDescription("Default Role for newly created record");
	 roleDao.save(userRole);
	 
	 Role employerRole = new Role();
	 employerRole.setRoleName("Employer");
	 employerRole.setRoleDescription("Employer Role for managing job postings");
	 roleDao.save(employerRole);
	 
	 Role studentRole = new Role();
	 studentRole.setRoleName("Student");
	 studentRole.setRoleDescription("Student Role for searching job/internships postings");
	 roleDao.save(studentRole);
	    
	 User adminUser = new User(); 
	 adminUser.setUserFirstName("Admin");
	 adminUser.setUserLastName("Admin"); 
	 adminUser.setUserName("admin123");
	 adminUser.setUserPassword(getEncodedPassword("admin@123"));
	  Set<Role> adminRoles = new HashSet<>(); 
	  adminRoles.add(adminRole);
	 adminUser.setRoles(adminRoles);
	 adminUser.setUserStatus(UserStatus.APPROVED);
	 userDao.save(adminUser);
	 
	 
//	 User User = new User(); 
//	 User.setUserFirstName("jas");
//	 User.setUserLastName("kumar"); 
//	 User.setUserName("jaskumar123");
//	 User.setPassword(getEncodedPassword("jaskumar@123")); 
//	 Set<Role> Roles = new HashSet<>();
//	 Roles.add(userRole); 
//	 User.setRole(Roles); 
//	 userDao.save(User); 
	 
	 }
	 public User findByUsername(String userName) {
		    return userDao.findById(userName)
		                  .orElseThrow(() -> new RuntimeException("User not found: " + userName));
		}

	 
	 public String getEncodedPassword(String password) {
		 return passwordEncoder.encode(password);
	 }
	 
	 public List<User> getAllUsers() {
		    return userDao.findAll();
		}

		public ResponseEntity<?> updateUserStatus(String userName, String userStatus) {
		    Optional<User> userOpt = userDao.findById(userName);
		    if (!userOpt.isPresent()) {
		        return ResponseEntity.notFound().build();
		    }

		    User user = userOpt.get();
		    try {
		        user.setUserStatus(UserStatus.valueOf(userStatus.toUpperCase()));
		    } catch (IllegalArgumentException e) {
		        return ResponseEntity.badRequest().body("Invalid status. Use: APPROVED, BLOCKED, or PENDING.");
		    }

		    userDao.save(user);
		    return ResponseEntity.ok("User status updated successfully");
		}
		
		public List<User> getAllEmployers() {
		    return userDao.findAllEmployers();
		}

		public ResponseEntity<?> updateEmployerStatus(String userName, String userStatus) {
		    return updateUserStatus(userName, userStatus); // reuse existing logic
		}
		
		public List<User> getAllStudents() {
		    return userDao.findAllStudents();
		}

		public ResponseEntity<?> updateStudentStatus(String userName, String status) {
		    Optional<User> userOpt = userDao.findById(userName);
		    if (userOpt.isEmpty()) {
		        return ResponseEntity.notFound().build();
		    }
		    User user = userOpt.get();
		    user.setUserStatus(UserStatus.valueOf(status));
		    userDao.save(user);
		    return ResponseEntity.ok("Student status updated");
		}
		
		public ResponseEntity<?> deleteUser(String userName) {
		    Optional<User> userOpt = userDao.findById(userName);
		    if (!userOpt.isPresent()) {
		        return ResponseEntity.notFound().build();
		    }
		    User user = userOpt.get();
		    // Clear roles associations (delete join table entries)
		    user.getRoles().clear();
		    userDao.save(user);

		    // Now delete user
		    userDao.deleteById(userName);
		    AdminNotification notification = new AdminNotification();
		    notification.setType("UserDeletion");
		    notification.setTitle("User Removed");
		    notification.setMessage("User '" + userName + "' has been deleted.");
		    notification.setPriority("MEDIUM");
		    notification.setReferenceId(userName);
		    adminNotificationService.createNotification(notification);

		    return ResponseEntity.ok("User deleted successfully");
		}


}
