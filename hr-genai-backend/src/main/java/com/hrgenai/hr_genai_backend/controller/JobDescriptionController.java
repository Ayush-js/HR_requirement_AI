package com.hrgenai.hr_genai_backend.controller;

import com.hrgenai.hr_genai_backend.dto.request.JobDescriptionRequest;
import com.hrgenai.hr_genai_backend.dto.response.JobDescriptionResponse;
import com.hrgenai.hr_genai_backend.service.JobDescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobDescriptionController {

    private final JobDescriptionService jobDescriptionService;

    @PostMapping
    public ResponseEntity<JobDescriptionResponse> create(
            @Valid @RequestBody JobDescriptionRequest request,
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(jobDescriptionService.create(request, email));
    }

    @GetMapping
    public ResponseEntity<List<JobDescriptionResponse>> getAll() {
        return ResponseEntity.ok(jobDescriptionService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDescriptionResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(jobDescriptionService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobDescriptionResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody JobDescriptionRequest request) {
        return ResponseEntity.ok(jobDescriptionService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(@PathVariable Long id) {
        jobDescriptionService.deactivate(id);
        return ResponseEntity.noContent().build();
    }
}