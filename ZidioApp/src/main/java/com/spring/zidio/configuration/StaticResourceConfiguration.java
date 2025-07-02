package com.spring.zidio.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfiguration implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serves /uploads/** from local "uploads/" directory
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
        registry.addResourceHandler("/uploads/logos/**")
        		.addResourceLocations("file:uploads/logos/");
        registry.addResourceHandler("/uploads/resumes/**")
				.addResourceLocations("file:uploads/resumes/");
    }
}
