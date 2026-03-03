package com.spincity.service.employee;

import com.spincity.dto.employee.CycleConditionReportDTO;
import com.spincity.model.cycle.Cycle;
import com.spincity.model.cycle.CycleService;
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
public class CycleConditionServiceImpl implements CycleConditionService {

    private final CycleRepository cycleRepository;
    private final CycleServiceRepository cycleServiceRepository;
    private final MaintenanceLogRepository maintenanceLogRepository;
    private final StaffRepository staffRepository;

    // ── Report Defect ─────────────────────────────────────────────────────────

    @Override
    @Transactional
    public void reportDefect(CycleConditionReportDTO dto, Long empId) {

        // 1. Find cycle
        Cycle cycle = cycleRepository.findById(dto.getCycleId())
                .orElseThrow(() -> new RuntimeException("Cycle not found: " + dto.getCycleId()));

        // TO
        Staff emp = staffRepository.findById(empId.intValue())
                .orElseThrow(() -> new RuntimeException("Employee not found: " + empId));

        // 3. Update cycle status to Damaged
        cycle.setCurrentStatus(CycleStatus.Damaged);
        cycleRepository.save(cycle);

        // 4. Create new CycleService record
        CycleService serviceRecord = new CycleService();
        serviceRecord.setCycle(cycle);
        serviceRecord.setConditionNote(dto.getConditionNote());
        serviceRecord.setConditionStatus(
                CycleService.ConditionStatus.valueOf(dto.getConditionStatus())
        );
        serviceRecord.setReportedByEmp(emp);
        serviceRecord.setNextServiceDue(LocalDate.now().plusDays(1)); // needs service ASAP
        CycleService saved = cycleServiceRepository.save(serviceRecord);

        // 5. Update cycle's current service pointer
        cycle.setCurrentService(saved);
        cycleRepository.save(cycle);

        // 6. Create MaintenanceLog entry so maintenance employee can see it
        MaintenanceLog log = new MaintenanceLog();
        log.setCycle(cycle);
        log.setCost(BigDecimal.ZERO);  // cost unknown at report time
        log.setMaintenanceDate(LocalDate.now());
        log.setMaintenanceType(MaintenanceLog.MaintenanceType.Repair);
        log.setDescription(dto.getConditionNote());
        log.setReportedByEmp(emp);
        log.setReportStatus(MaintenanceLog.ReportStatus.Reported);
        log.setNextMaintenanceDue(LocalDate.now().plusDays(1));
        maintenanceLogRepository.save(log);
    }

    // ── Get All Cycles Condition At Station ───────────────────────────────────

    @Override
    public List<CycleConditionReportDTO> getCycleConditionsByStation(Long stationId) {
        return cycleServiceRepository
                .findDefectiveCyclesByStation(stationId)
                .stream()
                .map(cs -> new CycleConditionReportDTO(
                        cs.getCycle().getCycleId(),
                        cs.getConditionNote(),
                        cs.getConditionStatus().name()
                ))
                .collect(Collectors.toList());
    }
}