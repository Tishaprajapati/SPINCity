package com.spincity.repository;

import com.spincity.model.cycle.CyclePerformanceMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CyclePerformanceMasterRepository extends JpaRepository<CyclePerformanceMaster, Integer> {

    Optional<CyclePerformanceMaster> findByCycleCategory(String cycleCategory);
}