package com.spincity.service.user;

import com.spincity.dto.request.StartRentalRequest;
import com.spincity.dto.response.ActiveRentalDTO;
import com.spincity.dto.response.RentalHistoryDTO;

import java.util.List;

public interface RentalService {
    ActiveRentalDTO getActiveRental(Integer customerId);
    List<RentalHistoryDTO> getRentalHistory(Integer customerId);
    RentalHistoryDTO startRental(StartRentalRequest request);
    RentalHistoryDTO endRental(Long transactionId, Integer returnStationId);
}