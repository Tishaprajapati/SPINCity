package com.spincity.service.user;


import com.spincity.dto.request.FeedbackDTO;
import com.spincity.model.feedback.Feedback;
import com.spincity.repository.FeedbackRepository;
import com.spincity.service.user.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Override
    public Feedback submitFeedback(FeedbackDTO dto) {
        // Validate rating
        if (dto.getRating() < 1 || dto.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        Feedback feedback = new Feedback();
        feedback.setCustomerId(dto.getCustomerId());
        feedback.setRating(dto.getRating());
        feedback.setComments(dto.getComments()); // nullable — can be null
        feedback.setFeedbackDate(LocalDateTime.now());
        feedback.setCreatedAt(LocalDateTime.now());

        return feedbackRepository.save(feedback);
    }

    @Override
    public List<Feedback> getCustomerFeedback(Integer customerId) {
        return feedbackRepository
                .findByCustomerIdOrderByFeedbackDateDesc(customerId);
    }
}