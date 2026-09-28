package com.aurelia.ecommerce.controller;

import com.aurelia.ecommerce.config.UserPrincipal;
import com.aurelia.ecommerce.dto.ApiResponse;
import com.aurelia.ecommerce.dto.OrderRequest;
import com.aurelia.ecommerce.dto.OrderStatusUpdateRequest;
import com.aurelia.ecommerce.model.Order;
import com.aurelia.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<Order>> placeOrder(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody OrderRequest request) {
        String userId = currentUser != null ? currentUser.getId() : "GUEST";
        Order order = orderService.createOrder(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Order placed successfully with Cash on Delivery", order));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Order>>> getUserOrders(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Order> orders = orderService.getUserOrders(currentUser.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> getOrderDetails(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable String id) {
        Order order = orderService.getOrderById(id);
        // Authorization check: User can only view their own order, unless admin
        boolean isAdmin = currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && !order.getUserId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body(ApiResponse.error("You are not authorized to view this order"));
        }
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrdersForAdmin() {
        return ResponseEntity.ok(ApiResponse.success(orderService.getAllOrdersForAdmin()));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable String id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        Order updated = orderService.updateOrderStatus(id, request.getStatus(), request.getNote());
        return ResponseEntity.ok(ApiResponse.success("Order status updated successfully", updated));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Order>> cancelOrder(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.getOrDefault("reason", "Cancelled by customer") : "Cancelled by customer";
        Order cancelled = orderService.cancelOrderByCustomer(id, currentUser.getId(), reason);
        return ResponseEntity.ok(ApiResponse.success("Order has been cancelled", cancelled));
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<ApiResponse<Order>> requestReturn(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.getOrDefault("reason", "Item damaged or unsatisfied") : "Item damaged or unsatisfied";
        Order returned = orderService.requestReturn(id, currentUser.getId(), reason);
        return ResponseEntity.ok(ApiResponse.success("Return request submitted", returned));
    }
}
