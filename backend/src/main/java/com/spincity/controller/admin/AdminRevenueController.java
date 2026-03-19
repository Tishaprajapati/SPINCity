package com.spincity.controller.admin;

import com.spincity.model.rental.RentalTransaction;
import com.spincity.model.station.Station;
import com.spincity.repository.RentalTransactionRepository;
import com.spincity.repository.StationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/revenue")
@RequiredArgsConstructor
public class AdminRevenueController {

    private final RentalTransactionRepository rentalRepository;
    private final StationRepository stationRepository;

    // ── Summary ────────────────────────────────────────────────────
    @GetMapping("/summary")
    public ResponseEntity<?> getRevenueSummary() {
        List<RentalTransaction> all = rentalRepository.findAll();

        LocalDateTime now       = LocalDateTime.now();
        LocalDateTime todayStart= now.toLocalDate().atStartOfDay();
        LocalDateTime weekStart = now.minusDays(7);
        LocalDateTime monthStart= now.withDayOfMonth(1).toLocalDate().atStartOfDay();

        double totalRevenue  = sumAmount(all);
        double todayRevenue  = sumAmount(all.stream().filter(r -> r.getCreatedAt() != null && r.getCreatedAt().isAfter(todayStart)).collect(Collectors.toList()));
        double weekRevenue   = sumAmount(all.stream().filter(r -> r.getCreatedAt() != null && r.getCreatedAt().isAfter(weekStart)).collect(Collectors.toList()));
        double monthRevenue  = sumAmount(all.stream().filter(r -> r.getCreatedAt() != null && r.getCreatedAt().isAfter(monthStart)).collect(Collectors.toList()));

        long totalRides      = all.size();
        long completedRides  = all.stream().filter(r -> "Completed".equals(String.valueOf(r.getRentalStatus()))).count();
        double avgPerRide    = totalRides > 0 ? totalRevenue / totalRides : 0;

        Map<String, Object> result = new HashMap<>();
        result.put("totalRevenue",    Math.round(totalRevenue * 100.0) / 100.0);
        result.put("todayRevenue",    Math.round(todayRevenue * 100.0) / 100.0);
        result.put("weekRevenue",     Math.round(weekRevenue * 100.0) / 100.0);
        result.put("monthRevenue",    Math.round(monthRevenue * 100.0) / 100.0);
        result.put("totalRides",      totalRides);
        result.put("completedRides",  completedRides);
        result.put("avgRevenuePerRide", Math.round(avgPerRide * 100.0) / 100.0);

        return ResponseEntity.ok(result);
    }

    // ── Station wise Revenue ───────────────────────────────────────
    @GetMapping("/by-station")
    public ResponseEntity<?> getRevenueByStation() {
        List<RentalTransaction> all = rentalRepository.findAll();
        List<Station> stations      = stationRepository.findAll();

        Map<Object, String> stationNameMap = new HashMap<>();
        stations.forEach(s -> stationNameMap.put(s.getStationId(), s.getStationName()));

        Map<Object, List<RentalTransaction>> grouped = all.stream()
                .filter(r -> r.getPickupStation() != null)
                .collect(Collectors.groupingBy(r -> r.getPickupStation().getStationId()));
        List<Map<String, Object>> result = new ArrayList<>();
        grouped.forEach((stationId, txns) -> {
            Map<String, Object> row = new HashMap<>();
            row.put("stationId",   stationId);
            row.put("stationName", stationNameMap.getOrDefault(stationId, "Station " + stationId.toString()));
            row.put("totalRevenue", Math.round(sumAmount(txns) * 100.0) / 100.0);
            row.put("totalRides",   txns.size());
            row.put("completedRides", txns.stream().filter(r -> "Completed".equals(String.valueOf(r.getRentalStatus()))).count());
            row.put("avgRevenue",   txns.size() > 0 ? Math.round((sumAmount(txns) / txns.size()) * 100.0) / 100.0 : 0);
            result.add(row);
        });

        // Sort by revenue descending
        result.sort((a, b) -> Double.compare((Double) b.get("totalRevenue"), (Double) a.get("totalRevenue")));

        return ResponseEntity.ok(result);
    }

    // ── Monthly Revenue (last 6 months) ───────────────────────────
    @GetMapping("/monthly")
    public ResponseEntity<?> getMonthlyRevenue() {
        List<RentalTransaction> all = rentalRepository.findAll();

        List<Map<String, Object>> result = new ArrayList<>();
        YearMonth current = YearMonth.now();

        for (int i = 5; i >= 0; i--) {
            YearMonth ym         = current.minusMonths(i);
            LocalDateTime start  = ym.atDay(1).atStartOfDay();
            LocalDateTime end    = ym.atEndOfMonth().atTime(23, 59, 59);

            List<RentalTransaction> monthly = all.stream()
                    .filter(r -> r.getCreatedAt() != null
                            && r.getCreatedAt().isAfter(start)
                            && r.getCreatedAt().isBefore(end))
                    .collect(Collectors.toList());

            Map<String, Object> row = new HashMap<>();
            row.put("month",   ym.getMonth().name().substring(0, 3) + " " + ym.getYear());
            row.put("revenue", Math.round(sumAmount(monthly) * 100.0) / 100.0);
            row.put("rides",   monthly.size());
            result.add(row);
        }

        return ResponseEntity.ok(result);
    }

    // ── Helper ─────────────────────────────────────────────────────
    private double sumAmount(List<RentalTransaction> txns) {
        return txns.stream()
                .mapToDouble(r -> r.getTotalAmount() != null ? r.getTotalAmount() : 0.0)
                .sum();
    }
}