package com.spincity.service.user;
import com.spincity.model.feedback.Feedback;
import java.util.List;
import com.spincity.dto.request.FeedbackDTO;
public interface FeedbackService {
    Feedback submitFeedback(FeedbackDTO dto);
    List<Feedback> getCustomerFeedback(Integer customerId);
}
