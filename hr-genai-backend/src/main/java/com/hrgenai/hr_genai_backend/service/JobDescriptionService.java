package com.hrgenai.hr_genai_backend.service;

import com.hrgenai.hr_genai_backend.dto.request.JobDescriptionRequest;
import com.hrgenai.hr_genai_backend.dto.response.JobDescriptionResponse;
import java.util.List;

public interface JobDescriptionService {
    JobDescriptionResponse create(JobDescriptionRequest request, String email);
    List<JobDescriptionResponse> getAll();
    JobDescriptionResponse getById(Long id);
    JobDescriptionResponse update(Long id, JobDescriptionRequest request);
    void deactivate(Long id);
}