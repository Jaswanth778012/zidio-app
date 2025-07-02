package com.spring.zidio.payload;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import com.spring.zidio.ImageModel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseRequest {
    private String courseName;
    private String description;
    private List<String> tags;
    private String contentType;       // video, pdf, link, etc.
    private String previewUrl;
    private List<String> prerequisites;
    private boolean certificate;
    private boolean selfPaced;
    private LocalDate startDate;
    private LocalDate endDate;
//    private String creatorUsername;
    private Long categoryId;
    private List<String> categories;
 // ✅ NEW FIELDS
    
    private Set<ImageModel> courseImages;
    private BigDecimal price;
    private BigDecimal discountedPrice;
}


