package com.officehub.productmanagement.product.repository;

import com.officehub.productmanagement.product.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProductRepository extends MongoRepository<Product, String> {
    boolean existsBySerialNumberIgnoreCase(String serialNumber);
}
