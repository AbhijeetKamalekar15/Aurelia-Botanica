package com.aurelia.ecommerce.service;

import com.aurelia.ecommerce.dto.ReviewRequest;
import com.aurelia.ecommerce.exception.BadRequestException;
import com.aurelia.ecommerce.exception.ResourceNotFoundException;
import com.aurelia.ecommerce.model.Product;
import com.aurelia.ecommerce.model.Review;
import com.aurelia.ecommerce.repository.ProductRepository;
import com.aurelia.ecommerce.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Review> getApprovedReviewsForProduct(String productId) {
        return reviewRepository.findByProductIdAndApprovedTrueOrderByCreatedAtDesc(productId);
    }

    public List<Review> getAllReviewsForAdmin() {
        return reviewRepository.findAll();
    }

    public Review addReview(String productId, String userId, String userName, ReviewRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        Review review = new Review(
                productId,
                userId,
                userName,
                request.getRating(),
                request.getTitle(),
                request.getComment(),
                true
        );

        Review saved = reviewRepository.save(review);

        // Recalculate average rating for product
        List<Review> approvedReviews = reviewRepository.findByProductIdAndApprovedTrueOrderByCreatedAtDesc(productId);
        double totalRating = approvedReviews.stream().mapToInt(Review::getRating).sum();
        double avg = approvedReviews.isEmpty() ? 5.0 : totalRating / approvedReviews.size();

        product.setAverageRating(Math.round(avg * 10.0) / 10.0);
        product.setReviewCount(approvedReviews.size());
        productRepository.save(product);

        return saved;
    }

    public Review toggleReviewApproval(String reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));
        review.setApproved(!review.isApproved());
        return reviewRepository.save(review);
    }

    public void deleteReview(String reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));
        reviewRepository.delete(review);
    }
}
