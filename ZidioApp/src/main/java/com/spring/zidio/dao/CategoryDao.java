package com.spring.zidio.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.zidio.Category;

public interface CategoryDao extends JpaRepository<Category, Long> {
    boolean existsByName(String name);
}
