package com.hrgenai.hr_genai_backend.controller;

import com.hrgenai.hr_genai_backend.dto.request.AppraisalRequest;
import com.hrgenai.hr_genai_backend.dto.response.AppraisalResponse;
import com.hrgenai.hr_genai_backend.service.AppraisalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/appraisals")
@RequiredArgsConstructor
public class AppraisalController {

    private final AppraisalService appraisalService;

    @PostMapping("/generate")
    public ResponseEntity<AppraisalResponse> generate(
            @Valid @RequestBody AppraisalRequest request,
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(appraisalService.generate(request, email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppraisalResponse> update(
            @PathVariable Long id,
            @RequestBody String updatedSummary) {
        return ResponseEntity.ok(appraisalService.update(id, updatedSummary));
    }

    @PostMapping("/{id}/finalize")
    public ResponseEntity<AppraisalResponse> finalize(@PathVariable Long id) {
        return ResponseEntity.ok(appraisalService.finalize(id));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<AppraisalResponse>> getByEmployee(
            @PathVariable Long employeeId) {
        return ResponseEntity.ok(appraisalService.getByEmployee(employeeId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppraisalResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(appraisalService.getById(id));
    }
}