package com.hrgenai.hr_genai_backend.dto.response;

import com.hrgenai.hr_genai_backend.model.Resume.ResumeStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ResumeProfileResponse {
    private Long resumeId;
    private String fileName;
    private String candidateName;
    private String candidateEmail;
    private String candidatePhone;
    private String extractedSkills;
    private String extractedText;
    private Double relevanceScore;
    private String jobDescriptionTitle;
    private ResumeStatus status;
    private LocalDateTime uploadedAt;
}