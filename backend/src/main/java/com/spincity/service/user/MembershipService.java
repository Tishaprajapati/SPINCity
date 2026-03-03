package com.spincity.service.user;

import com.spincity.dto.request.UpgradeMembershipRequest;
import com.spincity.dto.response.MembershipPlanDTO;
import com.spincity.dto.response.UserMembershipDTO;

import java.util.List;

public interface MembershipService {

    List<MembershipPlanDTO> getAllPlans();
    // In MembershipService.java interface
    UserMembershipDTO cancelMembership(Integer customerId);

    UserMembershipDTO upgradeMembership(Integer customerId, UpgradeMembershipRequest request);

    UserMembershipDTO getCurrentMembership(Integer customerId);
}
