package com.spincity.controller.employee;

import com.spincity.dto.employee.MaintenanceAlertDTO;
import com.spincity.service.employee.MaintenanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}