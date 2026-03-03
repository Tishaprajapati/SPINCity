package com.spincity.service.user;

import com.spincity.dto.response.CycleDTO;
import com.spincity.dto.response.StationDTO;

import java.util.List;

public interface StationService {
    List<StationDTO> getAllActiveStations();
    List<StationDTO> getNearbyStations(Double latitude, Double longitude, Double radiusKm);
    List<CycleDTO> getAvailableCyclesAtStation(Long stationId);
}