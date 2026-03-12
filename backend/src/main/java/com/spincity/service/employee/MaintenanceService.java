package com.spincity.service.employee;

import com.spincity.dto.employee.AssignedCycleDTO;
import com.spincity.dto.employee.MaintenanceAlertDTO;

import java.time.LocalDate;
import java.util.List;

public interface MaintenanceService {

    // Get all reported defects across all stations
    List<MaintenanceAlertDTO> getAllReportedDefects();

    // Get cycles due for service
    List<MaintenanceAlertDTO> getCyclesDueForService();

    // Update maintenance log after fixing
    void completeMaintenance(Integer maintenanceId, Long empId,
                             String partsReplaced, Double cost);

    // Update cycle status after service
    void updateCycleStatus(Long cycleId, String newStatus);

    List<MaintenanceAlertDTO> getDefectsForAssignedStations(Long empId);
    List<AssignedCycleDTO> getCyclesForAssignedStations(Long empId);
    void setNextServiceDate(Long cycleId, LocalDate date);
    List<MaintenanceAlertDTO> getDueForAssignedStations(Long empId);
}