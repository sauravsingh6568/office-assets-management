package com.officehub.productmanagement.auth.dto;

public class AuthResponse {

    private String token;
    private String userId;
    private String name;
    private String email;
    private String role;

    public AuthResponse(String token, String userId, String name, String email, String role) {
        this.token = token;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public String getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}
