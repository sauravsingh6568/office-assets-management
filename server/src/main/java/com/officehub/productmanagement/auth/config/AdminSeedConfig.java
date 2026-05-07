package com.officehub.productmanagement.auth.config;

import com.officehub.productmanagement.auth.model.AdminUser;
import com.officehub.productmanagement.auth.model.Role;
import com.officehub.productmanagement.auth.repository.AdminUserRepository;
import com.mongodb.MongoException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminSeedConfig {

    private static final Logger logger = LoggerFactory.getLogger(AdminSeedConfig.class);

    @Bean
    public CommandLineRunner seedAdminUser(
            AdminUserRepository adminUserRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.seed.name}") String adminName,
            @Value("${app.admin.seed.email}") String adminEmail,
            @Value("${app.admin.seed.password}") String adminPassword) {
        return args -> {
            if (adminName == null || adminName.isBlank()
                    || adminEmail == null || adminEmail.isBlank()
                    || adminPassword == null || adminPassword.isBlank()) {
                logger.info("Admin seed skipped because ADMIN_SEED_NAME, ADMIN_SEED_EMAIL, or ADMIN_SEED_PASSWORD is not configured");
                return;
            }

            try {
                if (adminUserRepository.count() > 0) {
                    logger.info("Admin seed skipped because admin_users already contains at least one record");
                    return;
                }

                AdminUser adminUser = new AdminUser();
                adminUser.setName(adminName);
                adminUser.setEmail(adminEmail);
                adminUser.setPassword(passwordEncoder.encode(adminPassword));
                adminUser.setRole(Role.ADMIN);

                adminUserRepository.save(adminUser);
                logger.info("Seeded default admin user with email: {}", adminEmail);
                logger.info("Default admin password source: app.admin.seed.password");
            } catch (DataAccessResourceFailureException | MongoException exception) {
                logger.warn(
                        "Admin seed skipped because the database is currently unavailable: {}",
                        exception.getMessage());
            }
        };
    }
}
