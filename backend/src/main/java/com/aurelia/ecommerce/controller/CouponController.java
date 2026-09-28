package com.aurelia.ecommerce.controller;

import com.aurelia.ecommerce.dto.ApiResponse;
import com.aurelia.ecommerce.dto.CouponValidateRequest;
import com.aurelia.ecommerce.model.Coupon;
import com.aurelia.ecommerce.service.CouponService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    @Autowired
    private CouponService couponService;

    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> validateCoupon(@Valid @RequestBody CouponValidateRequest request) {
        double discount = couponService.calculateDiscount(request.getCode(), request.getSubtotal());
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("valid", true);
        responseData.put("code", request.getCode().toUpperCase());
        responseData.put("discountAmount", discount);
        return ResponseEntity.ok(ApiResponse.success("Coupon applied successfully", responseData));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Coupon>>> getAllCoupons() {
        return ResponseEntity.ok(ApiResponse.success(couponService.getAllCoupons()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Coupon>> getCouponById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(couponService.getCouponById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Coupon>> createCoupon(@Valid @RequestBody Coupon coupon) {
        Coupon created = couponService.createCoupon(coupon);
        return ResponseEntity.ok(ApiResponse.success("Coupon created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Coupon>> updateCoupon(@PathVariable String id, @Valid @RequestBody Coupon coupon) {
        Coupon updated = couponService.updateCoupon(id, coupon);
        return ResponseEntity.ok(ApiResponse.success("Coupon updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteCoupon(@PathVariable String id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok(ApiResponse.success("Coupon deleted successfully", null));
    }
}
