package com.officehub.productmanagement.product.service;

import com.officehub.productmanagement.common.exception.BadRequestException;
import com.officehub.productmanagement.common.exception.ResourceNotFoundException;
import com.officehub.productmanagement.product.model.Product;
import com.officehub.productmanagement.product.repository.ProductRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    public Product createProduct(Product product) {
        product.setId(null);
        product.setSerialNumber(generateUniqueSerialNumber(product.getCategory()));
        return productRepository.save(product);
    }

    public Product updateProduct(String id, Product request) {
        Product product = getProductById(id);
        product.setProductName(request.getProductName());
        product.setCategory(request.getCategory());
        product.setStatus(request.getStatus());
        return productRepository.save(product);
    }

    public void deleteProduct(String id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    private String generateUniqueSerialNumber(String category) {
        String prefix = buildCategoryPrefix(category);

        for (int counter = 1; counter <= 9999; counter++) {
            String candidate = "%s-%03d".formatted(prefix, counter);
            if (!productRepository.existsBySerialNumberIgnoreCase(candidate)) {
                return candidate;
            }
        }

        throw new BadRequestException("Unable to generate a unique serial number for this category");
    }

    private String buildCategoryPrefix(String category) {
        if (category == null || category.isBlank()) {
            return "PRD";
        }

        String normalized = category.trim().toUpperCase(Locale.ROOT).replaceAll("[^A-Z0-9]", "");
        if (normalized.length() >= 3) {
            return normalized.substring(0, 3);
        }

        return (normalized + "PRD").substring(0, 3);
    }
}
