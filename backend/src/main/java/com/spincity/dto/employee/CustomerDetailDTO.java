package com.spincity.dto.employee;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDetailDTO {

    // Basic info
    private Integer customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String customerAddress;
    private String idProofUrl;  // ADD THIS
    // Membership info
    private String membershipType;
    private String membershipStatus;
    private LocalDate membershipStart;
    private LocalDate membershipEnd;

    // Ride stats
    private Long totalRides;
    private Double walletBalance;
}