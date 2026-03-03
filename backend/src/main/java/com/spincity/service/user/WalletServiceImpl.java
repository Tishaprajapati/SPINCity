package com.spincity.service.user;

import com.spincity.dto.request.WalletRechargeRequest;
import com.spincity.dto.response.WalletTransactionDTO;
import com.spincity.model.customer.Customer;
import com.spincity.model.wallet.TransactionType;
import com.spincity.model.wallet.WalletTransaction;
import com.spincity.repository.WalletTransactionRepository;
import com.spincity.repository.customer.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class WalletServiceImpl implements WalletService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private WalletTransactionRepository walletTransactionRepository;

    @Override
    @Transactional
    public WalletTransactionDTO rechargeWallet(WalletRechargeRequest request) {
        // Fetch customer
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Get current balance
        Double previousBalance = customer.getWalletBalance() != null ? customer.getWalletBalance() : 0.0;
        Double newBalance = previousBalance + request.getAmount();

        // Update customer wallet balance
        customer.setWalletBalance(newBalance);
        customerRepository.save(customer);

        // Create wallet transaction record
        WalletTransaction transaction = new WalletTransaction();
        transaction.setCustomer(customer);
        transaction.setTransactionType(TransactionType.Recharge);
        transaction.setAmount(request.getAmount());
        transaction.setPreviousBalance(previousBalance);
        transaction.setNewBalance(newBalance);
        transaction.setPaymentMethod(request.getPaymentMethod());
        transaction.setTransactionReference(generateTransactionReference());
        transaction.setDescription("Wallet Recharge");
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setCreatedAt(LocalDateTime.now());

        WalletTransaction savedTransaction = walletTransactionRepository.save(transaction);

        // Convert to DTO
        return convertToDTO(savedTransaction);
    }

    @Override
    public List<WalletTransactionDTO> getWalletTransactions(Integer customerId) {
        List<WalletTransaction> transactions = walletTransactionRepository
                .findByCustomer_CustomerIdOrderByTransactionDateDesc(customerId);

        return transactions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Double getWalletBalance(Integer customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return customer.getWalletBalance() != null ? customer.getWalletBalance() : 0.0;
    }

    // Helper methods
    private WalletTransactionDTO convertToDTO(WalletTransaction transaction) {
        WalletTransactionDTO dto = new WalletTransactionDTO();
        dto.setWalletTransactionId(transaction.getWalletTransactionId());
        dto.setTransactionType(transaction.getTransactionType().name());
        dto.setAmount(transaction.getAmount());
        dto.setPreviousBalance(transaction.getPreviousBalance());
        dto.setNewBalance(transaction.getNewBalance());
        dto.setPaymentMethod(transaction.getPaymentMethod());
        dto.setDescription(transaction.getDescription());
        dto.setTransactionDate(transaction.getTransactionDate());
        return dto;
    }

    private String generateTransactionReference() {
        return "WAL-SPIN-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}