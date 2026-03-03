package com.spincity.repository;

import com.spincity.model.membership.MembershipPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MembershipPlanRepository
        extends JpaRepository<MembershipPlan, Long> {

    Optional<MembershipPlan> findByPlanName(String planName);
}