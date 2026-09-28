package com.aurelia.ecommerce.dto;

import com.aurelia.ecommerce.model.Role;

import java.util.Set;

public class AuthResponse {

    private String token;
    private String tokenType = "Bearer";
    private String id;
    private String name;
    private String email;
    private String phone;
    private Set<Role> roles;

    public AuthResponse() {
    }

    public AuthResponse(String token, String id, String name, String email, String phone, Set<Role> roles) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.roles = roles;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }
}
