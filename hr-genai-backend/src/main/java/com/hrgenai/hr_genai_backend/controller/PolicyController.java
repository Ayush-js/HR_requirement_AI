package com.hrgenai.hr_genai_backend.controller;

import com.hrgenai.hr_genai_backend.dto.request.PolicyQuestionRequest;
import com.hrgenai.hr_genai_backend.dto.response.PolicyAnswerResponse;
import com.hrgenai.hr_genai_backend.dto.response.PolicyDocumentResponse;
import com.hrgenai.hr_genai_backend.service.PolicyQAService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/policies")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyQAService policyQAService;

    @PostMapping("/upload")
    public ResponseEntity<PolicyDocumentResponse> upload(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(policyQAService.uploadPolicy(file, email));
    }

    @PostMapping("/ask")
    public ResponseEntity<PolicyAnswerResponse> ask(
            @Valid @RequestBody PolicyQuestionRequest request) {
        return ResponseEntity.ok(
                policyQAService.askQuestion(request.getQuestion()));
    }

    @GetMapping
    public ResponseEntity<List<PolicyDocumentResponse>> getAllPolicies() {
        return ResponseEntity.ok(policyQAService.getAllPolicies());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePolicy(@PathVariable Long id) {
        policyQAService.deletePolicy(id);
        return ResponseEntity.noContent().build();
    }
}