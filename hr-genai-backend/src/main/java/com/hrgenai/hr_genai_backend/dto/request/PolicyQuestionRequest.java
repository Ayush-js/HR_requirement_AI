package com.hrgenai.hr_genai_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PolicyQuestionRequest {

    @NotBlank
    private String question;
}