package com.spincity.controller.user;

import com.spincity.dto.request.UpdateProfileRequest;
import com.spincity.model.customer.Customer;
import com.spincity.service.user.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user/profile")
@CrossOrigin(origins = {"http://localhost:5173", "https://spin-city.vercel.app"})
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    /**
     * Get user profile
     * GET /api/user/profile/{customerId}
     */
//    @GetMapping("/{customerId}")
//    public ResponseEntity<?> getProfile(@PathVariable Integer customerId) {
//        try {
//            Customer customer = profileService.getProfile(customerId);
//            return ResponseEntity.ok(customer);
//        } catch (Exception e) {
//            Map<String, String> error = new HashMap<>();
//            error.put("error", e.getMessage());
//            return ResponseEntity.badRequest().body(error);
//        }
//    }


    @GetMapping("/{customerId}")
    public ResponseEntity<?> getProfile(@PathVariable Integer customerId) {
        try {
            Customer customer = profileService.getProfile(customerId);
            return ResponseEntity.ok(customer);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }


    /**
     * Update user profile
     * PUT /api/user/profile/{customerId}
     * Body: { "customerName": "New Name", "customerPhone": "1234567890", ... }
     */
    @PutMapping("/{customerId}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Integer customerId,
            @RequestBody UpdateProfileRequest request) {
        try {
            Customer updatedCustomer = profileService.updateProfile(customerId, request);
            return ResponseEntity.ok(updatedCustomer);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}