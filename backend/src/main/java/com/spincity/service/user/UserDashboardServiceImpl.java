package com.spincity.service.user;

import com.spincity.dto.response.ActiveRentalDTO;
import com.spincity.dto.response.UserDashboardDTO;
import com.spincity.model.customer.Customer;
import com.spincity.model.rental.RentalTransaction;
import com.spincity.model.wallet.WalletTransaction;
import com.spincity.repository.*;
import com.spincity.repository.customer.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class UserDashboardServiceImpl implements UserDashboardService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RentalTransactionRepository rentalTransactionRepository;

    @Autowired
    private WalletTransactionRepository walletTransactionRepository;

    @Autowired
    private RideAnalyticsRepository rideAnalyticsRepository;

    @Override
    public UserDashboardDTO getUserDashboard(Integer customerId) {
        // Fetch customer
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        UserDashboardDTO dto = new UserDashboardDTO();

        // User Info
        dto.setName(customer.getCustomerName());
        dto.setEmail(customer.getCustomerEmail());
        dto.setMemberSince(customer.getRegistrationDate() != null ?
                customer.getRegistrationDate().format(DateTimeFormatter.ofPattern("MMM yyyy")) : "N/A");
        dto.setMembershipType(customer.getMembershipType() != null ? customer.getMembershipType() : "BASIC");
        dto.setMembershipExpiry(null); // TODO: Calculate from membership table if needed

        // Wallet Data
        dto.setWalletBalance(customer.getWalletBalance() != null ? customer.getWalletBalance() : 0.0);

        // Last Recharge
        Optional<WalletTransaction> lastRecharge = walletTransactionRepository
                .findLastRechargeByCustomerId(customerId);
        dto.setLastRecharge(lastRecharge.isPresent() ?
                lastRecharge.get().getTransactionDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) : "N/A");

        // Total Spent
        Double totalSpent = walletTransactionRepository.getTotalSpentByCustomerId(customerId);
        dto.setTotalSpent(totalSpent != null ? totalSpent : 0.0);

        // Stats from ride_analytics
        long totalRides = rentalTransactionRepository.countByCustomer_CustomerId(customerId);
        dto.setTotalRides((int) totalRides);

        BigDecimal totalDistance = rideAnalyticsRepository.getTotalDistanceByCustomerId(customerId);
        dto.setTotalDistance(totalDistance != null ? totalDistance.doubleValue() : 0.0);

        BigDecimal carbonSaved = rideAnalyticsRepository.getTotalCarbonSavedByCustomerId(customerId);
        dto.setCarbonSaved(carbonSaved != null ? carbonSaved.doubleValue() : 0.0);

        BigDecimal caloriesBurned = rideAnalyticsRepository.getTotalCaloriesBurnedByCustomerId(customerId);
        dto.setCaloriesBurned(caloriesBurned != null ? caloriesBurned.intValue() : 0);

        // Check for active rental
        RentalTransaction activeRental = rentalTransactionRepository
                .findActiveRentalByCustomerId(customerId);

        if (activeRental != null) {
            ActiveRentalDTO activeDTO = new ActiveRentalDTO();
            activeDTO.setRentalId(activeRental.getTransactionId());
            activeDTO.setCycleName(activeRental.getCycle().getCycleName());
            activeDTO.setCycleType(activeRental.getCycle().getCycleType());
            activeDTO.setStartTime(activeRental.getRentalStartTime()
                    .format(DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm a")));
            activeDTO.setStation(activeRental.getPickupStation().getStationName());

            // Calculate duration
            Duration duration = Duration.between(activeRental.getRentalStartTime(), LocalDateTime.now());
            long hours = duration.toHours();
            long minutes = duration.toMinutes() % 60;
            activeDTO.setDuration(hours + "h " + minutes + "m");

            activeDTO.setCurrentCharges(activeRental.getTotalAmount() != null ? activeRental.getTotalAmount() : 0.0);

            dto.setActiveRental(activeDTO);
        }

        return dto;
    }
}