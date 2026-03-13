//package com.spincity.controller.admin;
//
//import com.spincity.model.customer.Customer;
//import com.spincity.repository.customer.CustomerRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/admin/notifications")
//@RequiredArgsConstructor
//public class AdminNotificationController {
//
//    private final CustomerRepository customerRepository;
//    private final JavaMailSender mailSender;
//
//    // Send to all customers
//    @PostMapping("/send-all")
//    public ResponseEntity<String> sendToAll(@RequestBody Map<String, String> body) {
//        String title   = body.get("title");
//        String message = body.get("message");
//
//        List<Customer> customers = customerRepository.findAll();
//        int sent = 0;
//        for (Customer customer : customers) {
//            try {
//                SimpleMailMessage mail = new SimpleMailMessage();
//                mail.setTo(customer.getCustomerEmail());
//                mail.setSubject("SpinCity: " + title);
//                mail.setText(message);
//                mailSender.send(mail);
//                sent++;
//            } catch (Exception e) {
//                System.err.println("Failed to send email to: " + customer.getCustomerEmail());
//            }
//        }
//        return ResponseEntity.ok("Notification sent to " + sent + " customers");
//    }
//
//    // Send to specific customer
//    @PostMapping("/send/{customerId}")
//    public ResponseEntity<String> sendToCustomer(
//            @PathVariable Integer customerId,
//            @RequestBody Map<String, String> body) {
//        String title   = body.get("title");
//        String message = body.get("message");
//
//        Customer customer = customerRepository.findById(customerId)
//                .orElseThrow(() -> new RuntimeException("Customer not found"));
//
//        SimpleMailMessage mail = new SimpleMailMessage();
//        mail.setTo(customer.getCustomerEmail());
//        mail.setSubject("SpinCity: " + title);
//        mail.setText(message);
//        mailSender.send(mail);
//
//        return ResponseEntity.ok("Notification sent to " + customer.getCustomerEmail());
//    }
//
//    // Get all customers for notification targeting
//    @GetMapping("/customers")
//    public ResponseEntity<?> getCustomersForNotification() {
//        return ResponseEntity.ok(customerRepository.findAll()
//                .stream()
//                .map(c -> Map.of(
//                        "customerId", c.getCustomerId(),
//                        "name", c.getCustomerName(),
//                        "email", c.getCustomerEmail()
//                ))
//                .toList());
//    }
//}