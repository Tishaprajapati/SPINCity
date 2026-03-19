package com.spincity.repository;

import com.spincity.model.payment.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Query(value = "SELECT COALESCE(SUM(amount),0) FROM payment WHERE DATE(payment_date) = CURDATE() AND" +
            " payment_status = 'Success'", nativeQuery = true)
    double getTodayRevenue();

    // Today's revenue at a specific station
    @Query(value = "SELECT COALESCE(SUM(p.amount), 0) FROM payment p " +
            "JOIN rental_transaction r ON p.transaction_id = r.transaction_id " +
            "WHERE DATE(p.payment_date) = CURDATE() " +
            "AND p.payment_status = 'Success' " +
            "AND r.pickup_station_id = :stationId", nativeQuery = true)
    double getTodayRevenueByStation(@Param("stationId") Long stationId);
}
