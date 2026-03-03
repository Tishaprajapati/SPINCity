package com.spincity.service.user;

import com.spincity.dto.response.CycleDTO;
import com.spincity.dto.response.StationDTO;
import com.spincity.model.cycle.Cycle;
import com.spincity.model.station.Station;
import com.spincity.model.station.StationStatus;
import com.spincity.repository.CycleRepository;
import com.spincity.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StationServiceImpl implements StationService {

    @Autowired
    private StationRepository stationRepository;

    @Autowired
    private CycleRepository cycleRepository;

    @Override
    public List<StationDTO> getAllActiveStations() {
        List<Station> stations = stationRepository.findByStatusOrderByStationNameAsc(StationStatus.Active);
        return stations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<StationDTO> getNearbyStations(Double latitude, Double longitude, Double radiusKm) {
        // Get all active stations
        List<Station> allStations = stationRepository.findByStatusOrderByStationNameAsc(StationStatus.Active);

        // Filter by distance (Haversine formula)
        return allStations.stream()
                .filter(station -> {
                    if (station.getLatitude() == null || station.getLongitude() == null) {
                        return false;
                    }
                    double distance = calculateDistance(latitude, longitude,
                            station.getLatitude(), station.getLongitude());
                    return distance <= radiusKm;
                })
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CycleDTO> getAvailableCyclesAtStation(Long stationId) {
        List<Cycle> cycles = cycleRepository.findAvailableCyclesByStationId(stationId);
        return cycles.stream()
                .map(this::convertCycleToDTO)
                .collect(Collectors.toList());
    }

    // Helper methods
    private StationDTO convertToDTO(Station station) {
        StationDTO dto = new StationDTO();
        dto.setStationId(station.getStationId());
        dto.setStationName(station.getStationName());
        dto.setStationAddress(station.getStationAddress());
        dto.setLatitude(station.getLatitude());
        dto.setLongitude(station.getLongitude());
        dto.setTotalCapacity(station.getTotalCapacity());
        dto.setAvailableCycles(station.getAvailableCycles() != null ? station.getAvailableCycles() : 0);
        dto.setOperatingHours(station.getOperatingHours());
        dto.setStatus(station.getStatus().name());
        return dto;
    }

    private CycleDTO convertCycleToDTO(Cycle cycle) {
        CycleDTO dto = new CycleDTO();
        dto.setCycleId(cycle.getCycleId());
        dto.setCycleName(cycle.getCycleName());
        dto.setCycleType(cycle.getCycleType());
        dto.setCycleBrand(cycle.getCycleBrand());
        dto.setCycleModel(cycle.getCycleModel());
        dto.setQrCode(cycle.getQrCode());
        dto.setCurrentStatus(cycle.getCurrentStatus().name());
        return dto;
    }

    // Haversine formula to calculate distance
    private double calculateDistance(Double lat1, Double lon1, Double lat2, Double lon2) {
        final int R = 6371; // Radius of Earth in kilometers

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}