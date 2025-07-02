package com.spring.zidio.dao;


import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.spring.zidio.Course;

public interface CourseDao extends JpaRepository<Course, Long> {
	
	List<Course> findByArchivedFalse();
	
	@Query("""
		    SELECT c FROM Course c
		    WHERE (:categoryId IS NULL OR c.category.id = :categoryId)
		      AND (:status IS NULL OR c.status = :status)
		      AND (:minEnroll IS NULL OR c.enrollmentCount >= :minEnroll)
		      AND (:maxEnroll IS NULL OR c.enrollmentCount <= :maxEnroll)
		      AND (:minPrice IS NULL OR c.discountedPrice >= :minPrice)
         	  AND(:maxPrice IS NULL OR c.discountedPrice <= :maxPrice)
		      AND (:search IS NULL OR LOWER(c.courseName) LIKE LOWER(CONCAT('%', :search, '%')))
		      AND c.archived = false
		""")
		Page<Course> filterCourses(
		    @Param("categoryId") Long categoryId,
		    @Param("status") String status,
		    @Param("minEnroll") Integer minEnroll,
		    @Param("maxEnroll") Integer maxEnroll,
		    @Param("minPrice") BigDecimal minPrice,
		    @Param("maxPrice") BigDecimal maxPrice,
		    @Param("search") String search,
		    Pageable pageable
		);




}
