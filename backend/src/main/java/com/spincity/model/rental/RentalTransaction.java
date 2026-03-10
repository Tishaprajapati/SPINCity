package com.spincity.model.rental;

import com.spincity.model.customer.Customer;
import com.spincity.model.cycle.Cycle;
import com.spincity.model.payment.PaymentStatus;
import com.spincity.model.station.Station;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.spincity.model.employee.Staff;
@Entity
@Table(name = "rental_transaction")
public class RentalTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "cycle_id", nullable = false)
    private Cycle cycle;

    @ManyToOne
    @JoinColumn(name = "pickup_station_id", nullable = false)
    private Station pickupStation;

    @ManyToOne
    @JoinColumn(name = "return_station_id")
    private Station returnStation;

    @Column(name = "rental_start_time", nullable = false)
    private LocalDateTime rentalStartTime;

    @Column(name = "rental_end_time")
    private LocalDateTime rentalEndTime;

    @Column(name = "rental_duration")
    private Integer rentalDuration;

    @Column(name = "total_amount")
    private Double totalAmount;


    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }


    @Column(name = "payment_status", nullable = false)
    private String paymentStatus = "Pending";

    @Enumerated(EnumType.STRING)
    @Column(name = "rental_status", nullable = false)
    private RentalStatus rentalStatus;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    @Column(name = "deposit_status")
    private String depositStatus = "NOT_PAID";


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_emp_id")
    private Staff approvedByEmp;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status")
    private ApprovalStatus approvalStatus = ApprovalStatus.Pending;

    @Column(name = "approval_time")
    private LocalDateTime approvalTime;



    public Staff getApprovedByEmp() { return approvedByEmp; }
    public void setApprovedByEmp(Staff approvedByEmp) { this.approvedByEmp = approvedByEmp; }

    public ApprovalStatus getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(ApprovalStatus approvalStatus) { this.approvalStatus = approvalStatus; }

    public LocalDateTime getApprovalTime() { return approvalTime; }
    public void setApprovalTime(LocalDateTime approvalTime) { this.approvalTime = approvalTime; }

    public enum ApprovalStatus {
        Pending, Approved, Rejected
    }



    public String getDepositStatus() { return depositStatus; }
    public void setDepositStatus(String depositStatus) { this.depositStatus = depositStatus; }
    // Constructors
    public RentalTransaction() {}

    // Getters and Setters
    public Long getTransactionId() { return transactionId; }
    public void setTransactionId(Long transactionId) { this.transactionId = transactionId; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public Cycle getCycle() { return cycle; }
    public void setCycle(Cycle cycle) { this.cycle = cycle; }

    public Station getPickupStation() { return pickupStation; }
    public void setPickupStation(Station pickupStation) { this.pickupStation = pickupStation; }

    public Station getReturnStation() { return returnStation; }
    public void setReturnStation(Station returnStation) { this.returnStation = returnStation; }

    public LocalDateTime getRentalStartTime() { return rentalStartTime; }
    public void setRentalStartTime(LocalDateTime rentalStartTime) { this.rentalStartTime = rentalStartTime; }

    public LocalDateTime getRentalEndTime() { return rentalEndTime; }
    public void setRentalEndTime(LocalDateTime rentalEndTime) { this.rentalEndTime = rentalEndTime; }

    public Integer getRentalDuration() { return rentalDuration; }
    public void setRentalDuration(Integer rentalDuration) { this.rentalDuration = rentalDuration; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }



    public RentalStatus getRentalStatus() { return rentalStatus; }
    public void setRentalStatus(RentalStatus rentalStatus) { this.rentalStatus = rentalStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}