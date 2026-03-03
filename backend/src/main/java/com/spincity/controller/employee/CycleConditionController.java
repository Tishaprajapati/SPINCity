package com.spincity.controller.employee;

import com.spincity.dto.employee.CycleConditionReportDTO;
import com.spincity.service.employee.CycleConditionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
public class CycleConditionController {

    private final CycleConditionService cycleConditionService;

    // Report a defect
    @PostMapping("/cycles/report-defect")
    public ResponseEntity<String> reportDefect(
            @RequestBody CycleConditionReportDTO dto,
            @RequestParam Long empId) {
        cycleConditionService.reportDefect(dto, empId);
        return ResponseEntity.ok("Defect reported successfully");
    }

    // Get all defective cycles at station
    @GetMapping("/cycles/conditions/{stationId}")
    public ResponseEntity<List<CycleConditionReportDTO>> getCycleConditions(
            @PathVariable Long stationId) {
        return ResponseEntity.ok(
                cycleConditionService.getCycleConditionsByStation(stationId)
        );
    }
}