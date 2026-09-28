package com.aurelia.ecommerce.model;

public class OrderItem {

    private String productId;
    private String productName;
    private String sku;
    private String imageUrl;
    private Double price;
    private Integer quantity;
    private Double total;

    public OrderItem() {
    }

    public OrderItem(String productId, String productName, String sku, String imageUrl, Double price, Integer quantity) {
        this.productId = productId;
        this.productName = productName;
        this.sku = sku;
        this.imageUrl = imageUrl;
        this.price = price;
        this.quantity = quantity;
        this.total = price * quantity;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }
}
