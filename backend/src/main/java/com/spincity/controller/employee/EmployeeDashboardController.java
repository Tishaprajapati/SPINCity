package com.spincity.controller.employee;

import com.spincity.dto.employee.ApprovalRequestDTO;
import com.spincity.dto.employee.CustomerDetailDTO;
import com.spincity.dto.employee.EmployeeDashboardDTO;
import com.spincity.dto.employee.RiderListDTO;
import com.spincity.repository.RentalTransactionRepository;
import com.spincity.service.employee.EmployeeDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.spincity.dto.employee.ActiveRideDTO;

import java.util.List;

@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
public class EmployeeDashboardController {
    private final RentalTransactionRepository rentalTransactionRepository;
    private final EmployeeDashboardService employeeDashboardService;

    // Dashboard summary
    @GetMapping("/dashboard/{stationId}")
    public ResponseEntity<EmployeeDashboardDTO> getDashboard(@PathVariable Long stationId) {
        return ResponseEntity.ok(employeeDashboardService.getDashboardSummary(stationId));
    }

    @PutMapping("/deposit/forfeit/{transactionId}")
    public ResponseEntity<String> forfeitDeposit(@PathVariable Long transactionId) {
        employeeDashboardService.forfeitDeposit(transactionId);
        return ResponseEntity.ok("Deposit forfeited");
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

    @PutMapping("/payment-status/{transactionId}")
    public ResponseEntity<String> updatePaymentStatus(
            @PathVariable Long transactionId,
            @RequestParam String status) {
        employeeDashboardService.updatePaymentStatus(transactionId, status);
        return ResponseEntity.ok("Payment status updated to " + status);
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

    @GetMapping("/ride-status/{transactionId}")
    public ResponseEntity<String> getRideStatus(@PathVariable Long transactionId) {
        return ResponseEntity.ok(employeeDashboardService.getRideStatus(transactionId));
    }

    @GetMapping("/active-rides/{stationId}")
    public ResponseEntity<List<ActiveRideDTO>> getActiveRides(@PathVariable Integer stationId) {
        return ResponseEntity.ok(employeeDashboardService.getActiveRides(stationId));
    }

    @PutMapping("/complete-ride/{transactionId}")
    public ResponseEntity<String> completeRide(
            @PathVariable Long transactionId,
            @RequestParam Integer empId) {
        employeeDashboardService.completeRide(transactionId, empId);
        return ResponseEntity.ok("Ride completed");
    }


    @GetMapping("/approval-status/{transactionId}")
    public ResponseEntity<String> getApprovalStatus(@PathVariable Long transactionId) {
        String status = rentalTransactionRepository.findApprovalStatusById(transactionId);
        return ResponseEntity.ok(status);
    }
}