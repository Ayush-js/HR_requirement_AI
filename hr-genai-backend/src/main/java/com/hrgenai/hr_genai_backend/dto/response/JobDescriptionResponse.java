package com.hrgenai.hr_genai_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class JobDescriptionResponse {
    private Long id;
    private String title;
    private String description;
    private String createdByName;
    private LocalDateTime createdAt;
    private Boolean isActive;
}