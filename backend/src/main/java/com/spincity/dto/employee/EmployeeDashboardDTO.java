package com.spincity.dto.employee;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDashboardDTO {

    private Long stationId;
    private String stationName;

    // Today's stats
    private Double todayRevenue;
    private Long todayCustomers;
    private Long activeRides;
    private Long pendingApprovals;

    // Cycle health at station
    private Long totalCycles;
    private Long defectiveCycles;
    private Long availableCycles;
}