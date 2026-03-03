package com.spincity.model.cycle;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Entity
@Table(name = "cycle_pricing")
@Getter
@Setter
public class CyclePricing {



        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "pricing_id")
        private Integer pricingId;

        @Column(name = "performance_id")
        private Integer performanceId;

        @Column(name = "price_per_hour")
        private Double pricePerHour;

        @Column(name = "daily_price")
        private Double dailyPrice;

        @Column(name = "weekly_price")
        private Double weeklyPrice;

        @Column(name = "monthly_price")
        private Double monthlyPrice;

}
