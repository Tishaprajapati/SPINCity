package com.spincity.service.user;

import com.spincity.dto.request.UpgradeMembershipRequest;
import com.spincity.dto.response.MembershipPlanDTO;
import com.spincity.dto.response.UserMembershipDTO;
import com.spincity.model.customer.Customer;
import com.spincity.model.membership.MembershipPlan;
import com.spincity.model.membership.MembershipStatus;
import com.spincity.model.membership.UserMembership;
import com.spincity.repository.customer.CustomerRepository;
import com.spincity.repository.MembershipPlanRepository;
import com.spincity.repository.UserMembershipRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MembershipServiceImpl implements MembershipService {

    private final MembershipPlanRepository planRepository;
    private final UserMembershipRepository userMembershipRepository;
    private final CustomerRepository customerRepository;

    public MembershipServiceImpl(
            MembershipPlanRepository planRepository,
            UserMembershipRepository userMembershipRepository,
            CustomerRepository customerRepository
    ) {
        this.planRepository = planRepository;
        this.userMembershipRepository = userMembershipRepository;
        this.customerRepository = customerRepository;
    }

    // 🔹 Fetch all available membership plans
    @Override
    public List<MembershipPlanDTO> getAllPlans() {
        return planRepository.findAll()
                .stream()
                .map(this::toPlanDTO)
                .collect(Collectors.toList());
    }

    // 🔹 Get current active membership of user
    @Override
    public UserMembershipDTO getCurrentMembership(Integer customerId) {
        Customer customer = getCustomer(customerId);

        return userMembershipRepository
                .findByCustomerAndStatus(customer, MembershipStatus.ACTIVE)
                .map(this::toUserMembershipDTO)
                .orElseGet(() -> {
                    // ✅ FIX: Return default BASIC membership if none exists
                    UserMembershipDTO basic = new UserMembershipDTO();
                    basic.setPlanName("BASIC");
                    basic.setStatus(MembershipStatus.ACTIVE);
                    basic.setStartDate(LocalDate.now());
                    basic.setEndDate(LocalDate.of(2099, 12, 31));
                    return basic;
                });
    }

    // 🔹 Cancel membership
    @Override
    public UserMembershipDTO cancelMembership(Integer customerId) {
        Customer customer = getCustomer(customerId);

        UserMembership membership = userMembershipRepository
                .findByCustomerAndStatus(customer, MembershipStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("No active membership to cancel"));

        // ✅ FIX: Don't allow cancelling BASIC plan
        if ("BASIC".equals(membership.getMembershipPlan().getPlanName())) {
            throw new RuntimeException("Cannot cancel BASIC plan");
        }

        membership.setStatus(MembershipStatus.CANCELLED);
        membership.setEndDate(LocalDate.now());
        userMembershipRepository.save(membership);
        customer.setMembershipType("hourly"); // or "BASIC" depending on your default
        customerRepository.save(customer);
        return toUserMembershipDTO(membership);
    }

    // 🔹 Upgrade membership logic
    @Override
    public UserMembershipDTO upgradeMembership(
            Integer customerId,
            UpgradeMembershipRequest request
    ) {
        Customer customer = getCustomer(customerId);

        MembershipPlan newPlan = planRepository.findById(request.getMembershipPlanId())
                .orElseThrow(() -> new RuntimeException("Membership plan not found"));

        // ✅ FIX: Expire old membership if exists (allow upgrades)
        userMembershipRepository
                .findByCustomerAndStatus(customer, MembershipStatus.ACTIVE)
                .ifPresent(old -> {
                    // Only expire if it's a paid plan, not BASIC
                    if (!"BASIC".equals(old.getMembershipPlan().getPlanName())) {
                        old.setStatus(MembershipStatus.EXPIRED);
                        old.setEndDate(LocalDate.now());
                        userMembershipRepository.save(old);
                    }
                });

        // Create new membership
        UserMembership membership = new UserMembership();
        membership.setCustomer(customer);
        membership.setMembershipPlan(newPlan);
        membership.setStartDate(LocalDate.now());
        membership.setEndDate(LocalDate.now().plusDays(newPlan.getDurationInDays()));
        membership.setStatus(MembershipStatus.ACTIVE);

        userMembershipRepository.save(membership);

// ✅ ADD THESE 3 LINES — update customer's membership_type
        customer.setMembershipType(newPlan.getPlanName()); // "MONTHLY", "WEEKLY" etc
        customerRepository.save(customer);
        System.out.println(">>> Updated customer membership_type to: " + newPlan.getPlanName());

        return toUserMembershipDTO(membership);
    }

    // ==========================
    // 🔽 Private helper methods
    // ==========================

    private Customer getCustomer(Integer customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    private MembershipPlanDTO toPlanDTO(MembershipPlan plan) {
        MembershipPlanDTO dto = new MembershipPlanDTO();
        dto.setId(plan.getId());
        dto.setPlanName(plan.getPlanName());
        dto.setDurationInDays(plan.getDurationInDays());
        dto.setPrice(plan.getPrice());
        return dto;
    }

    private UserMembershipDTO toUserMembershipDTO(UserMembership membership) {
        UserMembershipDTO dto = new UserMembershipDTO();
        dto.setPlanName(membership.getMembershipPlan().getPlanName());
        dto.setStatus(membership.getStatus());
        dto.setStartDate(membership.getStartDate());
        dto.setEndDate(membership.getEndDate());
        return dto;
    }
}