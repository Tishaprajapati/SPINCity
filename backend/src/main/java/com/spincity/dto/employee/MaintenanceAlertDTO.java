package com.spincity.dto.employee;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceAlertDTO {

    private Integer maintenanceId;
    private Long cycleId;
    private String cycleName;
    private String cycleType;
    private Long stationId;
    private String stationName;
    private String defectDescription;
    private String reportStatus;
    private String reportedByEmpName;
    private LocalDate maintenanceDate;
    private LocalDate nextMaintenanceDue;
}