// 2. RecentRentalDTO.java - Add Constructor
package com.spincity.dto.response;

import java.time.LocalDateTime;

public class RecentRentalDTO {

    private Long rentalId;
    private String customerName;
    private String cycleName;
    private String pickupStation;
    private String returnStation;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Double amount;
    private String status;

    // Constructor for JPQL query
    public RecentRentalDTO(Long rentalId, String customerName, String cycleName,
                           String pickupStation, LocalDateTime startTime,
                           LocalDateTime endTime, Double amount, String status) {
        this.rentalId = rentalId;
        this.customerName = customerName;
        this.cycleName = cycleName;
        this.pickupStation = pickupStation;
        this.startTime = startTime;
        this.endTime = endTime;
        this.amount = amount;
        this.status = status;
    }

    // Default constructor
    public RecentRentalDTO() {
    }

    // All getters and setters (તમારા existing code માંથી)
    public Long getRentalId() {
        return rentalId;
    }

    public void setRentalId(Long rentalId) {
        this.rentalId = rentalId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCycleName() {
        return cycleName;
    }

    public void setCycleName(String cycleName) {
        this.cycleName = cycleName;
    }

    public String getPickupStation() {
        return pickupStation;
    }

    public void setPickupStation(String pickupStation) {
        this.pickupStation = pickupStation;
    }

    public String getReturnStation() {
        return returnStation;
    }

    public void setReturnStation(String returnStation) {
        this.returnStation = returnStation;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}