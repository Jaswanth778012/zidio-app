package com.spring.zidio.payload;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

import com.spring.zidio.ImageModel;

import lombok.Data;

@Data
public class CourseUpdateRequest {
    private String courseName;
    private String description;
    private Long categoryId;
    private String tags;
    private String contentType;
    private String previewUrl;
    private String prerequisites;
    private boolean certificate;
    private boolean selfPaced;
    private LocalDate startDate;
    private LocalDate endDate;
    private Set<ImageModel> courseImages;
    private BigDecimal price;
    private BigDecimal discountedPrice;

}
