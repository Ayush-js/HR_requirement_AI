package com.hrgenai.hr_genai_backend.service.impl;

import com.hrgenai.hr_genai_backend.dto.request.JobDescriptionRequest;
import com.hrgenai.hr_genai_backend.dto.response.JobDescriptionResponse;
import com.hrgenai.hr_genai_backend.model.JobDescription;
import com.hrgenai.hr_genai_backend.model.User;
import com.hrgenai.hr_genai_backend.repository.JobDescriptionRepository;
import com.hrgenai.hr_genai_backend.repository.UserRepository;
import com.hrgenai.hr_genai_backend.service.JobDescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobDescriptionServiceImpl implements JobDescriptionService {

    private final JobDescriptionRepository jobDescriptionRepository;
    private final UserRepository userRepository;

    @Override
    public JobDescriptionResponse create(JobDescriptionRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        JobDescription jd = new JobDescription();
        jd.setTitle(request.getTitle());
        jd.setDescription(request.getDescription());
        jd.setCreatedBy(user);

        JobDescription saved = jobDescriptionRepository.save(jd);
        return mapToResponse(saved);
    }

    @Override
    public List<JobDescriptionResponse> getAll() {
        return jobDescriptionRepository.findByIsActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public JobDescriptionResponse getById(Long id) {
        JobDescription jd = jobDescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job Description not found"));
        return mapToResponse(jd);
    }

    @Override
    public JobDescriptionResponse update(Long id, JobDescriptionRequest request) {
        JobDescription jd = jobDescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job Description not found"));

        jd.setTitle(request.getTitle());
        jd.setDescription(request.getDescription());

        return mapToResponse(jobDescriptionRepository.save(jd));
    }

    @Override
    public void deactivate(Long id) {
        JobDescription jd = jobDescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job Description not found"));
        jd.setIsActive(false);
        jobDescriptionRepository.save(jd);
    }

    private JobDescriptionResponse mapToResponse(JobDescription jd) {
        return new JobDescriptionResponse(
                jd.getId(),
                jd.getTitle(),
                jd.getDescription(),
                jd.getCreatedBy().getName(),
                jd.getCreatedAt(),
                jd.getIsActive()
        );
    }
}