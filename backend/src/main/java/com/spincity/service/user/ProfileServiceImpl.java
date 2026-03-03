package com.spincity.service.user;

import com.spincity.dto.request.UpdateProfileRequest;
import com.spincity.model.customer.Customer;
import com.spincity.repository.customer.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileServiceImpl implements ProfileService {

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public Customer getProfile(Integer customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Don't send password
        customer.setPassword(null);
        return customer;
    }

    @Override
    @Transactional
    public Customer updateProfile(Integer customerId, UpdateProfileRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Update basic fields
        if (request.getCustomerName() != null) {
            customer.setCustomerName(request.getCustomerName());
        }
        if (request.getCustomerPhone() != null) {
            customer.setCustomerPhone(request.getCustomerPhone());
        }
        if (request.getCustomerAddress() != null) {
            customer.setCustomerAddress(request.getCustomerAddress());
        }
        if (request.getCustomerEmail() != null) {
            customer.setCustomerEmail(request.getCustomerEmail());
        }

        // Age is a String in the request – convert safely to Integer
        if (request.getAge() != null) {
            try {
                Integer age = Integer.parseInt(request.getAge());
                customer.setCustomerAge(age);
            } catch (NumberFormatException ex) {
                throw new RuntimeException("Invalid age value: " + request.getAge());
            }
        }

        // ID proof fields
        if (request.getIdProofType() != null) {
            customer.setIdProofType(request.getIdProofType());
        }
        if (request.getIdProofDocument() != null) {    // ✅ document path
            customer.setIdProofDocument(request.getIdProofDocument());
        }

        // Emergency contact details
        if (request.getEmergencyContact() != null) {
            customer.setEmergencyContact(request.getEmergencyContact());
        }
        if (request.getEmergencyName() != null) {
            customer.setEmergencyName(request.getEmergencyName());
        }

        // Simple debug logs so you can see values in the console
        System.out.println("Updating profile for customerId = " + customerId);
        System.out.println("EMAIL -> " + request.getCustomerEmail());
        System.out.println("AGE -> " + request.getAge());
        System.out.println("PROOF TYPE -> " + request.getIdProofType());

// ✅ REPLACE
        System.out.println("PROOF DOC -> " + request.getIdProofDocument());

        Customer updatedCustomer = customerRepository.save(customer);

        // Don't send password
        updatedCustomer.setPassword(null);
        return updatedCustomer;
    }
}