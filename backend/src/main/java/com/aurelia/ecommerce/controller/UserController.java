package com.aurelia.ecommerce.controller;

import com.aurelia.ecommerce.config.UserPrincipal;
import com.aurelia.ecommerce.dto.ApiResponse;
import com.aurelia.ecommerce.model.Address;
import com.aurelia.ecommerce.model.Product;
import com.aurelia.ecommerce.model.User;
import com.aurelia.ecommerce.repository.ProductRepository;
import com.aurelia.ecommerce.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<User>> getProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        User user = userService.findById(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<User>> updateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody Map<String, String> body) {
        String name = body.get("name");
        String phone = body.get("phone");
        User updated = userService.updateUserProfile(currentUser.getId(), name, phone);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody Map<String, String> body) {
        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");
        userService.changePassword(currentUser.getId(), currentPassword, newPassword);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }

    @PostMapping("/addresses")
    public ResponseEntity<ApiResponse<Address>> addAddress(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody Address address) {
        Address saved = userService.addAddress(currentUser.getId(), address);
        return ResponseEntity.ok(ApiResponse.success("Address added", saved));
    }

    @PutMapping("/addresses/{addressId}")
    public ResponseEntity<ApiResponse<Address>> updateAddress(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable String addressId,
            @Valid @RequestBody Address address) {
        Address updated = userService.updateAddress(currentUser.getId(), addressId, address);
        return ResponseEntity.ok(ApiResponse.success("Address updated", updated));
    }

    @DeleteMapping("/addresses/{addressId}")
    public ResponseEntity<ApiResponse<String>> deleteAddress(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable String addressId) {
        userService.deleteAddress(currentUser.getId(), addressId);
        return ResponseEntity.ok(ApiResponse.success("Address deleted", null));
    }

    @PostMapping("/wishlist/{productId}")
    public ResponseEntity<ApiResponse<List<String>>> toggleWishlist(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable String productId) {
        List<String> wishlist = userService.toggleWishlist(currentUser.getId(), productId);
        return ResponseEntity.ok(ApiResponse.success("Wishlist updated", wishlist));
    }

    @GetMapping("/wishlist")
    public ResponseEntity<ApiResponse<List<Product>>> getWishlistProducts(@AuthenticationPrincipal UserPrincipal currentUser) {
        User user = userService.findById(currentUser.getId());
        List<Product> products = productRepository.findAllById(user.getWishlistProductIds());
        return ResponseEntity.ok(ApiResponse.success(products));
    }
}
