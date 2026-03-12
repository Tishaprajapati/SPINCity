package com.spincity.controller.employee;

import com.spincity.dto.employee.AssignedCycleDTO;
import com.spincity.dto.employee.MaintenanceAlertDTO;
import com.spincity.service.employee.MaintenanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

import java.util.List;

@RestController
@RequestMapping("/api/employee/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    // All reported defects
    @GetMapping("/defects")
    public ResponseEntity<List<MaintenanceAlertDTO>> getAllDefects() {
        return ResponseEntity.ok(maintenanceService.getAllReportedDefects());
    }

    // Cycles due for service
    @GetMapping("/due")
    public ResponseEntity<List<MaintenanceAlertDTO>> getCyclesDue() {
        return ResponseEntity.ok(maintenanceService.getCyclesDueForService());
    }

    // Complete maintenance
    @PutMapping("/complete/{maintenanceId}")
    public ResponseEntity<String> completeMaintenance(
            @PathVariable Integer maintenanceId,
            @RequestParam Long empId,
            @RequestParam String partsReplaced,
            @RequestParam Double cost) {
        maintenanceService.completeMaintenance(maintenanceId, empId, partsReplaced, cost);
        return ResponseEntity.ok("Maintenance completed successfully");
    }

    // Update cycle status
    @PutMapping("/cycle-status/{cycleId}")
    public ResponseEntity<String> updateCycleStatus(
            @PathVariable Long cycleId,
            @RequestParam String status) {
        maintenanceService.updateCycleStatus(cycleId, status);
        return ResponseEntity.ok("Cycle status updated to " + status);
    }

    // Get defects for maintenance employee's assigned stations
    @GetMapping("/defects/assigned/{empId}")
    public ResponseEntity<List<MaintenanceAlertDTO>> getDefectsForAssignedStations(
            @PathVariable Long empId) {
        return ResponseEntity.ok(maintenanceService.getDefectsForAssignedStations(empId));
    }

    // Get all cycles for assigned stations
    @GetMapping("/cycles/assigned/{empId}")
    public ResponseEntity<List<AssignedCycleDTO>> getCyclesForAssignedStations(
            @PathVariable Long empId) {
        return ResponseEntity.ok(maintenanceService.getCyclesForAssignedStations(empId));
    }

    // Set next service date
    @PutMapping("/cycle/service-date/{cycleId}")
    public ResponseEntity<String> setNextServiceDate(
            @PathVariable Long cycleId,
            @RequestParam String nextServiceDate) {
        maintenanceService.setNextServiceDate(cycleId, LocalDate.parse(nextServiceDate));
        return ResponseEntity.ok("Next service date updated");
    }

    // Get cycles due for service for assigned stations
    @GetMapping("/due/assigned/{empId}")
    public ResponseEntity<List<MaintenanceAlertDTO>> getDueForAssignedStations(
            @PathVariable Long empId) {
        return ResponseEntity.ok(maintenanceService.getDueForAssignedStations(empId));
    }

}