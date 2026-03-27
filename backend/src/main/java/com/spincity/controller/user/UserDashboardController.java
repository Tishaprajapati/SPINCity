package com.spincity.controller.user;

import com.spincity.dto.response.UserDashboardDTO;
import com.spincity.service.user.UserDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/dashboard")
@CrossOrigin(origins = {"http://localhost:5173", "https://spin-city.vercel.app"})
public class UserDashboardController {

    @Autowired
    private UserDashboardService userDashboardService;

    @GetMapping("/{customerId}")
    public ResponseEntity<UserDashboardDTO> getUserDashboard(@PathVariable Integer customerId) {
        try {
            UserDashboardDTO dashboard = userDashboardService.getUserDashboard(customerId);
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}