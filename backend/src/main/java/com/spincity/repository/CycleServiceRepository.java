package com.spincity.repository;

import com.spincity.model.cycle.CycleService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CycleServiceRepository extends JpaRepository<CycleService, Integer> {

    // Get current service record of a specific cycle
    Optional<CycleService> findByCycle_CycleId(Long cycleId);

    // Get all defective cycles at a specific station
    @Query("SELECT cs FROM CycleService cs WHERE cs.cycle.currentStationId = :stationId " +
            "AND cs.conditionStatus != 'Good'"+
            "AND cs.cycle.currentStatus = 'Damaged'")
    List<CycleService> findDefectiveCyclesByStation(@Param("stationId") Long stationId);

    // Get cycles whose service is due or overdue
    @Query("SELECT cs FROM CycleService cs WHERE cs.nextServiceDue <= :today")
    List<CycleService> findCyclesDueForService(@Param("today") LocalDate today);

    // Get cycles by condition status at a station
    @Query("SELECT cs FROM CycleService cs WHERE cs.cycle.currentStationId = :stationId " +
            "AND cs.conditionStatus = :status")
    List<CycleService> findByStationAndCondition(
            @Param("stationId") Long stationId,
            @Param("status") CycleService.ConditionStatus status);
}