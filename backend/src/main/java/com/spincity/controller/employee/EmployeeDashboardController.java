package com.spincity.controller.employee;

import com.spincity.dto.employee.ApprovalRequestDTO;
import com.spincity.dto.employee.CustomerDetailDTO;
import com.spincity.dto.employee.EmployeeDashboardDTO;
import com.spincity.dto.employee.RiderListDTO;
import com.spincity.service.employee.EmployeeDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
public class EmployeeDashboardController {

    private final EmployeeDashboardService employeeDashboardService;

    // Dashboard summary
    @GetMapping("/dashboard/{stationId}")
    public ResponseEntity<EmployeeDashboardDTO> getDashboard(@PathVariable Long stationId) {
        return ResponseEntity.ok(employeeDashboardService.getDashboardSummary(stationId));
    }

    // Pending approvals list
    @GetMapping("/approvals/{stationId}")
    public ResponseEntity<List<ApprovalRequestDTO>> getPendingApprovals(@PathVariable Long stationId) {
        return ResponseEntity.ok(employeeDashboardService.getPendingApprovals(stationId));
    }

    // Approve or reject a ride
    @PutMapping("/approvals/{transactionId}/action")
    public ResponseEntity<String> approveRide(
            @PathVariable Long transactionId,
            @RequestParam Long empId,
            @RequestParam String action) {
        employeeDashboardService.approveRide(transactionId, empId, action);
        return ResponseEntity.ok("Ride " + action + " successfully");
    }

    // Today's riders at station
    @GetMapping("/riders/{stationId}")
    public ResponseEntity<List<RiderListDTO>> getTodaysRiders(@PathVariable Long stationId) {
        return ResponseEntity.ok(employeeDashboardService.getTodaysRiders(stationId));
    }

    // Customer details
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<CustomerDetailDTO> getCustomerDetails(@PathVariable Integer customerId) {
        return ResponseEntity.ok(employeeDashboardService.getCustomerDetails(customerId));
    }


    // Collect deposit
    @PutMapping("/deposit/collect/{transactionId}")
    public ResponseEntity<String> collectDeposit(@PathVariable Long transactionId) {
        employeeDashboardService.collectDeposit(transactionId);
        return ResponseEntity.ok("Deposit collected successfully");
    }

    // Return deposit
    @PutMapping("/deposit/return/{transactionId}")
    public ResponseEntity<String> returnDeposit(@PathVariable Long transactionId) {
        employeeDashboardService.returnDeposit(transactionId);
        return ResponseEntity.ok("Deposit returned successfully");
    }
}