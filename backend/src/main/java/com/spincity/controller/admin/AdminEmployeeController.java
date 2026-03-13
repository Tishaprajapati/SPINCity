package com.spincity.controller.admin;

import com.spincity.model.employee.Staff;
import com.spincity.repository.employee.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/employees")
@RequiredArgsConstructor
public class AdminEmployeeController {

    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;

    // Get all employees
    @GetMapping
    public ResponseEntity<List<Staff>> getAllEmployees() {
        return ResponseEntity.ok(staffRepository.findAll());
    }

    // Add new employee
    @PostMapping
    public ResponseEntity<Staff> addEmployee(@RequestBody Staff staff) {
        // Encode password before saving
        staff.setPassword(passwordEncoder.encode(staff.getPassword()));
        return ResponseEntity.ok(staffRepository.save(staff));
    }

    // Update employee
    @PutMapping("/{empId}")
    public ResponseEntity<Staff> updateEmployee(
            @PathVariable Integer empId,
            @RequestBody Staff updatedStaff) {
        Staff staff = staffRepository.findById(empId)
                .orElseThrow(() -> new RuntimeException("Employee not found: " + empId));
        staff.setName(updatedStaff.getName());
        staff.setPhone(updatedStaff.getPhone());
        staff.setDesignation(updatedStaff.getDesignation());
        staff.setAssignedStation(updatedStaff.getAssignedStation());
        staff.setRole(updatedStaff.getRole());
        staff.setShift(updatedStaff.getShift());
        staff.setSalary(updatedStaff.getSalary());
        staff.setStatus(updatedStaff.getStatus());
        // Only update password if provided
        if (updatedStaff.getPassword() != null && !updatedStaff.getPassword().isEmpty()) {
            staff.setPassword(passwordEncoder.encode(updatedStaff.getPassword()));
        }
        return ResponseEntity.ok(staffRepository.save(staff));
    }

    // Delete employee
    @DeleteMapping("/{empId}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Integer empId) {
        staffRepository.deleteById(empId);
        return ResponseEntity.ok("Employee deleted successfully");
    }
}