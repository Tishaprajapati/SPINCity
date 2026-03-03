package com.spincity.service.user;

import com.spincity.dto.response.CycleListDTO;
import com.spincity.dto.response.CyclePerformanceDTO;

import java.util.List;

public interface CyclePerformanceService {
    List<CycleListDTO> getAllCycles();


    CyclePerformanceDTO getPerformanceByCycleId(Long cycleId);
}
