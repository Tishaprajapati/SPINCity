package com.spincity.dto.employee;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StationAnalyticsDTO {
    private Long stationId;
    private String stationName;

    // Revenue
    private double todayRevenue;
    private double weeklyRevenue;
    private double monthlyRevenue;

    // Rider counts
    private long todayRiders;
    private long weeklyRiders;
    private long monthlyRiders;

    // Ride list
    private List<RideHistoryRowDTO> recentRides;
}
