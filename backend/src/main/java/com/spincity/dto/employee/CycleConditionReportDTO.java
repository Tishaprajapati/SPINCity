package com.spincity.dto.employee;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CycleConditionReportDTO {

    private Long cycleId;
    private String conditionNote;
    private String conditionStatus;  // Good / Minor_Issue / Major_Issue / Critical
}