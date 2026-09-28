package com.aurelia.ecommerce.service;

import com.aurelia.ecommerce.exception.BadRequestException;
import com.aurelia.ecommerce.exception.ResourceNotFoundException;
import com.aurelia.ecommerce.model.Coupon;
import com.aurelia.ecommerce.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class CouponService {

    @Autowired
    private CouponRepository couponRepository;

    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    public Coupon getCouponById(String id) {
        return couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", "id", id));
    }

    public Coupon createCoupon(Coupon coupon) {
        if (couponRepository.existsByCodeIgnoreCase(coupon.getCode())) {
            throw new BadRequestException("Coupon with code " + coupon.getCode() + " already exists");
        }
        return couponRepository.save(coupon);
    }

    public Coupon updateCoupon(String id, Coupon updated) {
        Coupon coupon = getCouponById(id);
        coupon.setDescription(updated.getDescription());
        coupon.setDiscountType(updated.getDiscountType());
        coupon.setDiscountValue(updated.getDiscountValue());
        coupon.setMinOrderValue(updated.getMinOrderValue());
        coupon.setMaxDiscountAmount(updated.getMaxDiscountAmount());
        coupon.setExpiryDate(updated.getExpiryDate());
        coupon.setUsageLimit(updated.getUsageLimit());
        coupon.setActive(updated.isActive());
        return couponRepository.save(coupon);
    }

    public void deleteCoupon(String id) {
        Coupon coupon = getCouponById(id);
        couponRepository.delete(coupon);
    }

    public double calculateDiscount(String code, double subtotal) {
        Coupon coupon = couponRepository.findByCodeIgnoreCaseAndActiveTrue(code)
                .orElseThrow(() -> new BadRequestException("Invalid or expired coupon code: " + code));

        if (coupon.getExpiryDate() != null && coupon.getExpiryDate().isBefore(Instant.now())) {
            throw new BadRequestException("Coupon has expired");
        }

        if (coupon.getTimesUsed() >= coupon.getUsageLimit()) {
            throw new BadRequestException("Coupon usage limit has been reached");
        }

        if (subtotal < coupon.getMinOrderValue()) {
            throw new BadRequestException("Minimum order value for coupon " + code + " is " + coupon.getMinOrderValue());
        }

        double discount = 0.0;
        if (coupon.getDiscountType() == Coupon.DiscountType.PERCENTAGE) {
            discount = (subtotal * coupon.getDiscountValue()) / 100.0;
            if (coupon.getMaxDiscountAmount() != null && coupon.getMaxDiscountAmount() > 0) {
                discount = Math.min(discount, coupon.getMaxDiscountAmount());
            }
        } else {
            discount = Math.min(coupon.getDiscountValue(), subtotal);
        }

        return Math.round(discount * 100.0) / 100.0;
    }

    public void incrementUsage(String code) {
        couponRepository.findByCodeIgnoreCase(code).ifPresent(c -> {
            c.setTimesUsed(c.getTimesUsed() + 1);
            couponRepository.save(c);
        });
    }
}
