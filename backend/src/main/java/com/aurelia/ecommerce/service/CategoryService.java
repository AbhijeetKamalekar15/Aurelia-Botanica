package com.aurelia.ecommerce.service;

import com.aurelia.ecommerce.exception.BadRequestException;
import com.aurelia.ecommerce.exception.ResourceNotFoundException;
import com.aurelia.ecommerce.model.Category;
import com.aurelia.ecommerce.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getActiveCategories() {
        return categoryRepository.findByActiveTrueOrderByDisplayOrderAsc();
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(String id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
    }

    public Category createCategory(Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new BadRequestException("Category with this name already exists");
        }
        if (category.getSlug() == null || category.getSlug().isEmpty()) {
            category.setSlug(category.getName().toLowerCase().replaceAll("[^a-z0-9]", "-"));
        }
        return categoryRepository.save(category);
    }

    public Category updateCategory(String id, Category updated) {
        Category category = getCategoryById(id);
        category.setName(updated.getName());
        category.setDescription(updated.getDescription());
        category.setImageUrl(updated.getImageUrl());
        category.setActive(updated.isActive());
        category.setDisplayOrder(updated.getDisplayOrder());
        return categoryRepository.save(category);
    }

    public void deleteCategory(String id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }
}
