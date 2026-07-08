package com.hrgenai.hr_genai_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PolicyAnswerResponse {
    private String question;
    private String answer;
    private String sourceDocument;
}