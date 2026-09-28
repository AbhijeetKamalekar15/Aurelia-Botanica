package com.aurelia.ecommerce.service;

import com.aurelia.ecommerce.dto.OrderRequest;
import com.aurelia.ecommerce.exception.BadRequestException;
import com.aurelia.ecommerce.exception.ResourceNotFoundException;
import com.aurelia.ecommerce.model.*;
import com.aurelia.ecommerce.repository.OrderRepository;
import com.aurelia.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CouponService couponService;

    public Order createOrder(String userId, OrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Order cannot be empty");
        }

        // Strict Enforcement: Payment MUST be Cash on Delivery
        if (request.getPaymentMethod() != null && request.getPaymentMethod() != PaymentMethod.CASH_ON_DELIVERY) {
            throw new BadRequestException("Only Cash on Delivery (COD) payment method is accepted.");
        }

        List<OrderItem> verifiedItems = new ArrayList<>();
        double calculatedSubtotal = 0.0;

        // Verify and decrement stocks server-side
        for (OrderRequest.OrderItemDto itemDto : request.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", itemDto.getProductId()));

            if (!product.isActive()) {
                throw new BadRequestException("Product '" + product.getName() + "' is currently unavailable");
            }

            if (product.getStockQuantity() < itemDto.getQuantity()) {
                throw new BadRequestException("Insufficient stock for product '" + product.getName() + "'. Available: " + product.getStockQuantity());
            }

            double activePrice = (product.getDiscountPrice() != null && product.getDiscountPrice() > 0)
                    ? product.getDiscountPrice()
                    : product.getPrice();

            OrderItem orderItem = new OrderItem(
                    product.getId(),
                    product.getName(),
                    product.getSku(),
                    product.getImages() != null && !product.getImages().isEmpty() ? product.getImages().get(0) : "",
                    activePrice,
                    itemDto.getQuantity()
            );

            verifiedItems.add(orderItem);
            calculatedSubtotal += orderItem.getTotal();

            // Decrement stock
            product.setStockQuantity(product.getStockQuantity() - itemDto.getQuantity());
            productRepository.save(product);
        }

        // Coupon calculation on server-side
        double discountAmount = 0.0;
        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            discountAmount = couponService.calculateDiscount(request.getCouponCode().trim(), calculatedSubtotal);
            couponService.incrementUsage(request.getCouponCode().trim());
        }

        // Shipping fee calculation: Free delivery above 1000, else 100
        double shippingFee = calculatedSubtotal >= 1000.0 ? 0.0 : 100.0;
        double finalTotal = Math.max(0.0, calculatedSubtotal - discountAmount + shippingFee);

        Order order = new Order();
        order.setOrderNumber("AUR-" + System.currentTimeMillis() % 1000000);
        order.setUserId(userId);
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setShippingAddress(request.getShippingAddress());
        order.setPaymentMethod(PaymentMethod.CASH_ON_DELIVERY);
        order.setStatus(OrderStatus.PENDING);
        order.setItems(verifiedItems);
        order.setSubtotal(calculatedSubtotal);
        order.setDiscount(discountAmount);
        order.setShippingFee(shippingFee);
        order.setTotalAmount(finalTotal);
        order.setCouponCode(request.getCouponCode());
        order.setCustomerNotes(request.getCustomerNotes());

        // Initialize status timeline
        Order.StatusTimelineEntry entry = new Order.StatusTimelineEntry(
                OrderStatus.PENDING,
                "Order placed successfully with Cash on Delivery. Payment will be collected upon delivery.",
                Instant.now()
        );
        order.getStatusHistory().add(entry);

        return orderRepository.save(order);
    }

    public Order getOrderById(String orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
    }

    public Page<Order> getUserOrders(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    public List<Order> getAllOrdersForAdmin() {
        return orderRepository.findAll();
    }

    public Page<Order> getAllOrdersPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findAll(pageable);
    }

    public Order updateOrderStatus(String orderId, OrderStatus newStatus, String note) {
        Order order = getOrderById(orderId);
        OrderStatus oldStatus = order.getStatus();

        // If cancelling an order, restore product stocks
        if (newStatus == OrderStatus.CANCELLED && oldStatus != OrderStatus.CANCELLED) {
            for (OrderItem item : order.getItems()) {
                productRepository.findById(item.getProductId()).ifPresent(product -> {
                    product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                    productRepository.save(product);
                });
            }
        }

        order.setStatus(newStatus);
        String timelineNote = (note != null && !note.trim().isEmpty())
                ? note
                : "Order status transitioned to " + newStatus.name();

        order.getStatusHistory().add(new Order.StatusTimelineEntry(newStatus, timelineNote, Instant.now()));
        return orderRepository.save(order);
    }

    public Order cancelOrderByCustomer(String orderId, String userId, String reason) {
        Order order = getOrderById(orderId);

        if (!order.getUserId().equals(userId)) {
            throw new BadRequestException("You are not authorized to cancel this order");
        }

        if (order.getStatus() == OrderStatus.SHIPPED ||
            order.getStatus() == OrderStatus.OUT_FOR_DELIVERY ||
            order.getStatus() == OrderStatus.DELIVERED) {
            throw new BadRequestException("Order cannot be cancelled as it is already " + order.getStatus().name().toLowerCase());
        }

        order.setCancellationReason(reason);
        return updateOrderStatus(orderId, OrderStatus.CANCELLED, "Cancelled by customer: " + reason);
    }

    public Order requestReturn(String orderId, String userId, String reason) {
        Order order = getOrderById(orderId);
        if (!order.getUserId().equals(userId)) {
            throw new BadRequestException("You are not authorized to request return for this order");
        }
        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new BadRequestException("Return can only be requested for delivered orders");
        }

        order.setReturnReason(reason);
        return updateOrderStatus(orderId, OrderStatus.RETURN_REQUESTED, "Return requested by customer: " + reason);
    }
}
