package com.spincity.repository;

import com.spincity.model.cycle.CyclePricing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CyclePricingRepository extends JpaRepository<CyclePricing, Integer> {
    Optional<CyclePricing> findByPerformanceId(Integer performanceId);
}
