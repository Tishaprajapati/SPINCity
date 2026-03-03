package com.spincity.service.employee;

import com.spincity.dto.employee.CycleConditionReportDTO;
import java.util.List;

public interface CycleConditionService {

    // Station employee reports a defect
    void reportDefect(CycleConditionReportDTO dto, Long empId);

    // Get all cycles with their condition at a station
    List<CycleConditionReportDTO> getCycleConditionsByStation(Long stationId);
}