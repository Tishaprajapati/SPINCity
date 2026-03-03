package com.spincity.dto.request;

import jakarta.validation.constraints.NotNull;

public class UpgradeMembershipRequest {

    @NotNull

    private Long membershipPlanId;

    public Long getMembershipPlanId() {
        return membershipPlanId;
    }

    public void setMembershipPlanId(Long membershipPlanId) {
        this.membershipPlanId = membershipPlanId;
    }
}
