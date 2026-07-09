package com.hrgenai.hr_genai_backend.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hrgenai.hr_genai_backend.dto.request.AppraisalRequest;
import com.hrgenai.hr_genai_backend.dto.response.AppraisalResponse;
import com.hrgenai.hr_genai_backend.model.Appraisal;
import com.hrgenai.hr_genai_backend.model.Appraisal.AppraisalStatus;
import com.hrgenai.hr_genai_backend.model.User;
import com.hrgenai.hr_genai_backend.repository.AppraisalRepository;
import com.hrgenai.hr_genai_backend.repository.UserRepository;
import com.hrgenai.hr_genai_backend.service.AppraisalService;
import com.hrgenai.hr_genai_backend.service.LLMService;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AppraisalServiceImpl implements AppraisalService {

    private final AppraisalRepository appraisalRepository;
    private final UserRepository userRepository;
    private final LLMService llmService;
    private final ObjectMapper objectMapper;

    @Override
    public AppraisalResponse generate(AppraisalRequest request, String managerEmail) {
        User manager = userRepository.findByEmail(managerEmail)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        User employee = userRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        log.info("Generating appraisal for employee: {}", employee.getName());

        String llmResponse = llmService.generateAppraisalSummary(
                request.getRawNotes(),
                employee.getName()
        );

        String strengths = "";
        String improvements = "";
        String suggestedRating = "";

        try {
            String cleanJson = llmResponse.trim();
            if (cleanJson.contains("```")) {
                cleanJson = cleanJson
                        .replaceAll("```json", "")
                        .replaceAll("```", "")
                        .trim();
            }
            JsonNode node = objectMapper.readTree(cleanJson);
            strengths = node.path("strengths").asText();
            improvements = node.path("improvements").asText();
            suggestedRating = node.path("suggestedRating").asText();
        } catch (Exception e) {
            log.warn("Could not parse LLM JSON response, saving raw: {}", e.getMessage());
            strengths = llmResponse;
        }

        Appraisal appraisal = new Appraisal();
        appraisal.setEmployee(employee);
        appraisal.setManager(manager);
        appraisal.setRawNotes(request.getRawNotes());
        appraisal.setGeneratedSummary(llmResponse);
        appraisal.setStrengths(strengths);
        appraisal.setImprovements(improvements);
        appraisal.setSuggestedRating(suggestedRating);
        appraisal.setStatus(AppraisalStatus.GENERATED);

        Appraisal saved = appraisalRepository.save(appraisal);
        log.info("Appraisal generated and saved with id: {}", saved.getId());

        return mapToResponse(saved);
    }

    @Override
    public AppraisalResponse update(Long id, String updatedSummary) {
        Appraisal appraisal = appraisalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appraisal not found"));

        if (appraisal.getStatus() == AppraisalStatus.FINALIZED) {
            throw new RuntimeException("Cannot edit a finalized appraisal");
        }

        appraisal.setGeneratedSummary(updatedSummary);
        return mapToResponse(appraisalRepository.save(appraisal));
    }

    @Override
    public AppraisalResponse finalize(Long id) {
        Appraisal appraisal = appraisalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appraisal not found"));

        appraisal.setStatus(AppraisalStatus.FINALIZED);
        appraisal.setFinalizedAt(LocalDateTime.now());
        return mapToResponse(appraisalRepository.save(appraisal));
    }

    @Override
    public List<AppraisalResponse> getByEmployee(Long employeeId) {
        return appraisalRepository.findByEmployeeId(employeeId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AppraisalResponse getById(Long id) {
        return mapToResponse(appraisalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appraisal not found")));
    }

    private AppraisalResponse mapToResponse(Appraisal a) {
        return new AppraisalResponse(
                a.getId(),
                a.getEmployee().getName(),
                a.getManager().getName(),
                a.getRawNotes(),
                a.getStrengths(),
                a.getImprovements(),
                a.getSuggestedRating(),
                a.getGeneratedSummary(),
                a.getStatus(),
                a.getCreatedAt(),
                a.getFinalizedAt()
        );
    }
}