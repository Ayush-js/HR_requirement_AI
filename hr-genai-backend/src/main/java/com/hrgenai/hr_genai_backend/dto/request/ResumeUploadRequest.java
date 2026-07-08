package com.hrgenai.hr_genai_backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResumeUploadRequest {

    @NotNull
    private Long jobDescriptionId;
}