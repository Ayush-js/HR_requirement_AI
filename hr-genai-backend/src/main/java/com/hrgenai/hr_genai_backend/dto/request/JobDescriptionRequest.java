package com.hrgenai.hr_genai_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class JobDescriptionRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;
}