package com.spincity.dto.employee;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RideHistoryRowDTO {
    private Long transactionId;
    private String customerName;
    private String customerPhone;
    private String cycleName;
    private String pickupStation;
    private String returnStation;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer durationMinutes;
    private Double totalAmount;
    private String paymentStatus;
    private String depositStatus;
    private String rentalStatus;
}