package com.spincity.service.user;

import com.spincity.dto.request.StartRentalRequest;
import com.spincity.dto.response.ActiveRentalDTO;
import com.spincity.dto.response.RentalHistoryDTO;
import com.spincity.model.customer.Customer;
import com.spincity.model.cycle.Cycle;
import com.spincity.model.cycle.CycleStatus;
import com.spincity.model.rental.RentalTransaction;
import com.spincity.model.station.Station;
import com.spincity.repository.CycleRepository;
import com.spincity.repository.RentalTransactionRepository;
import com.spincity.repository.StationRepository;
import com.spincity.repository.customer.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.spincity.model.payment.PaymentStatus;
import com.spincity.model.rental.RentalStatus;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class RentalServiceImpl implements RentalService {

    @Autowired
    private RentalTransactionRepository rentalTransactionRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CycleRepository cycleRepository;

    @Autowired
    private StationRepository stationRepository;

    @Override
    public ActiveRentalDTO getActiveRental(Integer customerId) {
        RentalTransaction activeRental = rentalTransactionRepository
                .findActiveRentalByCustomerId(customerId);

        if (activeRental == null) {
            return null;
        }

        ActiveRentalDTO dto = new ActiveRentalDTO();
        dto.setRentalId(activeRental.getTransactionId());
        dto.setCycleName(activeRental.getCycle().getCycleName());
        dto.setCycleType(activeRental.getCycle().getCycleType());
        dto.setStartTime(activeRental.getRentalStartTime()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm a")));
        dto.setStation(activeRental.getPickupStation().getStationName());
        dto.setPickupStationId(activeRental.getPickupStation().getStationId());
        dto.setReturnStationId(
                activeRental.getReturnStation() != null
                        ? activeRental.getReturnStation().getStationId()
                        : null
        );

        Duration duration = Duration.between(activeRental.getRentalStartTime(), LocalDateTime.now());
        long hours = duration.toHours();
        long minutes = duration.toMinutes() % 60;
        dto.setDuration(hours + "h " + minutes + "m");

        dto.setExpectedEndTime(
                activeRental.getRentalEndTime() != null
                        ? activeRental.getRentalEndTime()
                        .format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"))
                        : null
        );
        dto.setDepositStatus(activeRental.getDepositStatus() != null
                ? activeRental.getDepositStatus()
                : "NOT_PAID");
        dto.setCurrentCharges(activeRental.getTotalAmount() != null
                ? activeRental.getTotalAmount() : 0.0);

        return dto;
    }

    @Override
    public List<RentalHistoryDTO> getRentalHistory(Integer customerId) {
        return rentalTransactionRepository.findRentalHistoryByCustomerId(customerId);
    }

    @Override
    @Transactional
    public RentalHistoryDTO startRental(StartRentalRequest request) {
        // Validate customer
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // ── Check for existing ACTIVE (approved) rental only ──────────────────
        // We use the query that only returns rentalStatus = Active AND approvalStatus = Approved
        // so a pending/rejected cash booking does NOT block a new booking.
        RentalTransaction existingActiveRental = rentalTransactionRepository
                .findActiveRentalByCustomerId(request.getCustomerId());
        if (existingActiveRental != null) {
            throw new RuntimeException("Customer already has an active rental");
        }

        // Validate cycle
        Cycle cycle = cycleRepository.findById(request.getCycleId().longValue())
                .orElseThrow(() -> new RuntimeException("Cycle not found"));

        if (!cycle.getCurrentStatus().equals(CycleStatus.Available)) {
            throw new RuntimeException("Cycle is not available for rent");
        }

        // Validate pickup station
        Station pickupStation = stationRepository.findById(request.getPickupStationId().longValue())
                .orElseThrow(() -> new RuntimeException("Station not found"));

        // ── Create rental transaction ─────────────────────────────────────────
        RentalTransaction rental = new RentalTransaction();
        rental.setCustomer(customer);
        rental.setCycle(cycle);
        rental.setPickupStation(pickupStation);
        rental.setRentalStartTime(LocalDateTime.now());

        // ── KEY FIX: Set rentalStatus = Pending, NOT Active ──────────────────
        // For Cash on Pickup: stays Pending until employee approves
        // For UPI/Card/Wallet: will also be Pending until approved,
        //   but the frontend skips the approval wait for digital payments
        rental.setRentalStatus(RentalStatus.Pending);

        rental.setApprovalStatus(RentalTransaction.ApprovalStatus.Pending);
        rental.setPaymentStatus("Pending");
        rental.setDepositStatus("NOT_PAID");

        if (request.getBookedAmount() != null && request.getBookedAmount() > 0) {
            rental.setTotalAmount(request.getBookedAmount());
        } else {
            rental.setTotalAmount(0.0);
        }

        if (request.getExpectedReturnTime() != null) {
            rental.setRentalEndTime(LocalDateTime.parse(request.getExpectedReturnTime()));
        }

        if (request.getReturnStationId() != null) {
            Station returnStation = stationRepository
                    .findById(request.getReturnStationId().longValue())
                    .orElse(null);
            if (returnStation != null) {
                rental.setReturnStation(returnStation);
            }
        }

        rental.setCreatedAt(LocalDateTime.now());
        rental.setUpdatedAt(LocalDateTime.now());

        // ── KEY FIX: Do NOT touch cycle status or station count here ─────────
        // These are updated in approveRide() when employee approves.
        // Previously this was done here AND in approveRide, causing double-decrement.

        RentalTransaction savedRental = rentalTransactionRepository.save(rental);
        return convertToHistoryDTO(savedRental);
    }


    @Override
    @Transactional
    public RentalHistoryDTO endRental(Long transactionId, Integer returnStationId) {
        RentalTransaction rental = rentalTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Rental transaction not found"));

        if (!rental.getRentalStatus().equals(RentalStatus.Active)) {
            throw new RuntimeException("Rental is not active");
        }

        Station returnStation = stationRepository.findById(returnStationId.longValue())
                .orElseThrow(() -> new RuntimeException("Return station not found"));

        LocalDateTime endTime = LocalDateTime.now();
        Duration duration = Duration.between(rental.getRentalStartTime(), endTime);
        int durationMinutes = (int) duration.toMinutes();

        Customer customer = rental.getCustomer();
        String membershipType = customer.getMembershipType();

        int freeMinutes = 0;
        if (membershipType != null) {
            switch (membershipType.toUpperCase()) {
                case "MONTHLY":   freeMinutes = 15; break;
                case "QUARTERLY": freeMinutes = 30; break;
                default:          freeMinutes = 0;  break;
            }
        }

        double finalAmount;
        if (durationMinutes <= freeMinutes) {
            finalAmount = 0.0;
        } else if (rental.getTotalAmount() != null && rental.getTotalAmount() > 0) {
            finalAmount = rental.getTotalAmount();
        } else {
            finalAmount = Math.ceil(durationMinutes / 30.0) * 5.0;
        }

        rental.setRentalEndTime(endTime);
        rental.setRentalDuration(durationMinutes);
        rental.setReturnStation(returnStation);
        rental.setTotalAmount(finalAmount);
        rental.setRentalStatus(RentalStatus.Pending);  // ✅ wait for employee
// Don't update cycle/station here — do it in completeRide() by employee

        if (customer.getWalletBalance() != null
                && customer.getWalletBalance() >= finalAmount) {
            customer.setWalletBalance(customer.getWalletBalance() - finalAmount);
            rental.setRentalStatus(RentalStatus.Pending);  // ✅ wait for employee
// Don't update cycle/station here — do it in completeRide() by employee
        } else {
            rental.setPaymentStatus("Pending");
        }

        RentalTransaction updatedRental = rentalTransactionRepository.save(rental);
        customerRepository.save(customer);

        // Update cycle status back to Available
        Cycle cycle = rental.getCycle();
        cycle.setCurrentStatus(CycleStatus.Available);
        cycle.setCurrentStationId(returnStationId.longValue());
        cycle.setTotalRides((cycle.getTotalRides() != null ? cycle.getTotalRides() : 0) + 1);
        cycleRepository.save(cycle);

        // Update return station count
        if (returnStation.getAvailableCycles() != null) {
            returnStation.setAvailableCycles(returnStation.getAvailableCycles() + 1);
        } else {
            returnStation.setAvailableCycles(1);
        }
        stationRepository.save(returnStation);

        return convertToHistoryDTO(updatedRental);
    }

    private RentalHistoryDTO convertToHistoryDTO(RentalTransaction rental) {
        RentalHistoryDTO dto = new RentalHistoryDTO();
        dto.setTransactionId(rental.getTransactionId());
        dto.setCycleName(rental.getCycle().getCycleName());
        dto.setCycleType(rental.getCycle().getCycleType());
        dto.setPickupStation(rental.getPickupStation().getStationName());
        dto.setReturnStation(rental.getReturnStation() != null ?
                rental.getReturnStation().getStationName() : "Not Returned");
        dto.setRentalStartTime(rental.getRentalStartTime());
        dto.setRentalEndTime(rental.getRentalEndTime());
        dto.setRentalDuration(rental.getRentalDuration());
        dto.setTotalAmount(rental.getTotalAmount());
        dto.setPaymentStatus(rental.getPaymentStatus());
        dto.setRentalStatus(rental.getRentalStatus().name());
        return dto;
    }
}