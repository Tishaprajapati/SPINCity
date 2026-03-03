package com.spincity.service.user;

import com.spincity.dto.response.UserDashboardDTO;

public interface UserDashboardService {
    UserDashboardDTO getUserDashboard(Integer customerId);
}