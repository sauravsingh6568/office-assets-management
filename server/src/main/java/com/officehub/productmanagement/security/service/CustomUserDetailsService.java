package com.officehub.productmanagement.security.service;

import com.officehub.productmanagement.auth.model.AdminUser;
import com.officehub.productmanagement.auth.model.Role;
import com.officehub.productmanagement.auth.repository.AdminUserRepository;
import java.util.Collections;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminUserRepository adminUserRepository;

    public CustomUserDetailsService(AdminUserRepository adminUserRepository) {
        this.adminUserRepository = adminUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        AdminUser user = adminUserRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Admin user not found"));
        Role role = user.getRole();
        if (role == null) {
            user.setRole(Role.ADMIN);
            adminUserRepository.save(user);
            role = Role.ADMIN;
        }

        return new User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name())));
    }
}
