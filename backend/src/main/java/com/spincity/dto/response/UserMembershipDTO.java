package com.spincity.dto.response;

import com.spincity.model.membership.MembershipStatus;

import java.time.LocalDate;

public class UserMembershipDTO {

    private String planName;
    private MembershipStatus status;

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public void setStatus(MembershipStatus status) {
        this.status = status;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    private LocalDate startDate;
    private LocalDate endDate;

    public UserMembershipDTO() {}

    public UserMembershipDTO(String planName,
                             MembershipStatus status,
                             LocalDate startDate,
                             LocalDate endDate) {
        this.planName = planName;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public String getPlanName() {
        return planName;
    }

    public MembershipStatus getStatus() {
        return status;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }
}
