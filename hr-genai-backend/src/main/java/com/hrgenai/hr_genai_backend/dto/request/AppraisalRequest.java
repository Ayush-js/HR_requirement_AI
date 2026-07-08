package com.hrgenai.hr_genai_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AppraisalRequest {

    @NotNull
    private Long employeeId;

    @NotBlank
    private String rawNotes;
}