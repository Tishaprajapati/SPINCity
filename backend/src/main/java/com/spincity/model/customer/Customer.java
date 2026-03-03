package com.spincity.model.customer;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Entity
@Table(name = "customer")
public class Customer {

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Integer getCustomerAge() {
        return customerAge;
    }

    public void setCustomerAge(Integer customerAge) {
        this.customerAge = customerAge;
    }

    public String getCustomerAddress() {
        return customerAddress;
    }

    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getIdProofType() {
        return idProofType;
    }

    public void setIdProofType(String idProofType) {
        this.idProofType = idProofType;
    }


    public LocalDate getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDate registrationDate) {
        this.registrationDate = registrationDate;
    }

    public String getMembershipType() {
        return membershipType;
    }

    public void setMembershipType(String membershipType) {
        this.membershipType = membershipType;
    }

    public Double getWalletBalance() {
        return walletBalance;
    }

    public void setWalletBalance(Double walletBalance) {
        this.walletBalance = walletBalance;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "customer_age")
    private Integer customerAge;

    @Column(name = "customer_address", nullable = false)
    private String customerAddress;

    @Column(name = "customer_email", unique = true)
    private String customerEmail;

    @Column(name = "customer_phone", nullable = false)
    private String customerPhone;

    @Column(name = "id_proof_type")
    private String idProofType;

    public String getIdProofDocument() {
        return idProofDocument;
    }

    public void setIdProofDocument(String idProofDocument) {
        this.idProofDocument = idProofDocument;
    }

    // ✅ ADD THIS
    @Column(name = "id_proof_document")
    private String idProofDocument;

    @Column(name = "registration_date")
    private LocalDate registrationDate;

    @Column(name = "membership_type")
    private String membershipType;

    @Column(name = "wallet_balance")
    private Double walletBalance;

    @Column(name = "password", nullable = false)
    private String password;


    @Column(name = "emergency_contact")
    private String emergencyContact;

    public String getFavSport() {
        return favSport;
    }

    public void setFavSport(String favSport) {
        this.favSport = favSport;
    }

    @Column(name = "favorite_sport", length = 100)
    private String favSport;
    public String getFavFood() {
        return favFood;
    }

    public void setFavFood(String favFood) {
        this.favFood = favFood;
    }

    @Column(name = "favorite_food", length = 100)
    private String favFood;

    @Column(name = "notifications_enabled")
    private Boolean notificationsEnabled = true;

    public Boolean getNotificationsEnabled() { return notificationsEnabled; }
    public void setNotificationsEnabled(Boolean notificationsEnabled) {
        this.notificationsEnabled = notificationsEnabled;
    }
    public String getEmergencyName() {
        return emergencyName;
    }

    public void setEmergencyName(String emergencyName) {
        this.emergencyName = emergencyName;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    @Column(name = "emergency_name")
    private String emergencyName;



}
