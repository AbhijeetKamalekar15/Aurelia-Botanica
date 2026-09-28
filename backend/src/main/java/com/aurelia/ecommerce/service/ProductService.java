package com.aurelia.ecommerce.service;

import com.aurelia.ecommerce.exception.BadRequestException;
import com.aurelia.ecommerce.exception.ResourceNotFoundException;
import com.aurelia.ecommerce.model.Product;
import com.aurelia.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Page<Product> getProducts(int page, int size, String sortField, String sortDir, String categoryId, String search) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortField).descending() : Sort.by(sortField).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        if (search != null && !search.trim().isEmpty()) {
            return productRepository.searchProducts(search.trim(), pageable);
        }

        if (categoryId != null && !categoryId.trim().isEmpty() && !categoryId.equalsIgnoreCase("all")) {
            return productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable);
        }

        return productRepository.findByActiveTrue(pageable);
    }

    public List<Product> getAllAdminProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findByFeaturedTrueAndActiveTrue();
    }

    public List<Product> getNewArrivals() {
        return productRepository.findByNewArrivalTrueAndActiveTrue();
    }

    public List<Product> getLowStockProducts(int threshold) {
        return productRepository.findLowStockProducts(threshold);
    }

    public Product createProduct(Product product) {
        if (product.getSku() == null || product.getSku().trim().isEmpty()) {
            throw new BadRequestException("SKU is required");
        }
        if (productRepository.existsBySku(product.getSku())) {
            throw new BadRequestException("Product with SKU " + product.getSku() + " already exists");
        }
        return productRepository.save(product);
    }

    public Product updateProduct(String id, Product updated) {
        Product product = getProductById(id);

        if (!product.getSku().equals(updated.getSku()) && productRepository.existsBySku(updated.getSku())) {
            throw new BadRequestException("Product with SKU " + updated.getSku() + " already exists");
        }

        product.setName(updated.getName());
        product.setShortDescription(updated.getShortDescription());
        product.setDescription(updated.getDescription());
        product.setPrice(updated.getPrice());
        product.setDiscountPrice(updated.getDiscountPrice());
        product.setSku(updated.getSku());
        product.setCategoryId(updated.getCategoryId());
        product.setCategoryName(updated.getCategoryName());
        product.setBrand(updated.getBrand());
        product.setImages(updated.getImages());
        product.setStockQuantity(updated.getStockQuantity());
        product.setMinStockThreshold(updated.getMinStockThreshold());
        product.setSpecifications(updated.getSpecifications());
        product.setTags(updated.getTags());
        product.setFeatured(updated.isFeatured());
        product.setNewArrival(updated.isNewArrival());
        product.setActive(updated.isActive());

        return productRepository.save(product);
    }

    public Product updateStock(String id, int quantity) {
        Product product = getProductById(id);
        product.setStockQuantity(quantity);
        return productRepository.save(product);
    }

    public void deleteProduct(String id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
}
