package com.aurelia.ecommerce.repository;

import com.aurelia.ecommerce.model.Order;
import com.aurelia.ecommerce.model.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {

    Optional<Order> findByOrderNumber(String orderNumber);

    Page<Order> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);

    List<Order> findByUserIdOrderByCreatedAtDesc(String userId);

    Page<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status, Pageable pageable);

    long countByStatus(OrderStatus status);

    List<Order> findByCreatedAtBetween(Instant start, Instant end);
}
