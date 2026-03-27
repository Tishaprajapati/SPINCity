package com.spincity.controller.user;

import com.spincity.dto.response.CycleDTO;
import com.spincity.dto.response.StationDTO;
import com.spincity.service.user.StationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/stations")
@CrossOrigin(origins = {"http://localhost:5173", "https://spin-city.vercel.app"})
public class StationController {

    @Autowired
    private StationService stationService;

    /**
     * Get all active stations
     * GET /api/user/stations
     */
    @GetMapping
    public ResponseEntity<List<StationDTO>> getAllActiveStations() {
        try {
            List<StationDTO> stations = stationService.getAllActiveStations();
            return ResponseEntity.ok(stations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get nearby stations
     * GET /api/user/stations/nearby?lat=23.0225&lng=72.5714&radius=5
     */
    @GetMapping("/nearby")
    public ResponseEntity<?> getNearbyStations(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(defaultValue = "5.0") Double radius) {
        try {
            if (lat == null || lng == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "lat and lng parameters are required");
                return ResponseEntity.badRequest().body(error);
            }

            List<StationDTO> stations = stationService.getNearbyStations(lat, lng, radius);
            return ResponseEntity.ok(stations);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Get available cycles at a station
     * GET /api/user/stations/{stationId}/cycles
     */
    @GetMapping("/{stationId}/cycles")
    public ResponseEntity<?> getAvailableCyclesAtStation(@PathVariable Long stationId) {
        try {
            List<CycleDTO> cycles = stationService.getAvailableCyclesAtStation(stationId);
            return ResponseEntity.ok(cycles);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}