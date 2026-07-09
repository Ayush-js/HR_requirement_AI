package com.hrgenai.hr_genai_backend.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hrgenai.hr_genai_backend.dto.response.CandidateScoreResponse;
import com.hrgenai.hr_genai_backend.dto.response.ResumeProfileResponse;
import com.hrgenai.hr_genai_backend.model.*;
import com.hrgenai.hr_genai_backend.model.Resume.ResumeStatus;
import com.hrgenai.hr_genai_backend.repository.*;
import com.hrgenai.hr_genai_backend.service.DocumentParserService;
import com.hrgenai.hr_genai_backend.service.LLMService;
import com.hrgenai.hr_genai_backend.service.ResumeService;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ResumeServiceImpl implements ResumeService {

    private final ResumeRepository resumeRepository;
    private final CandidateRepository candidateRepository;
    private final JobDescriptionRepository jobDescriptionRepository;
    private final UserRepository userRepository;
    private final DocumentParserService documentParserService;
    private final LLMService llmService;
    private final VectorStore vectorStore;
    private final ObjectMapper objectMapper;

    @Override
    public List<CandidateScoreResponse> uploadAndProcess(
            List<MultipartFile> files, Long jobDescriptionId, String email) {

        User uploadedBy = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        JobDescription jd = jobDescriptionRepository.findById(jobDescriptionId)
                .orElseThrow(() -> new RuntimeException("Job description not found"));

        List<CandidateScoreResponse> results = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                log.info("Processing resume: {}", file.getOriginalFilename());

                if (!documentParserService.isValidFileType(
                        file.getOriginalFilename())) {
                    log.warn("Skipping unsupported file: {}",
                            file.getOriginalFilename());
                    continue;
                }

                // Parse document
                String extractedText = documentParserService.parseDocument(file);

                // Extract candidate details via LLM
                String detailsJson = llmService.extractResumeDetails(extractedText);
                String name = "Unknown";
                String email2 = "";
                String phone = "";
                String skills = "";

                try {
                    String cleanJson = detailsJson.trim()
                            .replaceAll("```json", "")
                            .replaceAll("```", "")
                            .trim();
                    JsonNode node = objectMapper.readTree(cleanJson);
                    name = node.path("name").asText("Unknown");
                    email2 = node.path("email").asText("");
                    phone = node.path("phone").asText("");
                    skills = node.path("skills").asText("");
                } catch (Exception e) {
                    log.warn("Could not parse candidate details JSON: {}",
                            e.getMessage());
                }

                // Create or find candidate
                Candidate candidate = new Candidate();
                candidate.setName(name);
                candidate.setEmail(email2);
                candidate.setPhone(phone);
                candidate.setCreatedBy(uploadedBy);
                candidate = candidateRepository.save(candidate);

                // Score resume against JD
                String scoreJson = llmService.scoreResume(
                        extractedText, jd.getDescription());
                double score = 0.0;

                try {
                    String cleanJson = scoreJson.trim()
                            .replaceAll("```json", "")
                            .replaceAll("```", "")
                            .trim();
                    JsonNode node = objectMapper.readTree(cleanJson);
                    score = node.path("score").asDouble(0.0);
                } catch (Exception e) {
                    log.warn("Could not parse score JSON: {}", e.getMessage());
                }

                // Save resume to MySQL
                Resume resume = new Resume();
                resume.setCandidate(candidate);
                resume.setJobDescription(jd);
                resume.setFileName(file.getOriginalFilename());
                resume.setFilePath("uploads/" + file.getOriginalFilename());
                resume.setExtractedText(extractedText);
                resume.setExtractedSkills(skills);
                resume.setRelevanceScore(score);
                resume.setStatus(ResumeStatus.DONE);
                resume = resumeRepository.save(resume);

                // Store embedding in Qdrant
                try {
                    String vectorId = UUID.randomUUID().toString();
                    Map<String, Object> metadata = new HashMap<>();
                    metadata.put("document_type", "RESUME");
                    metadata.put("source_id", resume.getId().toString());
                    metadata.put("candidate_name", name);

                    Document doc = new Document(
                            vectorId, extractedText, metadata);
                    vectorStore.add(List.of(doc));

                    resume.setVectorId(vectorId);
                    resumeRepository.save(resume);
                    log.info("Stored embedding for resume id: {}", resume.getId());
                } catch (Exception e) {
                    log.warn("Could not store embedding: {}", e.getMessage());
                }

                results.add(mapToScoreResponse(resume, candidate));

            } catch (Exception e) {
                log.error("Failed to process resume: {}",
                        file.getOriginalFilename(), e);
            }
        }

        return results;
    }

    @Override
    public List<CandidateScoreResponse> getRankedCandidates(Long jobDescriptionId) {
        return resumeRepository
                .findByJobDescriptionIdOrderByRelevanceScoreDesc(jobDescriptionId)
                .stream()
                .map(r -> mapToScoreResponse(r, r.getCandidate()))
                .collect(Collectors.toList());
    }

    @Override
    public ResumeProfileResponse getProfile(Long resumeId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));
        return mapToProfileResponse(resume);
    }

    @Override
    public void deleteResume(Long resumeId) {
        resumeRepository.deleteById(resumeId);
    }

    private CandidateScoreResponse mapToScoreResponse(
            Resume r, Candidate c) {
        return new CandidateScoreResponse(
                r.getId(),
                c.getId(),
                c.getName(),
                c.getEmail(),
                r.getExtractedSkills(),
                r.getRelevanceScore(),
                r.getStatus(),
                r.getUploadedAt()
        );
    }

    private ResumeProfileResponse mapToProfileResponse(Resume r) {
        return new ResumeProfileResponse(
                r.getId(),
                r.getFileName(),
                r.getCandidate().getName(),
                r.getCandidate().getEmail(),
                r.getCandidate().getPhone(),
                r.getExtractedSkills(),
                r.getExtractedText(),
                r.getRelevanceScore(),
                r.getJobDescription().getTitle(),
                r.getStatus(),
                r.getUploadedAt()
        );
    }
}