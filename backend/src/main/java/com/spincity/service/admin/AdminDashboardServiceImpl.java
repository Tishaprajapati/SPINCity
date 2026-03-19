package com.spincity.service.admin;

import com.spincity.dto.response.AdminDashboardSummaryDTO;
import com.spincity.dto.response.RecentRentalDTO;
import com.spincity.model.cycle.CycleStatus;
import com.spincity.model.station.Station;
import com.spincity.model.station.StationStatus;
import com.spincity.repository.*;
import com.spincity.repository.customer.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminDashboardServiceImpl implements AdminDashboardService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CycleRepository cycleRepository;

    @Autowired
    private StationRepository stationRepository;

    @Autowired
    private RentalTransactionRepository rentalTransactionRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    public AdminDashboardSummaryDTO getDashboardSummary() {
        AdminDashboardSummaryDTO dto = new AdminDashboardSummaryDTO();

        // Total Customers
        dto.setTotalCustomers(customerRepository.count());

        // Active Cycles
        dto.setActiveCycles(cycleRepository.countByCurrentStatus(CycleStatus.Available));

        // Inactive Cycles
        dto.setInactiveCycles(cycleRepository.countByCurrentStatus(CycleStatus.Under_Maintenance));

        // Active Stations - DEBUG
        System.out.println("DEBUG: Counting active stations...");
        long activeStations = stationRepository.countByStatus(StationStatus.Active);
        System.out.println("DEBUG: Active stations count = " + activeStations);

        LocalDate today = LocalDate.now();
        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime todayEnd = today.atTime(23, 59, 59);
        Double todayRevenue = rentalTransactionRepository
                .sumTotalAmountBetween(todayStart, todayEnd);
        dto.setTodayRevenue(todayRevenue != null ? todayRevenue : 0.0);


        // List all stations to see what's there
        List<Station> allStations = stationRepository.findAll();
        System.out.println("DEBUG: Total stations in DB = " + allStations.size());
        allStations.forEach(s ->
                System.out.println("  Station: " + s.getStationName() + " | Status: " + s.getStatus())
        );

        dto.setActiveStations(activeStations);

        // Inactive Stations
        dto.setInactiveStations(stationRepository.countByStatus(StationStatus.Under_Maintenance));



        return dto;
    }


    @Override
    public List<RecentRentalDTO> getRecentRentals() {

        System.out.println("admindashboard service called - getRecentRentals called");
        return rentalTransactionRepository.findRecentRentals(PageRequest.of(0, 10));
    }
}