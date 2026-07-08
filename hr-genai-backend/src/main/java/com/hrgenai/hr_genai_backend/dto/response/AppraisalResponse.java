package com.hrgenai.hr_genai_backend.dto.response;

import com.hrgenai.hr_genai_backend.model.Appraisal.AppraisalStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AppraisalResponse {
    private Long id;
    private String employeeName;
    private String managerName;
    private String rawNotes;
    private String strengths;
    private String improvements;
    private String suggestedRating;
    private String generatedSummary;
    private AppraisalStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime finalizedAt;
}