package com.spincity.service.user;

import com.spincity.dto.response.CycleListDTO;
import com.spincity.dto.response.CyclePerformanceDTO;
import com.spincity.model.cycle.Cycle;
import com.spincity.model.cycle.CyclePerformance;
import com.spincity.model.cycle.CyclePerformanceMaster;
import com.spincity.model.cycle.CyclePricing;
import com.spincity.repository.CyclePerformanceMasterRepository;
import com.spincity.repository.CyclePerformanceRepository;
import com.spincity.repository.CyclePricingRepository;
import com.spincity.repository.CycleRepository;
import com.spincity.service.user.CyclePerformanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class CyclePerformanceServiceImpl implements CyclePerformanceService {

    private final CycleRepository cycleRepository;
    private final CyclePerformanceRepository performanceRepository;
    private final CyclePerformanceMasterRepository performanceMasterRepository;  // ✅ ADD THIS
    private final CyclePricingRepository cyclePricingRepository;

    // ✅ UPDATE CONSTRUCTOR
    public CyclePerformanceServiceImpl(
            CycleRepository cycleRepository,
            CyclePerformanceRepository performanceRepository,
            CyclePerformanceMasterRepository performanceMasterRepository,
            CyclePricingRepository cyclePricingRepository) {   // ← ADD THIS
        this.cycleRepository = cycleRepository;
        this.performanceRepository = performanceRepository;
        this.performanceMasterRepository = performanceMasterRepository;
        this.cyclePricingRepository = cyclePricingRepository;  // ← ADD THIS
    }

    @Override
    public List<CycleListDTO> getAllCycles() {
        return cycleRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // ✅ UPDATE THIS METHOD
    private CycleListDTO mapToDTO(Cycle cycle) {
        CycleListDTO dto = new CycleListDTO();

        dto.setCycleId(cycle.getCycleId());
        dto.setCycleName(cycle.getCycleName());
        dto.setCycleBrand(cycle.getCycleBrand());
        dto.setCycleModel(cycle.getCycleModel());
        dto.setCycleType(cycle.getCycleType());
        dto.setStatus(cycle.getCurrentStatus().name());

        // ✅ FETCH PERFORMANCE POINTS + IMAGE from cycle_performance_master
        String category = getCategoryName(cycle.getCycleType());
        CyclePerformanceMaster perfMaster = performanceMasterRepository
                .findByCycleCategory(category)
                .orElse(null);

        if (perfMaster != null) {
            dto.setImageUrl(perfMaster.getImageUrl());  // ✅ Image from master table
            dto.setPoint1(perfMaster.getPoint1());
            dto.setPoint2(perfMaster.getPoint2());
            dto.setPoint3(perfMaster.getPoint3());
            dto.setPoint4(perfMaster.getPoint4());
            dto.setPoint5(perfMaster.getPoint5());

            // ✅ ADD THIS — fetch pricing using performanceId
            CyclePricing pricing = cyclePricingRepository
                    .findByPerformanceId(perfMaster.getPerformanceId())
                    .orElse(null);

            if (pricing != null) {
                dto.setPricePerHour(pricing.getPricePerHour());
                dto.setDailyPrice(pricing.getDailyPrice());
                dto.setWeeklyPrice(pricing.getWeeklyPrice());
                dto.setMonthlyPrice(pricing.getMonthlyPrice());
            }

        }
        return dto;
    }
    // ✅ ADD THIS HELPER METHOD
    private String getCategoryName(String cycleType) {
        switch (cycleType) {
            case "1": return "Gear";
            case "2": return "Non-Gear";
            case "3": return "Kids";
            case "4": return "Women";
            case "5": return "City";
            case "6": return "Electric";
            default: return "City";
        }
    }


    @Override
    public CyclePerformanceDTO getPerformanceByCycleId(Long cycleId) {

        Cycle cycle = cycleRepository.findById(cycleId)
                .orElseThrow(() -> new RuntimeException("Cycle not found"));

        CyclePerformance perf = performanceRepository
                .findByCycle_CycleId(cycleId)
                .orElseGet(() -> createDefaultPerformance(cycle));

        return mapToDTO(cycle, perf);
    }

    private CyclePerformance createDefaultPerformance(Cycle cycle) {

        CyclePerformance perf = new CyclePerformance();
        perf.setCycle(cycle);
        perf.setTotalDistanceKm(0.0);
        perf.setTotalUsageHours(0.0);
        perf.setTotalBreakdowns(0);
        perf.setHealthScore(100);

        return performanceRepository.save(perf);
    }


    private CyclePerformanceDTO mapToDTO(Cycle cycle, CyclePerformance perf) {

        CyclePerformanceDTO dto = new CyclePerformanceDTO();

        dto.setCycleId(cycle.getCycleId());
        dto.setCycleName(cycle.getCycleName());
        dto.setTotalDistanceKm(perf.getTotalDistanceKm());
        dto.setTotalUsageHours(perf.getTotalUsageHours());
        dto.setAvgSpeedKmph(perf.getAvgSpeedKmph());
        dto.setBatteryHealthPercent(perf.getBatteryHealthPercent());
        dto.setTotalBreakdowns(perf.getTotalBreakdowns());
        dto.setHealthScore(perf.getHealthScore());
        dto.setLastServiceDate(perf.getLastServiceDate());

        return dto;
    }
}
