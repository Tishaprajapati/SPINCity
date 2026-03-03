package com.spincity.dto.response;

import java.time.LocalDate;

public class UserDashboardDTO {

    // User Info
    private String name;
    private String email;
    private String memberSince;
    private String membershipType;
    private LocalDate membershipExpiry;

    // Wallet Data
    private Double walletBalance;
    private String lastRecharge;
    private Double totalSpent;

    // Stats
    private Integer totalRides;
    private Double totalDistance;
    private Double carbonSaved;
    private Integer caloriesBurned;

    // Active Rental
    private ActiveRentalDTO activeRental;

    // Constructors
    public UserDashboardDTO() {}

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMemberSince() { return memberSince; }
    public void setMemberSince(String memberSince) { this.memberSince = memberSince; }

    public String getMembershipType() { return membershipType; }
    public void setMembershipType(String membershipType) { this.membershipType = membershipType; }

    public LocalDate getMembershipExpiry() { return membershipExpiry; }
    public void setMembershipExpiry(LocalDate membershipExpiry) { this.membershipExpiry = membershipExpiry; }

    public Double getWalletBalance() { return walletBalance; }
    public void setWalletBalance(Double walletBalance) { this.walletBalance = walletBalance; }

    public String getLastRecharge() { return lastRecharge; }
    public void setLastRecharge(String lastRecharge) { this.lastRecharge = lastRecharge; }

    public Double getTotalSpent() { return totalSpent; }
    public void setTotalSpent(Double totalSpent) { this.totalSpent = totalSpent; }

    public Integer getTotalRides() { return totalRides; }
    public void setTotalRides(Integer totalRides) { this.totalRides = totalRides; }

    public Double getTotalDistance() { return totalDistance; }
    public void setTotalDistance(Double totalDistance) { this.totalDistance = totalDistance; }

    public Double getCarbonSaved() { return carbonSaved; }
    public void setCarbonSaved(Double carbonSaved) { this.carbonSaved = carbonSaved; }

    public Integer getCaloriesBurned() { return caloriesBurned; }
    public void setCaloriesBurned(Integer caloriesBurned) { this.caloriesBurned = caloriesBurned; }

    public ActiveRentalDTO getActiveRental() { return activeRental; }
    public void setActiveRental(ActiveRentalDTO activeRental) { this.activeRental = activeRental; }
}