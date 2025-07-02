package com.spring.zidio.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.zidio.Category;
import com.spring.zidio.dao.CategoryDao;

@Service
public class CategoryService {

    @Autowired
    private CategoryDao categoryDao;

    public List<Category> getAllCategories() {
        return categoryDao.findAll();
    }

    public Category createCategory(Category category) {
        if (categoryDao.existsByName(category.getName())) {
            throw new RuntimeException("Category already exists.");
        }
        return categoryDao.save(category);
    }

    public Category updateCategory(Long id, Category updatedCategory) {
        Optional<Category> optionalCategory = categoryDao.findById(id);
        if (optionalCategory.isPresent()) {
            Category category = optionalCategory.get();
            category.setName(updatedCategory.getName());
            category.setDescription(updatedCategory.getDescription());
            return categoryDao.save(category);
        } else {
            throw new RuntimeException("Category not found.");
        }
    }

    public void deleteCategory(Long id) {
        if (!categoryDao.existsById(id)) {
            throw new RuntimeException("Category not found.");
        }
        categoryDao.deleteById(id);
    }
}
