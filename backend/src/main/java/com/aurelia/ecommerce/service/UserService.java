package com.aurelia.ecommerce.service;

import com.aurelia.ecommerce.dto.RegisterRequest;
import com.aurelia.ecommerce.exception.BadRequestException;
import com.aurelia.ecommerce.exception.ResourceNotFoundException;
import com.aurelia.ecommerce.model.Address;
import com.aurelia.ecommerce.model.Role;
import com.aurelia.ecommerce.model.User;
import com.aurelia.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = new User(
                request.getName(),
                request.getEmail().toLowerCase(),
                passwordEncoder.encode(request.getPassword()),
                request.getPhone()
        );

        return userRepository.save(user);
    }

    public User findById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public User updateUserProfile(String userId, String name, String phone) {
        User user = findById(userId);
        if (name != null && !name.trim().isEmpty()) {
            user.setName(name);
        }
        if (phone != null) {
            user.setPhone(phone);
        }
        return userRepository.save(user);
    }

    public void changePassword(String userId, String currentPassword, String newPassword) {
        User user = findById(userId);
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new BadRequestException("Current password does not match");
        }
        if (newPassword.length() < 6) {
            throw new BadRequestException("New password must be at least 6 characters long");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public String generatePasswordResetToken(String email) {
        User user = findByEmail(email);
        String token = UUID.randomUUID().toString();
        user.setResetPasswordToken(token);
        user.setResetPasswordTokenExpiry(Instant.now().plus(2, ChronoUnit.HOURS));
        userRepository.save(user);
        return token;
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetPasswordToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid or expired password reset token"));

        if (user.getResetPasswordTokenExpiry() == null || user.getResetPasswordTokenExpiry().isBefore(Instant.now())) {
            throw new BadRequestException("Password reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        userRepository.save(user);
    }

    public Address addAddress(String userId, Address address) {
        User user = findById(userId);
        if (address.getId() == null || address.getId().isEmpty()) {
            address.setId(UUID.randomUUID().toString());
        }

        if (address.isDefault() || user.getAddresses().isEmpty()) {
            user.getAddresses().forEach(a -> a.setDefault(false));
            address.setDefault(true);
        }

        user.getAddresses().add(address);
        userRepository.save(user);
        return address;
    }

    public Address updateAddress(String userId, String addressId, Address updatedAddress) {
        User user = findById(userId);
        Address existing = user.getAddresses().stream()
                .filter(a -> a.getId().equals(addressId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + addressId));

        existing.setHouseFlat(updatedAddress.getHouseFlat());
        existing.setStreet(updatedAddress.getStreet());
        existing.setLandmark(updatedAddress.getLandmark());
        existing.setCity(updatedAddress.getCity());
        existing.setState(updatedAddress.getState());
        existing.setPincode(updatedAddress.getPincode());
        existing.setCountry(updatedAddress.getCountry());

        if (updatedAddress.isDefault()) {
            user.getAddresses().forEach(a -> a.setDefault(false));
            existing.setDefault(true);
        }

        userRepository.save(user);
        return existing;
    }

    public void deleteAddress(String userId, String addressId) {
        User user = findById(userId);
        boolean removed = user.getAddresses().removeIf(a -> a.getId().equals(addressId));
        if (!removed) {
            throw new ResourceNotFoundException("Address not found with id: " + addressId);
        }
        userRepository.save(user);
    }

    public List<String> toggleWishlist(String userId, String productId) {
        User user = findById(userId);
        if (user.getWishlistProductIds().contains(productId)) {
            user.getWishlistProductIds().remove(productId);
        } else {
            user.getWishlistProductIds().add(productId);
        }
        userRepository.save(user);
        return user.getWishlistProductIds();
    }

    public User toggleUserStatus(String userId) {
        User user = findById(userId);
        user.setActive(!user.isActive());
        return userRepository.save(user);
    }
}
