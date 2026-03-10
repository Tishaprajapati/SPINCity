package com.spincity.dto.employee;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RiderListDTO {
    private Integer customerId;
    private Long transactionId;
    private String customerName;
    private String customerPhone;
    private String cycleName;
    private String rentalStatus;
    private String depositStatus;
    private LocalDateTime rentalStartTime;
    private LocalDateTime rentalEndTime;
}