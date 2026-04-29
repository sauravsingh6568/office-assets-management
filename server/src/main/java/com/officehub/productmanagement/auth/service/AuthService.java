package com.officehub.productmanagement.auth.service;

import com.officehub.productmanagement.auth.dto.AuthResponse;
import com.officehub.productmanagement.auth.dto.AdminProfileResponse;
import com.officehub.productmanagement.auth.dto.ChangePasswordRequest;
import com.officehub.productmanagement.auth.dto.LoginRequest;
import com.officehub.productmanagement.auth.dto.RegisterRequest;
import com.officehub.productmanagement.auth.dto.UpdateAdminProfileRequest;
import com.officehub.productmanagement.auth.model.AdminUser;
import com.officehub.productmanagement.auth.model.Role;
import com.officehub.productmanagement.auth.repository.AdminUserRepository;
import com.officehub.productmanagement.common.exception.BadRequestException;
import com.officehub.productmanagement.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            AdminUserRepository adminUserRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (adminUserRepository.count() > 0) {
            throw new BadRequestException("Admin registration is closed. Please use the existing admin account to log in");
        }

        if (adminUserRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Admin email already registered");
        }

        AdminUser user = new AdminUser();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ADMIN);

        AdminUser savedUser = adminUserRepository.save(user);
        String token = jwtService.generateToken(savedUser.getEmail(), savedUser.getRole().name());

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        AdminUser user = adminUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Admin user not found"));
        Role role = resolveRole(user);
        String token = jwtService.generateToken(user.getEmail(), role.name());

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), role.name());
    }

    public AdminProfileResponse getCurrentAdminProfile(String email) {
        AdminUser user = findAdminByEmail(email);
        Role role = resolveRole(user);
        return new AdminProfileResponse(user.getId(), user.getName(), user.getEmail(), role.name());
    }

    public void changePassword(String email, ChangePasswordRequest request) {
        AdminUser user = findAdminByEmail(email);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("New password and confirm password do not match");
        }
        if (request.getCurrentPassword().equals(request.getNewPassword())) {
            throw new BadRequestException("New password must be different from current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        adminUserRepository.save(user);
    }

    public AuthResponse updateCurrentAdminProfile(String currentEmail, UpdateAdminProfileRequest request) {
        AdminUser user = findAdminByEmail(currentEmail);

        String nextEmail = request.getEmail().trim();
        if (!user.getEmail().equalsIgnoreCase(nextEmail) && adminUserRepository.existsByEmail(nextEmail)) {
            throw new BadRequestException("Email is already in use by another admin");
        }

        user.setName(request.getName().trim());
        user.setEmail(nextEmail);

        AdminUser savedUser = adminUserRepository.save(user);
        Role role = resolveRole(savedUser);
        String token = jwtService.generateToken(savedUser.getEmail(), role.name());

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                role.name());
    }

    private AdminUser findAdminByEmail(String email) {
        return adminUserRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Admin user not found"));
    }

    private Role resolveRole(AdminUser user) {
        if (user.getRole() == null) {
            user.setRole(Role.ADMIN);
            adminUserRepository.save(user);
        }

        return user.getRole();
    }
}
