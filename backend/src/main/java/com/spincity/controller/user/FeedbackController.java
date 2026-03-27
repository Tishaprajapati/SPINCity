package com.spincity.controller.user;


import com.spincity.dto.request.FeedbackDTO;
import com.spincity.model.feedback.Feedback;
import com.spincity.service.user.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/feedback")
@CrossOrigin(origins = {"http://localhost:5173", "https://spin-city.vercel.app"})
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    // ✅ Submit feedback
    @PostMapping("/submit")
    public ResponseEntity<?> submitFeedback(@RequestBody FeedbackDTO dto) {
        try {
            if (dto.getCustomerId() == null || dto.getRating() == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Customer ID and rating are required"));
            }
            Feedback saved = feedbackService.submitFeedback(dto);
            return ResponseEntity.ok(Map.of(
                    "message", "Feedback submitted successfully!",
                    "feedbackId", saved.getFeedbackId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ Get customer feedback history
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getCustomerFeedback(
            @PathVariable Integer customerId) {
        try {
            List<Feedback> feedbacks = feedbackService
                    .getCustomerFeedback(customerId);
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}