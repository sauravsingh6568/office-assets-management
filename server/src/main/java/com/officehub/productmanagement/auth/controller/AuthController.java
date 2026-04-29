package com.officehub.productmanagement.auth.controller;

import java.security.Principal;
import com.officehub.productmanagement.auth.dto.AuthResponse;
import com.officehub.productmanagement.auth.dto.AdminProfileResponse;
import com.officehub.productmanagement.auth.dto.ChangePasswordRequest;
import com.officehub.productmanagement.auth.dto.LoginRequest;
import com.officehub.productmanagement.auth.dto.RegisterRequest;
import com.officehub.productmanagement.auth.dto.UpdateAdminProfileRequest;
import com.officehub.productmanagement.auth.service.AuthService;
import com.officehub.productmanagement.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<AuthResponse>builder()
                        .message("Admin registered successfully")
                        .data(authService.register(request))
                        .build());
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .message("Login successful")
                .data(authService.login(request))
                .build());
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminProfileResponse>> getCurrentAdmin(Principal principal) {
        return ResponseEntity.ok(ApiResponse.<AdminProfileResponse>builder()
                .message("Admin profile fetched successfully")
                .data(authService.getCurrentAdminProfile(principal.getName()))
                .build());
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AuthResponse>> updateCurrentAdmin(
            Principal principal,
            @Valid @RequestBody UpdateAdminProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .message("Admin profile updated successfully")
                .data(authService.updateCurrentAdminProfile(principal.getName(), request))
                .build());
    }

    @PostMapping("/change-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            Principal principal,
            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(principal.getName(), request);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Password changed successfully")
                .build());
    }
}
