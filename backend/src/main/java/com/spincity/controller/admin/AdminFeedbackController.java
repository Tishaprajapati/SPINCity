package com.spincity.controller.admin;

import com.spincity.model.customer.Customer;
import com.spincity.model.feedback.Feedback;
import com.spincity.repository.customer.CustomerRepository;
import com.spincity.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/feedback")
@RequiredArgsConstructor
public class AdminFeedbackController {

    private final FeedbackRepository feedbackRepository;
    private final CustomerRepository customerRepository;

    @GetMapping
    public ResponseEntity<?> getAllFeedback() {
        List<Feedback> feedbacks = feedbackRepository.findAll();

        // Build customer name map
        Map<Integer, String> customerNameMap = new HashMap<>();
        customerRepository.findAll().forEach(c ->
                customerNameMap.put(c.getCustomerId(), c.getCustomerName())
        );

        List<Map<String, Object>> result = new ArrayList<>();
        for (Feedback f : feedbacks) {
            Map<String, Object> map = new HashMap<>();
            map.put("feedbackId",   f.getFeedbackId());
            map.put("customerId",   f.getCustomerId());
            map.put("customerName", customerNameMap.getOrDefault(f.getCustomerId(), "Unknown"));
            map.put("rating",       f.getRating());
            map.put("comments",     f.getComments() != null ? f.getComments() : "");
            map.put("feedbackDate", f.getFeedbackDate() != null ? f.getFeedbackDate().toString() : "");
            map.put("createdAt",    f.getCreatedAt() != null ? f.getCreatedAt().toString() : "");
            result.add(map);
        }

        // Sort newest first
        result.sort((a, b) -> String.valueOf(b.get("feedbackDate"))
                .compareTo(String.valueOf(a.get("feedbackDate"))));

        return ResponseEntity.ok(result);
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getFeedbackSummary() {
        List<Feedback> feedbacks = feedbackRepository.findAll();

        double avgRating = feedbacks.stream()
                .mapToInt(Feedback::getRating)
                .average()
                .orElse(0.0);

        Map<Integer, Long> ratingDistribution = feedbacks.stream()
                .collect(Collectors.groupingBy(Feedback::getRating, Collectors.counting()));

        return ResponseEntity.ok(Map.of(
                "totalFeedbacks",      feedbacks.size(),
                "averageRating",       Math.round(avgRating * 10.0) / 10.0,
                "fiveStarCount",       ratingDistribution.getOrDefault(5, 0L),
                "fourStarCount",       ratingDistribution.getOrDefault(4, 0L),
                "threeStarCount",      ratingDistribution.getOrDefault(3, 0L),
                "twoStarCount",        ratingDistribution.getOrDefault(2, 0L),
                "oneStarCount",        ratingDistribution.getOrDefault(1, 0L)
        ));
    }
}