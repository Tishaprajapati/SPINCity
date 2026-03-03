package com.spincity.controller.user;

import com.spincity.dto.customer.ApiResponse;
import com.spincity.dto.customer.LoginRequest;
import com.spincity.dto.customer.SignupDTO;
import com.spincity.model.customer.Customer;
import com.spincity.repository.customer.CustomerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.spincity.security.JwtUtil;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/customer")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerAuthController {

    private final CustomerRepository customerRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public CustomerAuthController(
            CustomerRepository customerRepository,
            JwtUtil jwtUtil,
            BCryptPasswordEncoder passwordEncoder) {

        this.customerRepository = customerRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }



    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody SignupDTO signupDTO) {
        try {
            // Validation
            if (signupDTO.getFullName() == null || signupDTO.getFullName().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Full name is required", null));
            }

            if (signupDTO.getEmail() == null || signupDTO.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Email is required", null));
            }

            if (signupDTO.getPassword() == null || signupDTO.getPassword().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Password is required", null));
            }

            if (!signupDTO.getPassword().equals(signupDTO.getConfirmPassword())) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Passwords do not match", null));
            }

            if (customerRepository.findByCustomerEmail(signupDTO.getEmail()).isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Email already registered", null));
            }

            if (signupDTO.getPhone() != null && !signupDTO.getPhone().trim().isEmpty()) {
                if (customerRepository.findByCustomerPhone(signupDTO.getPhone()).isPresent()) {
                    return ResponseEntity.badRequest()
                            .body(new ApiResponse(false, "Phone number already registered", null));
                }
            }

            // Map DTO to Entity
            Customer customer = new Customer();
            customer.setCustomerName(signupDTO.getFullName().trim());
            customer.setCustomerEmail(signupDTO.getEmail().trim().toLowerCase());
            customer.setCustomerPhone(signupDTO.getPhone() != null ? signupDTO.getPhone().trim() : null);

            // TODO: Add password hashing here (use BCrypt)
            // Hash password before saving

// ✅ FIX HERE
            String encodedPassword = passwordEncoder.encode(signupDTO.getPassword());
            customer.setPassword(encodedPassword);

            customer.setFavFood(signupDTO.getFavFood());
            customer.setFavSport(signupDTO.getFavSport());
            // Calculate age from date of birth
            Integer age = calculateAge(signupDTO.getDateOfBirth());
            customer.setCustomerAge(age);

            // Build address
            StringBuilder addressBuilder = new StringBuilder();
            if (signupDTO.getAddress() != null && !signupDTO.getAddress().trim().isEmpty()) {
                addressBuilder.append(signupDTO.getAddress().trim());
            }
            if (signupDTO.getCity() != null && !signupDTO.getCity().trim().isEmpty()) {
                if (addressBuilder.length() > 0) addressBuilder.append(", ");
                addressBuilder.append(signupDTO.getCity().trim());
            }
            if (signupDTO.getState() != null && !signupDTO.getState().trim().isEmpty()) {
                if (addressBuilder.length() > 0) addressBuilder.append(", ");
                addressBuilder.append(signupDTO.getState().trim());
            }
            if (signupDTO.getPincode() != null && !signupDTO.getPincode().trim().isEmpty()) {
                if (addressBuilder.length() > 0) addressBuilder.append(" - ");
                addressBuilder.append(signupDTO.getPincode().trim());
            }
            customer.setCustomerAddress(addressBuilder.toString());

            // Set emergency contact fields
            customer.setEmergencyContact(signupDTO.getEmergencyContact() != null ?
                    signupDTO.getEmergencyContact().trim() : null);
            customer.setEmergencyName(signupDTO.getEmergencyName() != null ?
                    signupDTO.getEmergencyName().trim() : null);




            // Set default values for required fields

            // ✅ REPLACE WITH THIS
            customer.setIdProofType(signupDTO.getIdProofType() != null
                    ? signupDTO.getIdProofType() : null);
            customer.setIdProofDocument(signupDTO.getIdProofDocument() != null
                    ? signupDTO.getIdProofDocument() : null);
            customer.setRegistrationDate(LocalDate.now());
            customer.setMembershipType("BASIC");
            customer.setWalletBalance(0.0);


            Customer savedCustomer = customerRepository.save(customer);

            // Don't send password back
            savedCustomer.setPassword(null);

            return ResponseEntity.ok(new ApiResponse(true, "Registration successful", savedCustomer));

        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Invalid date format. Please use DD-MM-YYYY", null));
        } catch (Exception e) {
            e.printStackTrace(); // Log the error for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Registration failed: " + e.getMessage(), null));
        }
    }
    @PostMapping("/upload-id-proof")
    public ResponseEntity<?> uploadIdProof(
            @RequestParam("file") MultipartFile file) {
        try {
            System.out.println(">>> contentType = " + file.getContentType());
            System.out.println(">>> filename = " + file.getOriginalFilename());
            System.out.println(">>> size = " + file.getSize());

            String contentType = file.getContentType();

            if (contentType == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Could not determine file type"));
            }

            if (!contentType.startsWith("image/") &&
                    !contentType.equals("application/pdf")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Only images or PDF allowed. Got: " + contentType));
            }

            // ✅ USE ABSOLUTE PATH — saves in project root
            String uploadDir = System.getProperty("user.dir") + "/uploads/idproofs/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs(); // ✅ auto creates folders

            String filename = System.currentTimeMillis() + "_" +
                    file.getOriginalFilename().replaceAll("[^a-zA-Z0-9._-]", "_");

            File destFile = new File(uploadDir + filename);
            file.transferTo(destFile.getAbsoluteFile()); // ✅ absolute path

            System.out.println(">>> Saved to: " + destFile.getAbsolutePath());

            return ResponseEntity.ok(Map.of(
                    "filePath", "/uploads/idproofs/" + filename,
                    "message", "File uploaded successfully"
            ));

        } catch (Exception e) {
            System.out.println(">>> Upload error: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Email is required", null));
            }

            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Password is required", null));
            }

            Customer customer = customerRepository.findByCustomerEmail(request.getEmail().trim().toLowerCase())
                    .orElse(null);

            if (customer == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Invalid email or password", null));
            }

            // TODO: Use BCrypt password matching here
            if (!passwordEncoder.matches(request.getPassword().trim(), customer.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse(false, "Invalid email or password", null));
            }

            // Don't send password back
            String token = jwtUtil.generateToken(
                    customer.getCustomerEmail(),
                    "CUSTOMER"
            );

            customer.setPassword(null);

            return ResponseEntity.ok(
                    Map.of(
                            "token", token,
                            "user", customer
                    )
            );


        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Login failed: " + e.getMessage(), null));
        }
    }

    /**
     * Helper method to calculate age from date of birth
     * Supports formats: DD-MM-YYYY, YYYY-MM-DD
     */
    private Integer calculateAge(String dateOfBirth) {
        if (dateOfBirth == null || dateOfBirth.trim().isEmpty()) {
            return null;
        }

        try {
            LocalDate birthDate;

            // Try DD-MM-YYYY format first (from your frontend)
            if (dateOfBirth.contains("-") && dateOfBirth.indexOf("-") < 4) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
                birthDate = LocalDate.parse(dateOfBirth, formatter);
            }
            // Try YYYY-MM-DD format
            else {
                birthDate = LocalDate.parse(dateOfBirth);
            }

            LocalDate currentDate = LocalDate.now();
            int age = currentDate.getYear() - birthDate.getYear();

            // Adjust age if birthday hasn't occurred yet this year
            if (currentDate.getMonthValue() < birthDate.getMonthValue() ||
                    (currentDate.getMonthValue() == birthDate.getMonthValue() &&
                            currentDate.getDayOfMonth() < birthDate.getDayOfMonth())) {
                age--;
            }

            return age;

        } catch (DateTimeParseException e) {
            throw new DateTimeParseException("Invalid date format: " + dateOfBirth, dateOfBirth, 0);
        }
    }
}