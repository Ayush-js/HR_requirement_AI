package com.hrgenai.hr_genai_backend.dto.response;

import com.hrgenai.hr_genai_backend.model.OfferLetter.OfferStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class OfferLetterResponse {
    private Long id;
    private String candidateName;
    private String jobRole;
    private BigDecimal salary;
    private LocalDate joiningDate;
    private String companyName;
    private String generatedContent;
    private OfferStatus status;
    private LocalDateTime createdAt;
}