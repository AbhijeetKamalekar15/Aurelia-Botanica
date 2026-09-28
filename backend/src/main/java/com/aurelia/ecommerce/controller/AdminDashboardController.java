package com.aurelia.ecommerce.controller;

import com.aurelia.ecommerce.dto.ApiResponse;
import com.aurelia.ecommerce.dto.DashboardStatsDto;
import com.aurelia.ecommerce.model.Order;
import com.aurelia.ecommerce.model.OrderStatus;
import com.aurelia.ecommerce.model.Product;
import com.aurelia.ecommerce.model.User;
import com.aurelia.ecommerce.repository.OrderRepository;
import com.aurelia.ecommerce.repository.ProductRepository;
import com.aurelia.ecommerce.repository.UserRepository;
import com.aurelia.ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats() {
        List<Order> orders = orderRepository.findAll();
        List<Product> products = productRepository.findAll();
        long totalCustomers = userRepository.count();

        double totalSales = 0.0;
        long pendingOrders = 0;
        long deliveredOrders = 0;
        long cancelledOrders = 0;
        Map<String, Long> statusDistribution = new HashMap<>();

        for (Order order : orders) {
            OrderStatus status = order.getStatus();
            statusDistribution.put(status.name(), statusDistribution.getOrDefault(status.name(), 0L) + 1);

            if (status == OrderStatus.DELIVERED) {
                totalSales += order.getTotalAmount();
                deliveredOrders++;
            } else if (status == OrderStatus.PENDING) {
                pendingOrders++;
            } else if (status == OrderStatus.CANCELLED) {
                cancelledOrders++;
            }
        }

        long lowStockCount = products.stream()
                .filter(p -> p.getStockQuantity() <= p.getMinStockThreshold())
                .count();

        DashboardStatsDto stats = new DashboardStatsDto();
        stats.setTotalSales(Math.round(totalSales * 100.0) / 100.0);
        stats.setTotalOrders((long) orders.size());
        stats.setTotalCustomers(totalCustomers);
        stats.setTotalProducts((long) products.size());
        stats.setPendingOrders(pendingOrders);
        stats.setDeliveredOrders(deliveredOrders);
        stats.setCancelledOrders(cancelledOrders);
        stats.setLowStockProductsCount(lowStockCount);
        stats.setOrderStatusDistribution(statusDistribution);

        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/customers")
    public ResponseEntity<ApiResponse<List<User>>> getCustomers() {
        List<User> users = userService.findAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PatchMapping("/customers/{id}/toggle-status")
    public ResponseEntity<ApiResponse<User>> toggleCustomerStatus(@PathVariable String id) {
        User updated = userService.toggleUserStatus(id);
        return ResponseEntity.ok(ApiResponse.success("User status changed", updated));
    }
}
