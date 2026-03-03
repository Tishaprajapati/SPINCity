package com.spincity.model.employee;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employee")
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "phone")
    private String phone;

    @Column(name = "employee_email", nullable = false, unique = true)
    private String email;

    // BCrypt hashes are 60 chars (e.g. $2a$10$...)
    @Column(name = "password", nullable = false, length = 60)
    private String password;

    // 🔹 DB column: branch_id
    @Column(name = "branch_id")
    private Integer branchId;

    // 🔹 DB column: assigned_station
    @Column(name = "assigned_station")
    private Integer assignedStation;

    // 🔹 DB column: designation
    @Column(name = "designation")
    private String designation;

    // 🔹 DB column: role
    @Column(name = "role")
    private String role;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    @Column(name = "salary")
    private Double salary;

    // 🔹 DB column: shift
    @Column(name = "shift")
    private String shift;

    @Column(name = "rating")
    private Double rating;

    // 🔹 DB column: employment_status
    @Column(name = "employment_status")
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    // ================= GETTERS / SETTERS =================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Integer getBranchId() { return branchId; }
    public void setBranchId(Integer branchId) { this.branchId = branchId; }

    public Integer getAssignedStation() { return assignedStation; }
    public void setAssignedStation(Integer assignedStation) { this.assignedStation = assignedStation; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public LocalDate getJoiningDate() { return joiningDate; }
    public void setJoiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; }

    public Double getSalary() { return salary; }
    public void setSalary(Double salary) { this.salary = salary; }

    public String getShift() { return shift; }
    public void setShift(String shift) { this.shift = shift; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
