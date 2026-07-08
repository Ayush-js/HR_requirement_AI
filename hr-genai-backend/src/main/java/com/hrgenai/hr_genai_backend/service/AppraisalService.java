package com.hrgenai.hr_genai_backend.service;

import com.hrgenai.hr_genai_backend.dto.request.AppraisalRequest;
import com.hrgenai.hr_genai_backend.dto.response.AppraisalResponse;
import java.util.List;

public interface AppraisalService {
    AppraisalResponse generate(AppraisalRequest request, String managerEmail);
    AppraisalResponse update(Long id, String updatedSummary);
    AppraisalResponse finalize(Long id);
    List<AppraisalResponse> getByEmployee(Long employeeId);
    AppraisalResponse getById(Long id);
}