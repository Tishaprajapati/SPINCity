package com.spincity.service.user;

import com.spincity.dto.request.UpdateProfileRequest;
import com.spincity.model.customer.Customer;

import java.util.List;
import java.util.Optional;

public interface CustomerService {

    Customer registerCustomer(Customer customer);

    List<Customer> getAllCustomers();

    Optional<Customer> getCustomerById(Integer id);

    Customer updateCustomer(Integer id, UpdateProfileRequest dto);

    boolean changePassword(Integer customerId, String currentPassword, String newPassword);

    void deleteCustomer(Integer id);
    boolean sendContactEmail(String name, String email, String phone, String subject, String message);
    boolean verifySecurityAnswersAndSendPassword(
            String email,
            String favFood,
            String favSport
    );
    boolean toggleNotifications(Integer customerId, boolean enabled);
    void sendBulkNotification(String subject, String message);

}
