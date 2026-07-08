package com.hrgenai.hr_genai_backend.service;

import com.hrgenai.hr_genai_backend.dto.response.PolicyAnswerResponse;
import com.hrgenai.hr_genai_backend.dto.response.PolicyDocumentResponse;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface PolicyQAService {
    PolicyDocumentResponse uploadPolicy(MultipartFile file, String email);
    PolicyAnswerResponse askQuestion(String question);
    List<PolicyDocumentResponse> getAllPolicies();
    void deletePolicy(Long id);
}