package com.spincity.service.user;

import com.spincity.dto.request.UpdateProfileRequest;
import com.spincity.model.customer.Customer;

public interface ProfileService {
    Customer getProfile(Integer customerId);
    Customer updateProfile(Integer customerId, UpdateProfileRequest request);
}