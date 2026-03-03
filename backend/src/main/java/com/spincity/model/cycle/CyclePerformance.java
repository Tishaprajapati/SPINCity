package com.spincity.model.cycle;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
@Entity
@Table(name = "cycle_performance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CyclePerformance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long performanceId;

    @OneToOne
    @JoinColumn(name = "cycle_id", nullable = false)
    private Cycle cycle;

    private Double totalDistanceKm;
    private Double totalUsageHours;
    private Double avgSpeedKmph;
    private Integer batteryHealthPercent;
    private Integer totalBreakdowns;
    private Integer healthScore;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Long getPerformanceId() {
        return performanceId;
    }

    public void setPerformanceId(Long performanceId) {
        this.performanceId = performanceId;
    }

    public Cycle getCycle() {
        return cycle;
    }

    public void setCycle(Cycle cycle) {
        this.cycle = cycle;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    private LocalDate lastServiceDate;

}
