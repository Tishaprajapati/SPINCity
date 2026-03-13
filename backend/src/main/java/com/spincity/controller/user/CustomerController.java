package com.spincity.controller.user;

import com.spincity.dto.request.UpdateProfileRequest;
import com.spincity.model.customer.Customer;
import com.spincity.service.user.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    // Register new customer
    @PostMapping("/register")
    public Customer registerCustomer(@RequestBody Customer customer) {
        return customerService.registerCustomer(customer);
    }

    // Get all customers

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    // Get customer by ID
    @GetMapping("/{id}")
    public Customer getCustomerById(@PathVariable Integer id) {
        return customerService.getCustomerById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    // Update customer
    @PutMapping("/{id}")
    public Customer updateCustomer(
            @PathVariable Integer id,
            @RequestBody UpdateProfileRequest dto) {

        return customerService.updateCustomer(id, dto);
    }

    // Delete customer
    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable Integer id) {
        customerService.deleteCustomer(id);
    }

    @PostMapping("/contact")
    public ResponseEntity<?> contact(@RequestBody Map<String, String> body) {
        try {
            String name    = body.get("name");
            String email   = body.get("email");
            String phone   = body.get("phone");
            String subject = body.get("subject");
            String message = body.get("message");

            // Basic validation
            if (name == null || email == null || message == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Name, email and message are required"));
            }

            boolean success = customerService
                    .sendContactEmail(name, email, phone, subject, message);

            if (success) {
                return ResponseEntity.ok(
                        Map.of("message", "Message sent successfully!"));
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Failed to send message"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }


    @PostMapping("/forgot-password")
    public ResponseEntity<?> processForgotPassword(
            @RequestBody Map<String,String> body) {
        System.out.println("BODY RECEIVED -> " + body);
        String email = body.get("email");
        System.out.println("EMAIL -> '" + email + "'");
        String favFood = body.get("favFood");
        String favSport = body.get("favSport");

        boolean success = customerService
                .verifySecurityAnswersAndSendPassword(email,favFood,favSport);

        return ResponseEntity.ok(success);
    }


    // ✅ User toggles their own notifications
    @PutMapping("/{id}/notifications")
    public ResponseEntity<?> toggleNotifications(
            @PathVariable Integer id,
            @RequestBody Map<String, Boolean> body) {
        try {
            boolean enabled = body.get("enabled");
            customerService.toggleNotifications(id, enabled);
            return ResponseEntity.ok(Map.of(
                    "message", "Notifications " + (enabled ? "enabled" : "disabled") + " successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ Admin sends bulk notification
    @PostMapping("/notifications/send")
    public ResponseEntity<?> sendBulkNotification(
            @RequestBody Map<String, String> body) {
        try {
            String subject = body.get("subject");
            String message = body.get("message");

            if (subject == null || message == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Subject and message are required"));
            }

            customerService.sendBulkNotification(subject, message);
            return ResponseEntity.ok(Map.of("message", "Notifications sent successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body) {
        try {
            String currentPassword = body.get("currentPassword");
            String newPassword = body.get("newPassword");
            String confirmPassword = body.get("confirmPassword");

            if (!newPassword.equals(confirmPassword)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "New passwords do not match"));
            }

            boolean success = customerService.changePassword(
                    id, currentPassword, newPassword);

            if (success) {
                return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Current password is incorrect"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }


    }


}
