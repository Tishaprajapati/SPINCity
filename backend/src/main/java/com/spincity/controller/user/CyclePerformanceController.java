package com.spincity.controller.user;

import com.spincity.dto.response.CycleListDTO;
import com.spincity.dto.response.CyclePerformanceDTO;
import com.spincity.service.user.CyclePerformanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
    @RequestMapping("/api/cycles/performance")
    @RequiredArgsConstructor
    @CrossOrigin
    public class CyclePerformanceController {

        private final CyclePerformanceService performanceService;

        @GetMapping("/{cycleId}")
        public ResponseEntity<CyclePerformanceDTO> getCyclePerformance(
                @PathVariable Long cycleId) {

            return ResponseEntity.ok(
                    performanceService.getPerformanceByCycleId(cycleId)
            );
        }

        @GetMapping("/all")
        public ResponseEntity<List<CycleListDTO>> getAllCycles() {
            return ResponseEntity.ok(performanceService.getAllCycles());
        }
}


