package com.hrgenai.hr_genai_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class OfferLetterRequest {

    @NotNull
    private Long candidateId;

    @NotBlank
    private String jobRole;

    @NotNull
    private BigDecimal salary;

    @NotNull
    private LocalDate joiningDate;

    @NotBlank
    private String companyName;
}