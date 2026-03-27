package com.spincity.controller.employee;

import com.spincity.model.employee.Staff;
import com.spincity.dto.customer.LoginRequest;
import com.spincity.repository.employee.StaffRepository;
import com.spincity.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth/staff")
@CrossOrigin(origins = {"http://localhost:5173", "https://spin-city.vercel.app"})
public class StaffAuthController {

    private final StaffRepository staffRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public StaffAuthController(
            StaffRepository staffRepository,
            JwtUtil jwtUtil,
            BCryptPasswordEncoder passwordEncoder
    ) {
        this.staffRepository = staffRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }


@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {

    String email = request.getEmail() == null ? null : request.getEmail().trim().toLowerCase();
    String rawPassword = request.getPassword() == null ? null : request.getPassword().trim();

    System.out.println("🔵 Login attempt for: " + email);

    if (email == null || email.isBlank()) {
        return ResponseEntity.badRequest().body("Email is required");
    }
    if (rawPassword == null || rawPassword.isEmpty()) {
        return ResponseEntity.badRequest().body("Password is required");
    }

    Optional<Staff> staffOpt = staffRepository.findByEmail(email);

    if (staffOpt.isEmpty()) {
        System.out.println("❌ User not found: " + email);
        return ResponseEntity.status(404).body("User not found");
    }

    Staff staff = staffOpt.get();
    System.out.println("✅ User found: " + staff.getEmail() + " | Role: " + staff.getRole());
    if (staff.getPassword() != null) {
        System.out.println("🔐 Password length in DB: " + staff.getPassword().length());
    } else {
        System.out.println("🔐 Password in DB is null");
    }

    boolean matches = staff.getPassword() != null && passwordEncoder.matches(rawPassword, staff.getPassword());
    System.out.println("🔑 Password match: " + matches);

    if (!matches) {
        System.out.println("❌ Invalid password");
        return ResponseEntity.status(401).body("Invalid password");
    }

    String token = jwtUtil.generateToken(staff.getEmail(), staff.getRole());

    staff.setPassword(null);

    return ResponseEntity.ok(Map.of(
            "token", token,
            "role", staff.getRole(),
            "user", staff
    ));
}
}
