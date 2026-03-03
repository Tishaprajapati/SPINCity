package com.spincity.dto.request;

public class WalletRechargeRequest {

    private Integer customerId;
    private Double amount;
    private String paymentMethod; // "UPI", "Credit Card", "Debit Card", "Net Banking"

    // Constructors
    public WalletRechargeRequest() {}

    // Getters and Setters
    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}