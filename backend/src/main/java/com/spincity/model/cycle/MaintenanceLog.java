package com.spincity.model.cycle;
import com.spincity.model.cycle.Cycle;
import com.spincity.model.employee.Staff;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_log")
public class MaintenanceLog {

    public Integer getMaintenanceId() {
        return maintenanceId;
    }

    public void setMaintenanceId(Integer maintenanceId) {
        this.maintenanceId = maintenanceId;
    }

    public Cycle getCycle() {
        return cycle;
    }

    public void setCycle(Cycle cycle) {
        this.cycle = cycle;
    }

    public LocalDate getMaintenanceDate() {
        return maintenanceDate;
    }

    public void setMaintenanceDate(LocalDate maintenanceDate) {
        this.maintenanceDate = maintenanceDate;
    }

    public MaintenanceType getMaintenanceType() {
        return maintenanceType;
    }

    public void setMaintenanceType(MaintenanceType maintenanceType) {
        this.maintenanceType = maintenanceType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getCost() {
        return cost;
    }

    public void setCost(BigDecimal cost) {
        this.cost = cost;
    }

    public Staff getPerformedByEmp() {
        return performedByEmp;
    }

    public void setPerformedByEmp(Staff performedByEmp) {
        this.performedByEmp = performedByEmp;
    }

    public Staff getReportedByEmp() {
        return reportedByEmp;
    }

    public void setReportedByEmp(Staff reportedByEmp) {
        this.reportedByEmp = reportedByEmp;
    }

    public LocalDate getNextMaintenanceDue() {
        return nextMaintenanceDue;
    }

    public void setNextMaintenanceDue(LocalDate nextMaintenanceDue) {
        this.nextMaintenanceDue = nextMaintenanceDue;
    }

    public String getPartsReplaced() {
        return partsReplaced;
    }

    public void setPartsReplaced(String partsReplaced) {
        this.partsReplaced = partsReplaced;
    }

    public ReportStatus getReportStatus() {
        return reportStatus;
    }

    public void setReportStatus(ReportStatus reportStatus) {
        this.reportStatus = reportStatus;
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
    @Column(name = "maintenance_id")
    private Integer maintenanceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cycle_id")
    private Cycle cycle;

    @Column(name = "maintenance_date")
    private LocalDate maintenanceDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "maintenance_type")
    private MaintenanceType maintenanceType;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "cost", precision = 10, scale = 2)
    private BigDecimal cost;

    // maintenance employee who fixed it
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performed_by_emp_id")
    private Staff performedByEmp;

    // station employee who reported it  ← newly added
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by_emp_id")
    private Staff reportedByEmp;

    @Column(name = "next_maintenance_due")
    private LocalDate nextMaintenanceDue;

    @Column(name = "parts_replaced")
    private String partsReplaced;

    @Enumerated(EnumType.STRING)
    @Column(name = "report_status")          // ← newly added
    private ReportStatus reportStatus;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    // ── Enums ──────────────────────────────

    public enum MaintenanceType {
        Routine, Repair, Emergency, Inspection
    }

    public enum ReportStatus {
        Reported, Assigned, In_Progress, Completed
    }
}
