package com.spincity.dto.employee;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssignedCycleDTO {
    private Long cycleId;
    private String cycleName;
    private String cycleType;
    private String cycleBrand;
    private String cycleModel;
    private String currentStatus;
    private long currentStationId;
    private String stationName;
    private Integer serviceIntervalDays;
    private LocalDate nextServiceDate;
    private boolean isDueForService;
    private Integer totalRides;
}