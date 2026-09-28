package com.aurelia.ecommerce.controller;

import com.aurelia.ecommerce.config.UserPrincipal;
import com.aurelia.ecommerce.dto.ApiResponse;
import com.aurelia.ecommerce.dto.ReviewRequest;
import com.aurelia.ecommerce.model.Review;
import com.aurelia.ecommerce.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<Review>>> getProductReviews(@PathVariable String productId) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getApprovedReviewsForProduct(productId)));
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<Review>> submitReview(
            @PathVariable String productId,
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ReviewRequest request) {
        Review review = reviewService.addReview(productId, currentUser.getId(), currentUser.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Thank you! Your review has been submitted.", review));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Review>>> getAllReviewsForAdmin() {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getAllReviewsForAdmin()));
    }

    @PatchMapping("/admin/{id}/toggle-approval")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Review>> toggleReviewApproval(@PathVariable String id) {
        Review review = reviewService.toggleReviewApproval(id);
        return ResponseEntity.ok(ApiResponse.success("Review status updated", review));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteReview(@PathVariable String id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(ApiResponse.success("Review deleted successfully", null));
    }
}
