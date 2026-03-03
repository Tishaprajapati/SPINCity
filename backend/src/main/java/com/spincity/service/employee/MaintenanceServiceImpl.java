package com.spincity.service.employee;

import com.spincity.dto.employee.MaintenanceAlertDTO;
import com.spincity.model.cycle.Cycle;
import com.spincity.model.cycle.CycleStatus;
import com.spincity.model.cycle.MaintenanceLog;
import com.spincity.model.employee.Staff;
import com.spincity.repository.CycleRepository;
import com.spincity.repository.CycleServiceRepository;
import com.spincity.repository.MaintenanceLogRepository;
import com.spincity.repository.employee.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaintenanceServiceImpl implements MaintenanceService {

    private final MaintenanceLogRepository maintenanceLogRepository;
    private final CycleRepository cycleRepository;
    private final StaffRepository staffRepository;
    private final CycleServiceRepository cycleServiceRepository;

    // ── All Reported Defects ──────────────────────────────────────────────────

    @Override
    public List<MaintenanceAlertDTO> getAllReportedDefects() {
        return maintenanceLogRepository.findActiveReports()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ── Cycles Due For Service ────────────────────────────────────────────────

    @Override
    public List<MaintenanceAlertDTO> getCyclesDueForService() {
        return cycleServiceRepository.findCyclesDueForService(LocalDate.now())
                .stream()
                .map(cs -> {
                    MaintenanceAlertDTO dto = new MaintenanceAlertDTO();
                    dto.setCycleId(cs.getCycle().getCycleId());
                    dto.setCycleName(cs.getCycle().getCycleName());
                    dto.setCycleType(cs.getCycle().getCycleType());
                    dto.setStationId(cs.getCycle().getCurrentStationId());
                    dto.setDefectDescription(cs.getConditionNote());
                    dto.setNextMaintenanceDue(cs.getNextServiceDue());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // ── Complete Maintenance ──────────────────────────────────────────────────

    @Override
    @Transactional
    public void completeMaintenance(Integer maintenanceId, Long empId,
                                    String partsReplaced, Double cost) {

        MaintenanceLog log = maintenanceLogRepository.findById(maintenanceId)
                .orElseThrow(() -> new RuntimeException("Maintenance log not found: " + maintenanceId));

        Staff emp = staffRepository.findById(empId.intValue())
                .orElseThrow(() -> new RuntimeException("Employee not found: " + empId));

        // Update maintenance log
        log.setPerformedByEmp(emp);
        log.setPartsReplaced(partsReplaced);
        log.setCost(BigDecimal.valueOf(cost));
        log.setReportStatus(MaintenanceLog.ReportStatus.Completed);
        log.setNextMaintenanceDue(LocalDate.now().plusMonths(1));
        maintenanceLogRepository.save(log);

        // Update cycle status back to Available
        Cycle cycle = log.getCycle();
        cycle.setCurrentStatus(CycleStatus.Available);
        cycleRepository.save(cycle);
    }

    // ── Update Cycle Status ───────────────────────────────────────────────────

    @Override
    @Transactional
    public void updateCycleStatus(Long cycleId, String newStatus) {
        Cycle cycle = cycleRepository.findById(cycleId)
                .orElseThrow(() -> new RuntimeException("Cycle not found: " + cycleId));
        cycle.setCurrentStatus(CycleStatus.valueOf(newStatus));
        cycleRepository.save(cycle);
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    private MaintenanceAlertDTO mapToDTO(MaintenanceLog log) {
        MaintenanceAlertDTO dto = new MaintenanceAlertDTO();
        dto.setMaintenanceId(log.getMaintenanceId());
        dto.setCycleId(log.getCycle().getCycleId());
        dto.setCycleName(log.getCycle().getCycleName());
        dto.setCycleType(log.getCycle().getCycleType());
        dto.setStationId(log.getCycle().getCurrentStationId());
        dto.setDefectDescription(log.getDescription());
        dto.setReportStatus(log.getReportStatus().name());
        dto.setReportedByEmpName(
                log.getReportedByEmp() != null ? log.getReportedByEmp().getName() : "N/A"
        );
        dto.setMaintenanceDate(log.getMaintenanceDate());
        dto.setNextMaintenanceDue(log.getNextMaintenanceDue());
        return dto;
    }
}