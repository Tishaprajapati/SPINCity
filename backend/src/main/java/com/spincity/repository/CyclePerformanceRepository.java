package com.spincity.repository;

import com.spincity.model.cycle.CyclePerformance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;



    @Repository
    public interface CyclePerformanceRepository
            extends JpaRepository<CyclePerformance, Long> {

//        CyclePerformance findByCycleCategory(String cycleCategory);
        Optional<CyclePerformance> findByCycle_CycleId(Long cycleId);
    }

