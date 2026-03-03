package com.spincity.dto.response;

public class ActiveRentalDTO {

    private Long rentalId;
    private String cycleName;
    private String cycleType;
    private String startTime;
    private String station;
    private String duration;
    private Double currentCharges;
    private Long pickupStationId;   // ✅ new
    private Long returnStationId;   // ✅ new
    private String expectedEndTime;   // ✅ add
    private String depositStatus;

    public String getDepositStatus() { return depositStatus; }
    public void setDepositStatus(String depositStatus) { this.depositStatus = depositStatus; }
    public ActiveRentalDTO() {}


    public String getExpectedEndTime() { return expectedEndTime; }
    public void setExpectedEndTime(String expectedEndTime) { this.expectedEndTime = expectedEndTime; }

    // Existing getters/setters
    public Long getRentalId() { return rentalId; }
    public void setRentalId(Long rentalId) { this.rentalId = rentalId; }

    public String getCycleName() { return cycleName; }
    public void setCycleName(String cycleName) { this.cycleName = cycleName; }

    public String getCycleType() { return cycleType; }
    public void setCycleType(String cycleType) { this.cycleType = cycleType; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getStation() { return station; }
    public void setStation(String station) { this.station = station; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public Double getCurrentCharges() { return currentCharges; }
    public void setCurrentCharges(Double currentCharges) { this.currentCharges = currentCharges; }

    // ✅ New getters/setters
    public Long getPickupStationId() { return pickupStationId; }
    public void setPickupStationId(Long pickupStationId) { this.pickupStationId = pickupStationId; }

    public Long getReturnStationId() { return returnStationId; }
    public void setReturnStationId(Long returnStationId) { this.returnStationId = returnStationId; }
}