package com.spincity.dto.response;

public class StationDTO {

    private Long stationId;
    private String stationName;
    private String stationAddress;
    private Double latitude;
    private Double longitude;
    private Integer totalCapacity;
    private Integer availableCycles;
    private String operatingHours;
    private String status;

    public StationDTO() {}

    // Getters and Setters
    public Long getStationId() { return stationId; }
    public void setStationId(Long stationId) { this.stationId = stationId; }

    public String getStationName() { return stationName; }
    public void setStationName(String stationName) { this.stationName = stationName; }

    public String getStationAddress() { return stationAddress; }
    public void setStationAddress(String stationAddress) { this.stationAddress = stationAddress; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Integer getTotalCapacity() { return totalCapacity; }
    public void setTotalCapacity(Integer totalCapacity) { this.totalCapacity = totalCapacity; }

    public Integer getAvailableCycles() { return availableCycles; }
    public void setAvailableCycles(Integer availableCycles) { this.availableCycles = availableCycles; }

    public String getOperatingHours() { return operatingHours; }
    public void setOperatingHours(String operatingHours) { this.operatingHours = operatingHours; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}