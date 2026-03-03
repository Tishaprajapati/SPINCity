package com.spincity.service.employee;

import com.spincity.dto.employee.ApprovalRequestDTO;
import com.spincity.dto.employee.CustomerDetailDTO;
import com.spincity.dto.employee.EmployeeDashboardDTO;
import com.spincity.dto.employee.RiderListDTO;

import java.util.List;

public interface EmployeeDashboardService {

    // Dashboard summary for station employee
    EmployeeDashboardDTO getDashboardSummary(Long stationId);

    // All pending approvals at station
    List<ApprovalRequestDTO> getPendingApprovals(Long stationId);

    // Approve or reject a ride
    void approveRide(Long transactionId, Long empId, String action); // action = "Approved" / "Rejected"

    // All riders at station today
    List<RiderListDTO> getTodaysRiders(Long stationId);

    // Customer full details
    CustomerDetailDTO getCustomerDetails(Integer customerId);


    // Mark deposit as collected
    void collectDeposit(Long transactionId);

    // Mark deposit as returned
    void returnDeposit(Long transactionId);
}