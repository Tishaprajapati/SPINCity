package com.spincity.service.admin;

import com.spincity.dto.response.AdminDashboardSummaryDTO;
import com.spincity.dto.response.RecentRentalDTO;

import java.util.List;

public interface AdminDashboardService {
    AdminDashboardSummaryDTO getDashboardSummary();
    List<RecentRentalDTO> getRecentRentals();

}
