package com.spincity.repository;

import com.spincity.model.station.Station;
import com.spincity.model.station.StationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StationRepository extends JpaRepository<Station, Long> {

    long countByStatus(StationStatus status);

    // NEW: Find all active stations
    List<Station> findByStatusOrderByStationNameAsc(StationStatus status);

    // NEW: Find all stations with available cycles
    @Query("SELECT s FROM Station s WHERE s.availableCycles > 0 AND s.status = 'Active' ORDER BY s.stationName")
    List<Station> findStationsWithAvailableCycles();
}