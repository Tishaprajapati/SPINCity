package com.spincity.repository;

import com.spincity.dto.response.RecentRentalDTO;
import com.spincity.dto.response.RentalHistoryDTO;
import com.spincity.model.rental.RentalTransaction;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RentalTransactionRepository extends JpaRepository<RentalTransaction, Long> {

    @Query("""
        SELECT new com.spincity.dto.response.RecentRentalDTO(
            r.transactionId,
            c.customerName,
            cy.cycleName,
            ps.stationName,
            r.rentalStartTime,
            r.rentalEndTime,
            r.totalAmount,
            CAST(r.rentalStatus AS string)
        )
        FROM RentalTransaction r
        JOIN r.customer c
        JOIN r.cycle cy
        JOIN r.pickupStation ps
        ORDER BY r.rentalStartTime DESC
    """)
    List<RecentRentalDTO> findRecentRentals(Pageable pageable);

    // Find all rentals by customer
    List<RentalTransaction> findByCustomer_CustomerIdOrderByRentalStartTimeDesc(Integer customerId);

    // ── KEY FIX ───────────────────────────────────────────────────────────────
    // Only returns a rental as "active" if it is BOTH:
    //   rentalStatus = Active  (employee approved it)
    //   approvalStatus = Approved
    // This means a pending cash booking (approvalStatus=Pending, rentalStatus=Pending)
    // does NOT block the customer from making a new booking after a rejection.
    @Query("SELECT r FROM RentalTransaction r " +
            "WHERE r.customer.customerId = :customerId " +
            "AND r.rentalStatus = 'Active' " +
            "AND r.approvalStatus = 'Approved'")
    RentalTransaction findActiveRentalByCustomerId(@Param("customerId") Integer customerId);

    // Pending approvals at a specific station — unchanged, already correct
    // ✅ Only show rides where rentalStatus is ALSO Pending (not Active)
// This means it's a NEW booking request, not an end-ride request
    @Query("SELECT r FROM RentalTransaction r WHERE r.pickupStation.stationId = :stationId " +
            "AND r.approvalStatus = 'Pending' " +
            "AND r.rentalStatus = 'Pending'")  // ✅ ADD THIS LINE
    List<RentalTransaction> findPendingApprovalsByStation(@Param("stationId") Long stationId);

    // All active rides at a specific station
    @Query("SELECT r FROM RentalTransaction r WHERE r.pickupStation.stationId = :stationId " +
            "AND r.rentalStatus = 'Active'")
    List<RentalTransaction> findActiveRidesByStation(@Param("stationId") Long stationId);

    // Today's rentals at a station
    @Query("SELECT r FROM RentalTransaction r WHERE r.pickupStation.stationId = :stationId " +
            "AND DATE(r.rentalStartTime) = CURRENT_DATE")
    List<RentalTransaction> findTodaysRentalsByStation(@Param("stationId") Long stationId);

    // Count today's customers at a station
    @Query("SELECT COUNT(r) FROM RentalTransaction r WHERE r.pickupStation.stationId = :stationId " +
            "AND DATE(r.rentalStartTime) = CURRENT_DATE")
    Long countTodaysCustomersByStation(@Param("stationId") Long stationId);

    @Query("SELECT CAST(r.approvalStatus AS string) FROM RentalTransaction r WHERE r.transactionId = :transactionId")
    String findApprovalStatusById(@Param("transactionId") Long transactionId);

    // Count total rides by customer
    long countByCustomer_CustomerId(Integer customerId);

    @Query("SELECT CAST(r.rentalStatus AS string) FROM RentalTransaction r WHERE r.transactionId = :transactionId")
    String findRentalStatusById(@Param("transactionId") Long transactionId);


    // Rides ending at this station (status Active OR Pending end request)
    @Query("SELECT r FROM RentalTransaction r WHERE r.returnStation.stationId = :stationId " +
            "AND r.rentalStatus = 'Pending' " +
            "AND r.approvalStatus = 'Approved'")  // ✅ Already approved ride, just ending
    List<RentalTransaction> findRidesEndingAtStation(@Param("stationId") Long stationId);

    // Last 30 days rides for a station
    @Query("SELECT r FROM RentalTransaction r WHERE " +
            "r.pickupStation.stationId = :stationId " +
            "AND r.rentalStartTime >= :fromDate " +
            "AND r.rentalStatus = 'Completed'")
    List<RentalTransaction> findCompletedRidesByStationAndDateRange(
            @Param("stationId") Long stationId,
            @Param("fromDate") LocalDateTime fromDate
    );


    // Rider count last 7 days
    @Query("SELECT COUNT(r) FROM RentalTransaction r WHERE " +
            "r.pickupStation.stationId = :stationId " +
            "AND r.rentalStartTime >= :fromDate")
    Long countRidersByStationAndDateRange(
            @Param("stationId") Long stationId,
            @Param("fromDate") LocalDateTime fromDate
    );

    // ✅ Keep only these — uses total_amount from rental_transaction
    @Query(value = "SELECT COALESCE(SUM(total_amount), 0) FROM rental_transaction " +
            "WHERE pickup_station_id = :stationId " +
            "AND rental_status = 'Completed' " +
            "AND rental_start_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)", nativeQuery = true)
    double getWeeklyRevenueByStation(@Param("stationId") Long stationId);

    @Query(value = "SELECT COALESCE(SUM(total_amount), 0) FROM rental_transaction " +
            "WHERE pickup_station_id = :stationId " +
            "AND rental_status = 'Completed' " +
            "AND rental_start_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)", nativeQuery = true)
    double getMonthlyRevenueByStation(@Param("stationId") Long stationId);

    // Today's riders for BOTH pickup and return station
    @Query("SELECT r FROM RentalTransaction r WHERE " +
            "(r.pickupStation.stationId = :stationId OR r.returnStation.stationId = :stationId) " +
            "AND DATE(r.rentalStartTime) = CURRENT_DATE")
    List<RentalTransaction> findTodaysRentalsByStationBoth(@Param("stationId") Long stationId);
    // Rental history with all details
    @Query("""
        SELECT new com.spincity.dto.response.RentalHistoryDTO(
            r.transactionId,
            cy.cycleName,
            cy.cycleType,
            ps.stationName,
            COALESCE(rs.stationName, 'Not Returned'),
            r.rentalStartTime,
            r.rentalEndTime,
            r.rentalDuration,
            r.totalAmount,
            CAST(r.paymentStatus AS string),
            CAST(r.rentalStatus AS string)
        )
        FROM RentalTransaction r
        JOIN r.customer c
        JOIN r.cycle cy
        JOIN r.pickupStation ps
        LEFT JOIN r.returnStation rs
        WHERE c.customerId = :customerId
        ORDER BY r.rentalStartTime DESC
    """)
    List<RentalHistoryDTO> findRentalHistoryByCustomerId(@Param("customerId") Integer customerId);
}