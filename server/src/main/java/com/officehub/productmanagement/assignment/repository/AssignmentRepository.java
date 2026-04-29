package com.officehub.productmanagement.assignment.repository;

import com.officehub.productmanagement.assignment.model.Assignment;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AssignmentRepository extends MongoRepository<Assignment, String> {

    Optional<Assignment> findByProductIdAndStatusIgnoreCase(String productId, String status);
}
