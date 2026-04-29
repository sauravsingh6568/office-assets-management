package com.officehub.productmanagement.auth.repository;

import com.officehub.productmanagement.auth.model.AdminUser;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AdminUserRepository extends MongoRepository<AdminUser, String> {
    Optional<AdminUser> findByEmail(String email);
    boolean existsByEmail(String email);
}
