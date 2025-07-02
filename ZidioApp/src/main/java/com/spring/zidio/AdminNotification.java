package com.spring.zidio;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AdminNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;         // e.g., "UserRegistration", "ContentModeration"
    private String title;
    private String message;
    private String priority;
    @Column(name = "read_status")
    private boolean read = false;// LOW, MEDIUM, HIGH
    private String referenceId;

    private LocalDateTime timestamp = LocalDateTime.now();

    private boolean resolved = false;
    
    private boolean deleted = false;
}
