package com.spincity.model.cycle;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;
@Entity
@Table(name = "cycle")
public class Cycle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cycle_id")
    private Long cycleId;


    @Column(name = "cycle_name")
    private String cycleName;

    @Column(name = "cycle_type")
    private String cycleType;

    @Column(name = "cycle_brand")
    private String cycleBrand;

    @Column(name = "cycle_model")
    private String cycleModel;

    @Column(name = "purchase_date")
    private LocalDate purchaseDate;

    @Column(name = "qr_code", unique = true)
    private String qrCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_status")
    private CycleStatus currentStatus;

    @Column(name = "total_rides")
    private Integer totalRides;

    @Column(name = "current_station_id")
    private Long currentStationId;  // ← ADD THIS

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "cycle", cascade = CascadeType.ALL)
    private CyclePerformance performance;


    @Column(name = "service_interval_days")
    private Integer serviceIntervalDays;

    public Integer getServiceIntervalDays() {
        return serviceIntervalDays;
    }

    public void setServiceIntervalDays(Integer serviceIntervalDays) {
        this.serviceIntervalDays = serviceIntervalDays;
    }

    public LocalDate getNextServiceDate() {
        return nextServiceDate;
    }

    public void setNextServiceDate(LocalDate nextServiceDate) {
        this.nextServiceDate = nextServiceDate;
    }

    @Column(name = "next_service_date")
    private LocalDate nextServiceDate;


    public CycleService getCurrentService() {
        return currentService;
    }

    public void setCurrentService(CycleService currentService) {
        this.currentService = currentService;
    }

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_service_id")
    @JsonIgnore
    private CycleService currentService;


    // Constructors
    public Cycle() {}

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

    public LocalDate getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }

    public String getQrCode() { return qrCode; }
    public void setQrCode(String qrCode) { this.qrCode = qrCode; }

    public CycleStatus getCurrentStatus() { return currentStatus; }
    public void setCurrentStatus(CycleStatus currentStatus) { this.currentStatus = currentStatus; }

    public Integer getTotalRides() { return totalRides; }
    public void setTotalRides(Integer totalRides) { this.totalRides = totalRides; }

    public Long getCurrentStationId() { return currentStationId; }  // ← ADD THIS
    public void setCurrentStationId(Long currentStationId) { this.currentStationId = currentStationId; }  // ← ADD THIS

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}