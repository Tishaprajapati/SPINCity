package com.spincity.dto.response;

import java.time.LocalDateTime;

public class RentalHistoryDTO {

    private Long transactionId;
    private String cycleName;
    private String cycleType;
    private String pickupStation;
    private String returnStation;
    private LocalDateTime rentalStartTime;
    private LocalDateTime rentalEndTime;
    private Integer rentalDuration; // in minutes
    private Double totalAmount;
    private String paymentStatus;
    private String rentalStatus;

    // Constructor for JPQL
    public RentalHistoryDTO(Long transactionId, String cycleName, String cycleType,
                            String pickupStation, String returnStation,
                            LocalDateTime rentalStartTime, LocalDateTime rentalEndTime,
                            Integer rentalDuration, Double totalAmount,
                            String paymentStatus, String rentalStatus) {
        this.transactionId = transactionId;
        this.cycleName = cycleName;
        this.cycleType = cycleType;
        this.pickupStation = pickupStation;
        this.returnStation = returnStation;
        this.rentalStartTime = rentalStartTime;
        this.rentalEndTime = rentalEndTime;
        this.rentalDuration = rentalDuration;
        this.totalAmount = totalAmount;
        this.paymentStatus = paymentStatus;
        this.rentalStatus = rentalStatus;
    }

    public RentalHistoryDTO() {}

    // Getters and Setters
    public Long getTransactionId() { return transactionId; }
    public void setTransactionId(Long transactionId) { this.transactionId = transactionId; }

    public String getCycleName() { return cycleName; }
    public void setCycleName(String cycleName) { this.cycleName = cycleName; }

    public String getCycleType() { return cycleType; }
    public void setCycleType(String cycleType) { this.cycleType = cycleType; }

    public String getPickupStation() { return pickupStation; }
    public void setPickupStation(String pickupStation) { this.pickupStation = pickupStation; }

    public String getReturnStation() { return returnStation; }
    public void setReturnStation(String returnStation) { this.returnStation = returnStation; }

    public LocalDateTime getRentalStartTime() { return rentalStartTime; }
    public void setRentalStartTime(LocalDateTime rentalStartTime) { this.rentalStartTime = rentalStartTime; }

    public LocalDateTime getRentalEndTime() { return rentalEndTime; }
    public void setRentalEndTime(LocalDateTime rentalEndTime) { this.rentalEndTime = rentalEndTime; }

    public Integer getRentalDuration() { return rentalDuration; }
    public void setRentalDuration(Integer rentalDuration) { this.rentalDuration = rentalDuration; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getRentalStatus() { return rentalStatus; }
    public void setRentalStatus(String rentalStatus) { this.rentalStatus = rentalStatus; }
}