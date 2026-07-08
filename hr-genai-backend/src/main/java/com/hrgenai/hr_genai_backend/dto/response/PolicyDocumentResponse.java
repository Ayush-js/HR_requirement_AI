package com.hrgenai.hr_genai_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class PolicyDocumentResponse {
    private Long id;
    private String title;
    private String fileName;
    private String uploadedByName;
    private LocalDateTime uploadedAt;
    private Boolean isActive;
    private Integer chunkCount;
}