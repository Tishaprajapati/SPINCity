package com.spincity.repository;

import com.spincity.model.cycle.MaintenanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceLogRepository extends JpaRepository<MaintenanceLog, Integer> {

    // All logs for a specific cycle
    List<MaintenanceLog> findByCycle_CycleIdOrderByMaintenanceDateDesc(Long cycleId);

    // All pending/assigned reports for maintenance employee
    @Query("SELECT m FROM MaintenanceLog m WHERE m.reportStatus IN ('Reported', 'Assigned', 'In_Progress')")
    List<MaintenanceLog> findActiveReports();

    // All reports made by a specific station employee
    List<MaintenanceLog> findByReportedByEmp_Id(Long empId);

    // All logs handled by a specific maintenance employee
    List<MaintenanceLog> findByPerformedByEmp_Id(Long empId);

    // Reports at a specific station (via cycle's current station)
    @Query("SELECT m FROM MaintenanceLog m WHERE m.cycle.currentStationId = :stationId " +
            "AND m.reportStatus = 'Reported'")
    List<MaintenanceLog> findPendingReportsByStation(@Param("stationId") Long stationId);
}