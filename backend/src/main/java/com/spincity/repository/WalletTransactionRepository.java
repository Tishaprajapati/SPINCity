package com.spincity.repository;

import com.spincity.model.wallet.WalletTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Integer> {

    // Find all transactions by customer ID
    List<WalletTransaction> findByCustomer_CustomerIdOrderByTransactionDateDesc(Integer customerId);

    // Find last recharge transaction
    @Query("SELECT w FROM WalletTransaction w WHERE w.customer.customerId = :customerId AND w.transactionType = 'Recharge' ORDER BY w.transactionDate DESC")
    Optional<WalletTransaction> findLastRechargeByCustomerId(@Param("customerId") Integer customerId);

    // Get total spent (all Debit transactions)
    @Query("SELECT COALESCE(SUM(w.amount), 0.0) FROM WalletTransaction w WHERE w.customer.customerId = :customerId AND w.transactionType = 'Debit'")
    Double getTotalSpentByCustomerId(@Param("customerId") Integer customerId);

    // Recent transactions (last 10)
    List<WalletTransaction> findTop10ByCustomer_CustomerIdOrderByTransactionDateDesc(Integer customerId);
}