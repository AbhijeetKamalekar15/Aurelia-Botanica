package com.aurelia.ecommerce.repository;

import com.aurelia.ecommerce.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    Optional<Category> findBySlug(String slug);
    Boolean existsByName(String name);
    List<Category> findByActiveTrueOrderByDisplayOrderAsc();
}
