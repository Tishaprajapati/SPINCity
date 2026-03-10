package com.spincity.dto.employee;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalRequestDTO {
    private Integer customerId;  // ADD THIS
    private Long transactionId;
    private String customerName;
    private String customerPhone;
    private String cycleName;
    private String cycleType;
    private String depositStatus;
    private String paymentStatus;
    private LocalDateTime rentalStartTime;

}