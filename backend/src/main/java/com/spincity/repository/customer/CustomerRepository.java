package com.spincity.repository.customer;

import com.spincity.model.customer.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    // You can add custom query methods later like:
//     Customer findByCustomerEmail(String email);
    Optional<Customer> findByCustomerEmail(String email);

    Optional<Customer> findByCustomerPhone(String phone);

    // Find all customers with notifications enabled
    List<Customer> findByNotificationsEnabled(boolean enabled);
    // List<Customer> findByMembershipType(MembershipType type);
}
