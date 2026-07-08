package com.hrgenai.hr_genai_backend.controller;

import com.hrgenai.hr_genai_backend.dto.response.CandidateScoreResponse;
import com.hrgenai.hr_genai_backend.dto.response.ResumeProfileResponse;
import com.hrgenai.hr_genai_backend.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/upload")
    public ResponseEntity<List<CandidateScoreResponse>> upload(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("jobDescriptionId") Long jobDescriptionId,
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(
                resumeService.uploadAndProcess(files, jobDescriptionId, email));
    }

    @GetMapping("/ranked/{jobDescriptionId}")
    public ResponseEntity<List<CandidateScoreResponse>> getRanked(
            @PathVariable Long jobDescriptionId) {
        return ResponseEntity.ok(
                resumeService.getRankedCandidates(jobDescriptionId));
    }

    @GetMapping("/{resumeId}/profile")
    public ResponseEntity<ResumeProfileResponse> getProfile(
            @PathVariable Long resumeId) {
        return ResponseEntity.ok(resumeService.getProfile(resumeId));
    }

    @DeleteMapping("/{resumeId}")
    public ResponseEntity<Void> delete(@PathVariable Long resumeId) {
        resumeService.deleteResume(resumeId);
        return ResponseEntity.noContent().build();
    }
}