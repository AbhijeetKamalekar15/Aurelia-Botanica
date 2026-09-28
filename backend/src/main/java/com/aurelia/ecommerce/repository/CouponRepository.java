package com.aurelia.ecommerce.repository;

import com.aurelia.ecommerce.model.Coupon;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CouponRepository extends MongoRepository<Coupon, String> {
    Optional<Coupon> findByCodeIgnoreCaseAndActiveTrue(String code);
    Optional<Coupon> findByCodeIgnoreCase(String code);
    Boolean existsByCodeIgnoreCase(String code);
}
