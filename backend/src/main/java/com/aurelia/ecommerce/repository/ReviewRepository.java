package com.aurelia.ecommerce.repository;

import com.aurelia.ecommerce.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByProductIdAndApprovedTrueOrderByCreatedAtDesc(String productId);
    Page<Review> findByProductIdAndApprovedTrue(String productId, Pageable pageable);
    List<Review> findByUserIdOrderByCreatedAtDesc(String userId);
    long countByProductIdAndApprovedTrue(String productId);
}
