package com.spincity.dto.response;

import java.time.LocalDateTime;

public class WalletTransactionDTO {

    private Integer walletTransactionId;
    private String transactionType;
    private Double amount;
    private Double previousBalance;
    private Double newBalance;
    private String paymentMethod;
    private String description;
    private LocalDateTime transactionDate;

    public WalletTransactionDTO() {}

    // Getters and Setters
    public Integer getWalletTransactionId() { return walletTransactionId; }
    public void setWalletTransactionId(Integer walletTransactionId) { this.walletTransactionId = walletTransactionId; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Double getPreviousBalance() { return previousBalance; }
    public void setPreviousBalance(Double previousBalance) { this.previousBalance = previousBalance; }

    public Double getNewBalance() { return newBalance; }
    public void setNewBalance(Double newBalance) { this.newBalance = newBalance; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }
}