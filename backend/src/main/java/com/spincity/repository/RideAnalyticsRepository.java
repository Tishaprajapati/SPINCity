package com.spincity.repository;

import com.spincity.model.analytics.RideAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface RideAnalyticsRepository extends JpaRepository<RideAnalytics, Integer> {

    // Find analytics by rental transaction ID
    Optional<RideAnalytics> findByRentalTransaction_TransactionId(Long transactionId);

    // Get total distance traveled by customer
    @Query("SELECT COALESCE(SUM(ra.distanceTraveled), 0) FROM RideAnalytics ra WHERE ra.customer.customerId = :customerId")
    BigDecimal getTotalDistanceByCustomerId(@Param("customerId") Integer customerId);

    // Get total carbon saved by customer
    @Query("SELECT COALESCE(SUM(ra.carbonSaved), 0) FROM RideAnalytics ra WHERE ra.customer.customerId = :customerId")
    BigDecimal getTotalCarbonSavedByCustomerId(@Param("customerId") Integer customerId);

    // Get total calories burned by customer
    @Query("SELECT COALESCE(SUM(ra.caloriesBurned), 0) FROM RideAnalytics ra WHERE ra.customer.customerId = :customerId")
    BigDecimal getTotalCaloriesBurnedByCustomerId(@Param("customerId") Integer customerId);
}