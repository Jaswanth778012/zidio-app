package com.spring.zidio;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CourseEnrollment {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name ="student_username",referencedColumnName ="userName",nullable = false)
	private User student;
	
	@ManyToOne
	@JoinColumn(name = "course_id")
	private Course course;
	
	private LocalDateTime enrollmentAt;
	
	 private String paymentStatus; // CREATED, COMPLETED, FAILED

	    private String razorpayPaymentId;
	    private String razorpayOrderId;
	    private String razorpaySignature;
	
	@ManyToOne
	@JoinColumn(name = "student_profile_picture_id", referencedColumnName = "id",unique = false)
	private StudentProfile studentProfilePicture;
	
	@Enumerated(EnumType.STRING)
    private EnrollmentStatus enrollmentStatus;
	
	@PrePersist
	public void prePersist() {
		if (enrollmentAt == null) {
			enrollmentAt = LocalDateTime.now();
		}
		if (enrollmentStatus == null) {
            enrollmentStatus = EnrollmentStatus.PENDING;
        }
	}
	
}
