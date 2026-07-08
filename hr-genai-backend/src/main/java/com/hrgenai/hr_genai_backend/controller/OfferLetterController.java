package com.hrgenai.hr_genai_backend.controller;

import com.hrgenai.hr_genai_backend.dto.request.OfferLetterRequest;
import com.hrgenai.hr_genai_backend.dto.response.OfferLetterResponse;
import com.hrgenai.hr_genai_backend.service.OfferLetterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/offers")
@RequiredArgsConstructor
public class OfferLetterController {

    private final OfferLetterService offerLetterService;

    @PostMapping("/generate")
    public ResponseEntity<OfferLetterResponse> generate(
            @Valid @RequestBody OfferLetterRequest request,
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(offerLetterService.generate(request, email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OfferLetterResponse> update(
            @PathVariable Long id,
            @RequestBody String updatedContent) {
        return ResponseEntity.ok(offerLetterService.update(id, updatedContent));
    }

    @PostMapping("/{id}/finalize")
    public ResponseEntity<OfferLetterResponse> finalize(@PathVariable Long id) {
        return ResponseEntity.ok(offerLetterService.finalize(id));
    }

    @GetMapping
    public ResponseEntity<List<OfferLetterResponse>> getAll(
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(offerLetterService.getAll(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OfferLetterResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(offerLetterService.getById(id));
    }
}