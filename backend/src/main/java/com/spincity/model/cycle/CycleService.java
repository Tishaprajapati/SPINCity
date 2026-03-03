package com.spincity.model.cycle;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.spincity.model.employee.Staff;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cycle_service")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CycleService {

    public Integer getServiceId() {
        return serviceId;
    }

    public void setServiceId(Integer serviceId) {
        this.serviceId = serviceId;
    }

    public Cycle getCycle() {
        return cycle;
    }

    public void setCycle(Cycle cycle) {
        this.cycle = cycle;
    }

    public LocalDate getLastServicedDate() {
        return lastServicedDate;
    }

    public void setLastServicedDate(LocalDate lastServicedDate) {
        this.lastServicedDate = lastServicedDate;
    }

    public LocalDate getNextServiceDue() {
        return nextServiceDue;
    }

    public void setNextServiceDue(LocalDate nextServiceDue) {
        this.nextServiceDue = nextServiceDue;
    }

    public Integer getTotalRidesSinceService() {
        return totalRidesSinceService;
    }

    public void setTotalRidesSinceService(Integer totalRidesSinceService) {
        this.totalRidesSinceService = totalRidesSinceService;
    }

    public String getConditionNote() {
        return conditionNote;
    }

    public void setConditionNote(String conditionNote) {
        this.conditionNote = conditionNote;
    }

    public ConditionStatus getConditionStatus() {
        return conditionStatus;
    }

    public void setConditionStatus(ConditionStatus conditionStatus) {
        this.conditionStatus = conditionStatus;
    }

    public Staff getReportedByEmp() {
        return reportedByEmp;
    }

    public void setReportedByEmp(Staff reportedByEmp) {
        this.reportedByEmp = reportedByEmp;
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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_id")
    private Integer serviceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cycle_id", nullable = false)
    private Cycle cycle;

    @Column(name = "last_serviced_date")
    private LocalDate lastServicedDate;

    @Column(name = "next_service_due")
    private LocalDate nextServiceDue;

    @Column(name = "total_rides_since_service")
    private Integer totalRidesSinceService = 0;

    @Column(name = "condition_note", length = 255)
    private String conditionNote;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition_status")
    private ConditionStatus conditionStatus = ConditionStatus.Good;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by_emp_id")
    private Staff reportedByEmp;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum ConditionStatus {
        Good,
        @JsonProperty("Minor Issue") Minor_Issue,
        @JsonProperty("Major Issue") Major_Issue,
        Critical
    }
}