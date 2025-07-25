package com.spring.zidio;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String courseName;
    
    @Column(length = 2000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonIgnoreProperties("courses")
    private Category category;
    private String tags;

//    @ManyToOne
//    @JoinColumn(name = "creator_id")
//    private User creator;
   

    private LocalDate startDate;
    private LocalDate endDate;
    private boolean selfPaced;

    private String contentType;
    private String previewUrl;
    private String prerequisites;
    
    @Column(nullable = false)
    private boolean certificate;
    private String status; // PENDING, ACTIVE, INACTIVE, REJECTED, ARCHIVED

    private int enrollmentCount;

    private LocalDateTime createdAt;
    
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "course_images",
    		   joinColumns = {
    				   @JoinColumn(name = "id"),
    		   },
			   inverseJoinColumns = {
					   @JoinColumn(name = "image_id")   
			   })
    private Set<ImageModel> courseImages;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.status = "PENDING";
        this.enrollmentCount = 0;
    }
    
    @Column(nullable = false)
    private boolean archived = false;
  


    @ManyToOne
    @JoinColumn(name = "faculty_username")
    private User faculty;
    
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<CourseReview> reviews;
    
 

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(precision = 10, scale = 2)
    private BigDecimal discountedPrice;
    
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("course") 
    private List<Syllabus> syllabus;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<CourseProgress> progress;

 
}
