package com.spincity.model.analytics;

import com.spincity.model.customer.Customer;
import com.spincity.model.rental.RentalTransaction;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ride_analytics")
public class RideAnalytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "analytics_id")
    private Integer analyticsId;

    @ManyToOne
    @JoinColumn(name = "transaction_id", nullable = false)
    private RentalTransaction rentalTransaction;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "distance_traveled", precision = 10, scale = 2, nullable = false)
    private BigDecimal distanceTraveled;

    @Column(name = "route_coordinates", columnDefinition = "TEXT")
    private String routeCoordinates;

    @Column(name = "average_speed", precision = 5, scale = 2)
    private BigDecimal averageSpeed;

    @Column(name = "carbon_saved", precision = 10, scale = 2)
    private BigDecimal carbonSaved;

    @Column(name = "calories_burned", precision = 10, scale = 2)
    private BigDecimal caloriesBurned;

    @Column(name = "peak_hour")
    private Integer peakHour;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public RideAnalytics() {}

    // Getters and Setters
    public Integer getAnalyticsId() { return analyticsId; }
    public void setAnalyticsId(Integer analyticsId) { this.analyticsId = analyticsId; }

    public RentalTransaction getRentalTransaction() { return rentalTransaction; }
    public void setRentalTransaction(RentalTransaction rentalTransaction) { this.rentalTransaction = rentalTransaction; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public BigDecimal getDistanceTraveled() { return distanceTraveled; }
    public void setDistanceTraveled(BigDecimal distanceTraveled) { this.distanceTraveled = distanceTraveled; }

    public String getRouteCoordinates() { return routeCoordinates; }
    public void setRouteCoordinates(String routeCoordinates) { this.routeCoordinates = routeCoordinates; }

    public BigDecimal getAverageSpeed() { return averageSpeed; }
    public void setAverageSpeed(BigDecimal averageSpeed) { this.averageSpeed = averageSpeed; }

    public BigDecimal getCarbonSaved() { return carbonSaved; }
    public void setCarbonSaved(BigDecimal carbonSaved) { this.carbonSaved = carbonSaved; }

    public BigDecimal getCaloriesBurned() { return caloriesBurned; }
    public void setCaloriesBurned(BigDecimal caloriesBurned) { this.caloriesBurned = caloriesBurned; }

    public Integer getPeakHour() { return peakHour; }
    public void setPeakHour(Integer peakHour) { this.peakHour = peakHour; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}