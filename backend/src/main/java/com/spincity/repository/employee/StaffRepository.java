package com.spincity.repository.employee;

import com.spincity.model.employee.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Integer> {

    Optional<Staff> findByEmail(String email); // email thi staff fetch karva mate
}
