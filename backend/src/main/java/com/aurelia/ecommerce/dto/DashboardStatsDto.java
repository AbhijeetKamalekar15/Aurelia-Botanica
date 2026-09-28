package com.aurelia.ecommerce.dto;

import java.util.Map;

public class DashboardStatsDto {

    private Double totalSales;
    private Long totalOrders;
    private Long totalCustomers;
    private Long totalProducts;
    private Long pendingOrders;
    private Long deliveredOrders;
    private Long cancelledOrders;
    private Long lowStockProductsCount;

    private Map<String, Long> orderStatusDistribution;
    private Map<String, Double> monthlySales;

    public DashboardStatsDto() {
    }

    public Double getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(Double totalSales) {
        this.totalSales = totalSales;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public Long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(Long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public Long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(Long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public Long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(Long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public Long getDeliveredOrders() {
        return deliveredOrders;
    }

    public void setDeliveredOrders(Long deliveredOrders) {
        this.deliveredOrders = deliveredOrders;
    }

    public Long getCancelledOrders() {
        return cancelledOrders;
    }

    public void setCancelledOrders(Long cancelledOrders) {
        this.cancelledOrders = cancelledOrders;
    }

    public Long getLowStockProductsCount() {
        return lowStockProductsCount;
    }

    public void setLowStockProductsCount(Long lowStockProductsCount) {
        this.lowStockProductsCount = lowStockProductsCount;
    }

    public Map<String, Long> getOrderStatusDistribution() {
        return orderStatusDistribution;
    }

    public void setOrderStatusDistribution(Map<String, Long> orderStatusDistribution) {
        this.orderStatusDistribution = orderStatusDistribution;
    }

    public Map<String, Double> getMonthlySales() {
        return monthlySales;
    }

    public void setMonthlySales(Map<String, Double> monthlySales) {
        this.monthlySales = monthlySales;
    }
}
