package com.spincity.controller.user;

import com.spincity.dto.request.UpgradeMembershipRequest;
import com.spincity.dto.response.MembershipPlanDTO;
import com.spincity.dto.response.UserMembershipDTO;
import com.spincity.service.user.MembershipService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/membership")

public class MembershipController {

    private final MembershipService membershipService;

    public MembershipController(MembershipService membershipService) {
        this.membershipService = membershipService;
    }

    /**
     * 🔹 Get all available membership plans
     */
    @GetMapping("/plans")
    public ResponseEntity<List<MembershipPlanDTO>> getAllPlans() {
        return ResponseEntity.ok(membershipService.getAllPlans());
    }

    /**
     * 🔹 Upgrade user membership (Base → Weekly / Monthly etc.)
     */
    @PostMapping("/upgrade")
    public ResponseEntity<UserMembershipDTO> upgradeMembership(
            @RequestParam Integer customerId,
            @RequestBody @Valid UpgradeMembershipRequest request
    ) {
        return ResponseEntity.ok(
                membershipService.upgradeMembership(customerId, request)
        );
    }

    @PostMapping("/cancel")
    public ResponseEntity<UserMembershipDTO> cancelMembership(
            @RequestParam Integer customerId
    ) {
        return ResponseEntity.ok(
                membershipService.cancelMembership(customerId)
        );
    }

    /**
     * 🔹 Get logged-in user's current membership
     */
    @GetMapping("/current")
    public ResponseEntity<UserMembershipDTO> getCurrentMembership(
            @RequestParam Integer customerId
    ) {
        return ResponseEntity.ok(
                membershipService.getCurrentMembership(customerId)
        );
    }
}
