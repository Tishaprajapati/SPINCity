package com.spincity.dto.request;

public class StartRentalRequest {

    private Integer customerId;
    private Integer cycleId;
    private Integer pickupStationId;
    private Integer returnStationId;
    private String expectedReturnTime;
    private Double bookedAmount;        // ✅ ADD THIS

    public Double getBookedAmount() { return bookedAmount; }        // ✅ ADD THIS
    public void setBookedAmount(Double v) { this.bookedAmount = v; } // ✅ ADD THIS
    public String getExpectedReturnTime() { return expectedReturnTime; }
    public void setExpectedReturnTime(String v) { this.expectedReturnTime = v; }
    public StartRentalRequest() {}



    public Integer getReturnStationId() { return returnStationId; }  // ✅ new
    public void setReturnStationId(Integer returnStationId) { this.returnStationId = returnStationId; } // ✅ new
    // Getters and Setters
    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    public Integer getCycleId() { return cycleId; }
    public void setCycleId(Integer cycleId) { this.cycleId = cycleId; }

    public Integer getPickupStationId() { return pickupStationId; }
    public void setPickupStationId(Integer pickupStationId) { this.pickupStationId = pickupStationId; }
}