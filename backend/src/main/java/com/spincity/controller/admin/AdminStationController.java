package com.spincity.controller.admin;

import com.spincity.model.station.Station;
import com.spincity.model.station.StationStatus;
import com.spincity.repository.StationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/stations")
@RequiredArgsConstructor
public class AdminStationController {

    private final StationRepository stationRepository;

    // Get all stations
    @GetMapping
    public ResponseEntity<List<Station>> getAllStations() {
        return ResponseEntity.ok(stationRepository.findAll());
    }

    // Add new station
    @PostMapping
    public ResponseEntity<Station> addStation(@RequestBody Station station) {
        if (station.getStatus() == null) {
            station.setStatus(StationStatus.Active);
        }
        if (station.getAvailableCycles() == null) {
            station.setAvailableCycles(0);
        }
        return ResponseEntity.ok(stationRepository.save(station));
    }

    // Update station
    @PutMapping("/{stationId}")
    public ResponseEntity<Station> updateStation(
            @PathVariable Long stationId,
            @RequestBody Station updatedStation) {
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Station not found: " + stationId));
        station.setStationName(updatedStation.getStationName());
        station.setStationAddress(updatedStation.getStationAddress());
        station.setTotalCapacity(updatedStation.getTotalCapacity());
        station.setOperatingHours(updatedStation.getOperatingHours());
        station.setContactNumber(updatedStation.getContactNumber());
        station.setStationType(updatedStation.getStationType());
        if (updatedStation.getStatus() != null) {
            station.setStatus(updatedStation.getStatus());
        }
        return ResponseEntity.ok(stationRepository.save(station));
    }

    // Delete station
    @DeleteMapping("/{stationId}")
    public ResponseEntity<String> deleteStation(@PathVariable Long stationId) {
        stationRepository.deleteById(stationId);
        return ResponseEntity.ok("Station deleted successfully");
    }

    // Update station status
    @PutMapping("/{stationId}/status")
    public ResponseEntity<String> updateStatus(
            @PathVariable Long stationId,
            @RequestParam String status) {
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Station not found"));
        station.setStatus(StationStatus.valueOf(status));
        stationRepository.save(station);
        return ResponseEntity.ok("Status updated to " + status);
    }
}