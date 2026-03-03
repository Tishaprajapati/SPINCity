package com.spincity.dto.response;

public class CycleDTO {

    private Long cycleId;
    private String cycleName;
    private String cycleType;
    private String cycleBrand;
    private String cycleModel;
    private String qrCode;
    private String currentStatus;

    public CycleDTO() {}

    // Getters and Setters
    public Long getCycleId() { return cycleId; }
    public void setCycleId(Long cycleId) { this.cycleId = cycleId; }

    public String getCycleName() { return cycleName; }
    public void setCycleName(String cycleName) { this.cycleName = cycleName; }

    public String getCycleType() { return cycleType; }
    public void setCycleType(String cycleType) { this.cycleType = cycleType; }

    public String getCycleBrand() { return cycleBrand; }
    public void setCycleBrand(String cycleBrand) { this.cycleBrand = cycleBrand; }

    public String getCycleModel() { return cycleModel; }
    public void setCycleModel(String cycleModel) { this.cycleModel = cycleModel; }

    public String getQrCode() { return qrCode; }
    public void setQrCode(String qrCode) { this.qrCode = qrCode; }

    public String getCurrentStatus() { return currentStatus; }
    public void setCurrentStatus(String currentStatus) { this.currentStatus = currentStatus; }
}