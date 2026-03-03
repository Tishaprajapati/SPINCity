package com.spincity.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CyclePerformanceDTO {

    private Long cycleId;
    private String cycleName;

    public Long getCycleId() {
        return cycleId;
    }

    public void setCycleId(Long cycleId) {
        this.cycleId = cycleId;
    }

    public String getCycleName() {
        return cycleName;
    }

    public void setCycleName(String cycleName) {
        this.cycleName = cycleName;
    }

    public Double getTotalDistanceKm() {
        return totalDistanceKm;
    }

    public void setTotalDistanceKm(Double totalDistanceKm) {
        this.totalDistanceKm = totalDistanceKm;
    }

    public Double getTotalUsageHours() {
        return totalUsageHours;
    }

    public void setTotalUsageHours(Double totalUsageHours) {
        this.totalUsageHours = totalUsageHours;
    }

    public Double getAvgSpeedKmph() {
        return avgSpeedKmph;
    }

    public void setAvgSpeedKmph(Double avgSpeedKmph) {
        this.avgSpeedKmph = avgSpeedKmph;
    }

    public Integer getBatteryHealthPercent() {
        return batteryHealthPercent;
    }

    public void setBatteryHealthPercent(Integer batteryHealthPercent) {
        this.batteryHealthPercent = batteryHealthPercent;
    }

    public Integer getTotalBreakdowns() {
        return totalBreakdowns;
    }

    public void setTotalBreakdowns(Integer totalBreakdowns) {
        this.totalBreakdowns = totalBreakdowns;
    }

    public Integer getHealthScore() {
        return healthScore;
    }

    public void setHealthScore(Integer healthScore) {
        this.healthScore = healthScore;
    }

    public LocalDate getLastServiceDate() {
        return lastServiceDate;
    }

    public void setLastServiceDate(LocalDate lastServiceDate) {
        this.lastServiceDate = lastServiceDate;
    }

    private Double totalDistanceKm;
    private Double totalUsageHours;
    private Double avgSpeedKmph;
    private Integer batteryHealthPercent;
    private Integer totalBreakdowns;
    private Integer healthScore;
    private LocalDate lastServiceDate;
}
