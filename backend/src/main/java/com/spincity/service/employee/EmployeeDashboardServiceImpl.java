package com.spincity.service.employee;

import com.spincity.dto.employee.*;
import com.spincity.model.rental.RentalTransaction;
import com.spincity.model.employee.Staff;
import com.spincity.repository.RentalTransactionRepository;
import com.spincity.repository.PaymentRepository;
import com.spincity.repository.CycleRepository;
import com.spincity.repository.customer.CustomerRepository;
import com.spincity.repository.UserMembershipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.spincity.model.cycle.Cycle;
import com.spincity.model.cycle.CycleStatus;
import com.spincity.model.station.Station;
import com.spincity.repository.StationRepository;
import com.spincity.model.rental.RentalStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeDashboardServiceImpl implements EmployeeDashboardService {

    private final RentalTransactionRepository rentalTransactionRepository;
    private final PaymentRepository paymentRepository;
    private final CycleRepository cycleRepository;
    private final CustomerRepository customerRepository;
    private final UserMembershipRepository userMembershipRepository;
    private final StationRepository stationRepository;

    // ── Dashboard Summary ─────────────────────────────────────────────────────

    @Override
    public EmployeeDashboardDTO getDashboardSummary(Long stationId) {

        double todayRevenue = paymentRepository.getTodayRevenueByStation(stationId);
        Long todayCustomers = rentalTransactionRepository.countTodaysCustomersByStation(stationId);

        List<RentalTransaction> activeRides =
                rentalTransactionRepository.findActiveRidesByStation(stationId);

        List<RentalTransaction> pendingApprovals =
                rentalTransactionRepository.findPendingApprovalsByStation(stationId);

        Long totalCycles = cycleRepository.countByCurrentStationId(stationId);
        Long defectiveCycles = cycleRepository.countDefectiveCyclesByStation(stationId);
        Long availableCycles = cycleRepository.countAvailableCyclesByStation(stationId);

        // ✅ Replace null with actual station name
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Station not found"));

        return new EmployeeDashboardDTO(
                stationId,
                station.getStationName(),                          // stationName — will add below
                todayRevenue,
                todayCustomers,
                (long) activeRides.size(),
                (long) pendingApprovals.size(),
                totalCycles,
                defectiveCycles,
                availableCycles
        );
    }

    // ── Pending Approvals ─────────────────────────────────────────────────────

    @Override
    public List<ApprovalRequestDTO> getPendingApprovals(Long stationId) {
        return rentalTransactionRepository
                .findPendingApprovalsByStation(stationId)
                .stream()
                .map(r -> new ApprovalRequestDTO(
                        r.getCustomer().getCustomerId(),
                        r.getTransactionId(),// ADD as first param
                        r.getCustomer().getCustomerName(),
                        r.getCustomer().getCustomerPhone(),
                        r.getCycle().getCycleName(),
                        r.getCycle().getCycleType(),
                        r.getDepositStatus(),
                        r.getPaymentStatus(),
                        r.getRentalStartTime()
                ))
                .collect(Collectors.toList());
    }

    // ── Approve / Reject Ride ─────────────────────────────────────────────────

    @Override
    public void updatePaymentStatus(Long transactionId, String status) {
        RentalTransaction transaction = rentalTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        transaction.setPaymentStatus(status);
        rentalTransactionRepository.save(transaction);
    }


    @Override
    public void approveRide(Long transactionId, Long empId, String action) {
        RentalTransaction transaction = rentalTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found: " + transactionId));

        if (action.equalsIgnoreCase("Approved")) {
            if (!"Paid".equals(transaction.getPaymentStatus())) {
                throw new RuntimeException("Cannot approve: Payment not marked as Paid");
            }
            if (!"COLLECTED".equals(transaction.getDepositStatus())) {
                throw new RuntimeException("Cannot approve: Deposit not collected");
            }
        }

        Staff emp = new Staff();
        emp.setId(empId);

        transaction.setApprovedByEmp(emp);
        transaction.setApprovalTime(LocalDateTime.now());

        // REPLACE WITH
        if (action.equalsIgnoreCase("Approved")) {
            transaction.setApprovalStatus(RentalTransaction.ApprovalStatus.Approved);
            transaction.setRentalStatus(com.spincity.model.rental.RentalStatus.Active);

            // NOW update cycle status
            Cycle cycle = transaction.getCycle();
            cycle.setCurrentStatus(CycleStatus.Rented);
            cycle.setCurrentStationId(null);
            cycleRepository.save(cycle);

            // NOW reduce station count
            Station station = transaction.getPickupStation();
            if (station.getAvailableCycles() != null && station.getAvailableCycles() > 0) {
                station.setAvailableCycles(station.getAvailableCycles() - 1);
                stationRepository.save(station);
            }
        } else {
            transaction.setApprovalStatus(RentalTransaction.ApprovalStatus.Rejected);
        }

        rentalTransactionRepository.save(transaction);
    }

    // ── Today's Riders ────────────────────────────────────────────────────────

    @Override
    public List<RiderListDTO> getTodaysRiders(Long stationId) {
        return rentalTransactionRepository
                .findTodaysRentalsByStationBoth(stationId) // ✅ changed method
                .stream()
                .map(r -> new RiderListDTO(
                        r.getCustomer().getCustomerId(),
                        r.getTransactionId(),
                        r.getCustomer().getCustomerName(),
                        r.getCustomer().getCustomerPhone(),
                        r.getCycle().getCycleName(),
                        r.getRentalStatus().name(),
                        r.getDepositStatus(),
                        r.getRentalStartTime(),
                        r.getRentalEndTime()
                ))
                .collect(Collectors.toList());
    }

    // ── Customer Details ──────────────────────────────────────────────────────

    @Override
    public CustomerDetailDTO getCustomerDetails(Integer customerId) {

        var customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found: " + customerId));
        System.out.println(">>> idProofDocument = " + customer.getIdProofDocument());
        var membership = userMembershipRepository
                .findActiveByCustomerId(customerId);

        long totalRides = rentalTransactionRepository
                .countByCustomer_CustomerId(customerId);

        return new CustomerDetailDTO(
                customer.getCustomerId(),           // Integer customerId
                customer.getCustomerName(),         // String customerName
                customer.getCustomerEmail(),        // String customerEmail
                customer.getCustomerPhone(),        // String customerPhone
                customer.getCustomerAddress(),      // String customerAddress
                customer.getIdProofDocument(),      // String idProofUrl  ← ADD THIS
                customer.getMembershipType(),       // String membershipType
                membership != null ? membership.getStatus().name() : "No Membership", // String membershipStatus
                membership != null ? membership.getStartDate() : null,  // LocalDate membershipStart
                membership != null ? membership.getEndDate() : null,    // LocalDate membershipEnd
                totalRides,                         // Long totalRides
                customer.getWalletBalance()         // Double walletBalance

        );


    }

    @Override
    public String getRideStatus(Long transactionId) {
        return rentalTransactionRepository.findRentalStatusById(transactionId);
    }

    @Override
    public void forfeitDeposit(Long transactionId) {
        RentalTransaction transaction = rentalTransactionRepository
                .findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        transaction.setDepositStatus("FORFEITED");
        rentalTransactionRepository.save(transaction);
    }

    @Override
    public void completeRide(Long transactionId, Integer empId) {
        RentalTransaction rental = rentalTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        // ✅ Complete ride regardless of deposit status
        rental.setRentalStatus(RentalStatus.Completed);
        rental.setRentalEndTime(LocalDateTime.now());

        Cycle cycle = rental.getCycle();
        cycle.setCurrentStatus(CycleStatus.Available);
        cycle.setCurrentStationId(rental.getReturnStation().getStationId());
        cycleRepository.save(cycle);

        Station station = rental.getReturnStation();
        if (station != null) {
            station.setAvailableCycles(station.getAvailableCycles() + 1);
            stationRepository.save(station);
        }

        rentalTransactionRepository.save(rental);
    }

    @Override
    public void collectDeposit(Long transactionId) {
        RentalTransaction transaction = rentalTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found: " + transactionId));
        transaction.setDepositStatus("COLLECTED");
        rentalTransactionRepository.save(transaction);
    }

    @Override
    public void returnDeposit(Long transactionId) {
        RentalTransaction transaction = rentalTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found: " + transactionId));
        transaction.setDepositStatus("RETURNED");
        rentalTransactionRepository.save(transaction);
    }

    @Override
    public StationAnalyticsDTO getStationAnalytics(Long stationId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime weekAgo = now.minusDays(7);
        LocalDateTime monthAgo = now.minusDays(30);

        // Revenue
        double todayRev = paymentRepository.getTodayRevenueByStation(stationId);

        double weeklyRev = rentalTransactionRepository.getWeeklyRevenueByStation(stationId);
        double monthlyRev = rentalTransactionRepository.getMonthlyRevenueByStation(stationId);
        // Rider counts
        long todayCount = rentalTransactionRepository.countTodaysCustomersByStation(stationId);
        long weeklyCount = rentalTransactionRepository.countRidersByStationAndDateRange(stationId, weekAgo);
        long monthlyCount = rentalTransactionRepository.countRidersByStationAndDateRange(stationId, monthAgo);

        // Ride history list — last 30 days
        List<RideHistoryRowDTO> rides = rentalTransactionRepository
                .findCompletedRidesByStationAndDateRange(stationId, monthAgo)
                .stream()
                .map(r -> new RideHistoryRowDTO(
                        r.getTransactionId(),
                        r.getCustomer().getCustomerName(),
                        r.getCustomer().getCustomerPhone(),
                        r.getCycle().getCycleName(),
                        r.getPickupStation().getStationName(),
                        r.getReturnStation() != null ? r.getReturnStation().getStationName() : "—",
                        r.getRentalStartTime(),
                        r.getRentalEndTime(),
                        r.getRentalDuration(),
                        r.getTotalAmount(),
                        r.getPaymentStatus(),
                        r.getDepositStatus(),
                        r.getRentalStatus().name()
                ))
                .collect(Collectors.toList());

        // Add this line to get station name
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Station not found"));

        return new StationAnalyticsDTO(
                stationId,
                station.getStationName(), // ✅ instead of null
                todayRev, weeklyRev, monthlyRev,
                todayCount, weeklyCount, monthlyCount,
                rides
        );
    }

    @Override
    public List<ActiveRideDTO> getActiveRides(Integer stationId) {
        return rentalTransactionRepository
                .findRidesEndingAtStation((long) stationId) // ✅ changed method
                .stream()
                .map(r -> new ActiveRideDTO(
                        r.getTransactionId(),
                        r.getCustomer().getCustomerName(),
                        r.getCustomer().getCustomerPhone(),
                        r.getCycle().getCycleName(),
                        String.valueOf(r.getCycle().getCycleType()),
                        r.getRentalStartTime(),
                        r.getRentalEndTime(),
                        r.getDepositStatus() != null ? r.getDepositStatus() : "NOT_PAID",
                        r.getPickupStation().getStationId(),
                        r.getReturnStation() != null ? r.getReturnStation().getStationId() : null
                ))
                .collect(Collectors.toList());
    }
}