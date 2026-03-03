package com.spincity.service.employee;

import com.spincity.dto.employee.ApprovalRequestDTO;
import com.spincity.dto.employee.CustomerDetailDTO;
import com.spincity.dto.employee.EmployeeDashboardDTO;
import com.spincity.dto.employee.RiderListDTO;
import com.spincity.model.rental.RentalTransaction;
import com.spincity.model.employee.Staff;
import com.spincity.repository.RentalTransactionRepository;
import com.spincity.repository.PaymentRepository;
import com.spincity.repository.CycleRepository;
import com.spincity.repository.customer.CustomerRepository;
import com.spincity.repository.UserMembershipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

        return new EmployeeDashboardDTO(
                stationId,
                null,                          // stationName — will add below
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
                        r.getTransactionId(),
                        r.getCustomer().getCustomerName(),
                        r.getCustomer().getCustomerPhone(),
                        r.getCycle().getCycleName(),
                        r.getCycle().getCycleType(),
                        r.getDepositStatus(),
                        r.getPaymentStatus().name(),

                        r.getRentalStartTime()
                ))
                .collect(Collectors.toList());
    }

    // ── Approve / Reject Ride ─────────────────────────────────────────────────

    @Override
    public void approveRide(Long transactionId, Long empId, String action) {
        RentalTransaction transaction = rentalTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found: " + transactionId));

        Staff emp = new Staff();
        emp.setId(empId);

        transaction.setApprovedByEmp(emp);
        transaction.setApprovalTime(LocalDateTime.now());

        if (action.equalsIgnoreCase("Approved")) {
            transaction.setApprovalStatus(RentalTransaction.ApprovalStatus.Approved);
            transaction.setRentalStatus(com.spincity.model.rental.RentalStatus.Active);
        } else {
            transaction.setApprovalStatus(RentalTransaction.ApprovalStatus.Rejected);
        }

        rentalTransactionRepository.save(transaction);
    }

    // ── Today's Riders ────────────────────────────────────────────────────────

    @Override
    public List<RiderListDTO> getTodaysRiders(Long stationId) {
        return rentalTransactionRepository
                .findTodaysRentalsByStation(stationId)
                .stream()
                .map(r -> new RiderListDTO(
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

        var membership = userMembershipRepository
                .findActiveByCustomerId(customerId);

        long totalRides = rentalTransactionRepository
                .countByCustomer_CustomerId(customerId);

        return new CustomerDetailDTO(
                customer.getCustomerId(),
                customer.getCustomerName(),
                customer.getCustomerEmail(),
                customer.getCustomerPhone(),
                customer.getCustomerAddress(),
                customer.getMembershipType(),
                membership != null ? membership.getStatus().name() : "No Membership",
                membership != null ? membership.getStartDate() : null,
                membership != null ? membership.getEndDate() : null,
                totalRides,
                customer.getWalletBalance()
        );
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
}