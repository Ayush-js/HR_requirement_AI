package com.hrgenai.hr_genai_backend.dto.response;

import com.hrgenai.hr_genai_backend.model.Resume.ResumeStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CandidateScoreResponse {
    private Long resumeId;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private String extractedSkills;
    private Double relevanceScore;
    private ResumeStatus status;
    private LocalDateTime uploadedAt;
}