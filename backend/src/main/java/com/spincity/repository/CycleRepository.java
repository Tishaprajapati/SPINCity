package com.spincity.repository;

import com.spincity.model.cycle.Cycle;
import com.spincity.model.cycle.CyclePerformance;
import com.spincity.model.cycle.CycleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CycleRepository extends JpaRepository<Cycle, Long> {

    long countByCurrentStatus(CycleStatus status);
//    Optional<CyclePerformance> findByCycle_CycleId(Long cycleId);

    Long countByCurrentStationId(Long stationId);

    @Query("SELECT COUNT(c) FROM Cycle c WHERE c.currentStationId = :stationId " +
            "AND c.currentStatus = 'Available'")
    Long countAvailableCyclesByStation(@Param("stationId") Long stationId);

    @Query("SELECT COUNT(c) FROM Cycle c WHERE c.currentStationId = :stationId " +
            "AND c.currentStatus IN ('Damaged', 'Under Maintenance')")
    Long countDefectiveCyclesByStation(@Param("stationId") Long stationId);

    // NEW: Find available cycles at a specific station
    @Query("SELECT c FROM Cycle c WHERE c.currentStationId = :stationId AND c.currentStatus = 'Available'")
    List<Cycle> findAvailableCyclesByStationId(@Param("stationId") Long stationId);

    // NEW: Count available cycles at a station
    @Query("SELECT COUNT(c) FROM Cycle c WHERE c.currentStationId = :stationId AND c.currentStatus = 'Available'")
    int countAvailableCyclesByStationId(@Param("stationId") Long stationId);
}