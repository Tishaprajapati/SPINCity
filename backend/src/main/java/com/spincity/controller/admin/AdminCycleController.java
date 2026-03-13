package com.spincity.controller.admin;

import com.spincity.model.cycle.Cycle;
import com.spincity.model.cycle.CycleStatus;
import com.spincity.repository.CycleRepository;
import com.spincity.repository.StationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/cycles")
@RequiredArgsConstructor
public class AdminCycleController {

    private final CycleRepository cycleRepository;
    private final StationRepository stationRepository;

    // Get all cycles
    @GetMapping
    public ResponseEntity<List<Cycle>> getAllCycles() {
        return ResponseEntity.ok(cycleRepository.findAll());
    }

    // Add new cycle
    @PostMapping
    public ResponseEntity<Cycle> addCycle(@RequestBody Cycle cycle) {
        cycle.setCreatedAt(LocalDateTime.now());
        cycle.setUpdatedAt(LocalDateTime.now());
        cycle.setTotalRides(0);
        if (cycle.getCurrentStatus() == null) {
            cycle.setCurrentStatus(CycleStatus.Available);
        }
        return ResponseEntity.ok(cycleRepository.save(cycle));
    }

    // Update cycle
    @PutMapping("/{cycleId}")
    public ResponseEntity<Cycle> updateCycle(
            @PathVariable Long cycleId,
            @RequestBody Cycle updatedCycle) {
        Cycle cycle = cycleRepository.findById(cycleId)
                .orElseThrow(() -> new RuntimeException("Cycle not found: " + cycleId));
        cycle.setCycleName(updatedCycle.getCycleName());
        cycle.setCycleType(updatedCycle.getCycleType());
        cycle.setCycleBrand(updatedCycle.getCycleBrand());
        cycle.setCycleModel(updatedCycle.getCycleModel());
        cycle.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.ok(cycleRepository.save(cycle));
    }

    // Delete cycle
    @DeleteMapping("/{cycleId}")
    public ResponseEntity<String> deleteCycle(@PathVariable Long cycleId) {
        cycleRepository.deleteById(cycleId);
        return ResponseEntity.ok("Cycle deleted successfully");
    }

    // Update cycle status
    @PutMapping("/{cycleId}/status")
    public ResponseEntity<String> updateStatus(
            @PathVariable Long cycleId,
            @RequestParam String status) {
        Cycle cycle = cycleRepository.findById(cycleId)
                .orElseThrow(() -> new RuntimeException("Cycle not found"));
        cycle.setCurrentStatus(CycleStatus.valueOf(status));
        cycle.setUpdatedAt(LocalDateTime.now());
        cycleRepository.save(cycle);
        return ResponseEntity.ok("Status updated to " + status);
    }

    // Transfer cycle to another station
    @PutMapping("/{cycleId}/transfer")
    public ResponseEntity<String> transferCycle(
            @PathVariable Long cycleId,
            @RequestParam Long stationId) {
        Cycle cycle = cycleRepository.findById(cycleId)
                .orElseThrow(() -> new RuntimeException("Cycle not found"));

        // Update old station count
        if (cycle.getCurrentStationId() != null) {
            stationRepository.findById(cycle.getCurrentStationId()).ifPresent(oldStation -> {
                if (oldStation.getAvailableCycles() != null && oldStation.getAvailableCycles() > 0) {
                    oldStation.setAvailableCycles(oldStation.getAvailableCycles() - 1);
                    stationRepository.save(oldStation);
                }
            });
        }

        // Update new station count
        stationRepository.findById(stationId).ifPresent(newStation -> {
            newStation.setAvailableCycles((newStation.getAvailableCycles() == null ? 0 : newStation.getAvailableCycles()) + 1);
            stationRepository.save(newStation);
        });

        cycle.setCurrentStationId(stationId);
        cycle.setUpdatedAt(LocalDateTime.now());
        cycleRepository.save(cycle);
        return ResponseEntity.ok("Cycle transferred to station " + stationId);
    }
}