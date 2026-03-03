package com.spincity.controller.rental;

import com.spincity.model.customer.Customer;
import com.spincity.model.cycle.Cycle;
import com.spincity.model.station.Station;
import jakarta.persistence.ManyToOne;

public class RentalTransaction {

    @ManyToOne
    private Customer customer;

    @ManyToOne
    private Cycle cycle;

    @ManyToOne
    private Station pickupStation;

}
