package com.spincity.repository;

import com.spincity.model.customer.Customer;
import com.spincity.model.membership.MembershipStatus;
import com.spincity.model.membership.UserMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserMembershipRepository extends JpaRepository<UserMembership, Long> {

    Optional<UserMembership> findByCustomerAndStatus(
            Customer customer,
            MembershipStatus status
    );
    @Query("SELECT um FROM UserMembership um WHERE um.customer.customerId = :customerId " +
            "AND um.status = 'ACTIVE'")
    UserMembership findActiveByCustomerId(@Param("customerId") Integer customerId);
    Optional<UserMembership> findTopByCustomerOrderByEndDateDesc(Customer customer);

    boolean existsByCustomerAndStatus(Customer customer, MembershipStatus status);
}
