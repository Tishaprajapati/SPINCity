package com.spincity.controller.user;

import com.spincity.dto.request.StartRentalRequest;
import com.spincity.dto.response.ActiveRentalDTO;
import com.spincity.dto.response.RentalHistoryDTO;
import com.spincity.service.user.RentalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/rentals")
@CrossOrigin(origins = "http://localhost:5173")
public class RentalController {

    @Autowired
    private RentalService rentalService;

    /**
     * Get active rental
     * GET /api/user/rentals/active/{customerId}
     */



    @GetMapping("/active/{customerId}")
    public ResponseEntity<?> getActiveRental(@PathVariable Integer customerId) {
        try {
            ActiveRentalDTO activeRental = rentalService.getActiveRental(customerId);
            if (activeRental == null) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "No active rental");
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.ok(activeRental);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Get rental history
     * GET /api/user/rentals/history/{customerId}
     */
    @GetMapping("/history/{customerId}")
    public ResponseEntity<?> getRentalHistory(@PathVariable Integer customerId) {
        try {
            List<RentalHistoryDTO> history = rentalService.getRentalHistory(customerId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Start new rental
     * POST /api/user/rentals/start
     * Body: { "customerId": 1, "cycleId": 5, "pickupStationId": 2 }
     */
    @PostMapping("/start")
    public ResponseEntity<?> startRental(@RequestBody StartRentalRequest request) {
        try {
            RentalHistoryDTO rental = rentalService.startRental(request);
            return ResponseEntity.ok(rental);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * End rental
     * POST /api/user/rentals/end/{transactionId}
     * Body: { "returnStationId": 3 }
     */
    @PostMapping("/end/{transactionId}")
    public ResponseEntity<?> endRental(
            @PathVariable Long transactionId,
            @RequestBody Map<String, Integer> request) {
        try {
            Integer returnStationId = request.get("returnStationId");
            if (returnStationId == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "returnStationId is required");
                return ResponseEntity.badRequest().body(error);
            }

            RentalHistoryDTO rental = rentalService.endRental(transactionId, returnStationId);
            return ResponseEntity.ok(rental);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}