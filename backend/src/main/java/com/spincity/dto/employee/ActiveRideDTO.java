package com.spincity.dto.employee;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActiveRideDTO {
    private Long transactionId;
    private String customerName;
    private String customerPhone;
    private String cycleName;

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getCycleName() {
        return cycleName;
    }

    public void setCycleName(String cycleName) {
        this.cycleName = cycleName;
    }

    public String getCycleType() {
        return cycleType;
    }

    public void setCycleType(String cycleType) {
        this.cycleType = cycleType;
    }

    public LocalDateTime getRentalStartTime() {
        return rentalStartTime;
    }

    public void setRentalStartTime(LocalDateTime rentalStartTime) {
        this.rentalStartTime = rentalStartTime;
    }

    public LocalDateTime getExpectedEndTime() {
        return expectedEndTime;
    }

    public void setExpectedEndTime(LocalDateTime expectedEndTime) {
        this.expectedEndTime = expectedEndTime;
    }

    public String getDepositStatus() {
        return depositStatus;
    }

    public void setDepositStatus(String depositStatus) {
        this.depositStatus = depositStatus;
    }

    public Long getPickupStationId() {
        return pickupStationId;
    }

    public void setPickupStationId(Long pickupStationId) {
        this.pickupStationId = pickupStationId;
    }

    public Long getReturnStationId() {
        return returnStationId;
    }

    public void setReturnStationId(Long returnStationId) {
        this.returnStationId = returnStationId;
    }

    private String cycleType;
    private LocalDateTime rentalStartTime;
    private LocalDateTime expectedEndTime;
    private String depositStatus;
    private Long pickupStationId;
    private Long returnStationId;
}
