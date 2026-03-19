package com.spincity.controller.admin;

import com.spincity.dto.response.AdminDashboardSummaryDTO;
import com.spincity.service.admin.AdminDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/dashboard")
public class AdminDashboardController {



    @Autowired
    private AdminDashboardService adminDashboardService;

    @GetMapping("/summary")
    public ResponseEntity<AdminDashboardSummaryDTO> getDashboardSummary() {
        System.out.println("🔥 ADMIN DASHBOARD HIT");
        return ResponseEntity.ok(adminDashboardService.getDashboardSummary());

    }

    @GetMapping("/recent-rentals")
    public ResponseEntity<?> getRecentRentals() {
        return ResponseEntity.ok(adminDashboardService.getRecentRentals());
    }

}