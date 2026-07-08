package com.hrgenai.hr_genai_backend.service.impl;

import com.hrgenai.hr_genai_backend.dto.request.OfferLetterRequest;
import com.hrgenai.hr_genai_backend.dto.response.OfferLetterResponse;
import com.hrgenai.hr_genai_backend.model.Candidate;
import com.hrgenai.hr_genai_backend.model.OfferLetter;
import com.hrgenai.hr_genai_backend.model.OfferLetter.OfferStatus;
import com.hrgenai.hr_genai_backend.model.User;
import com.hrgenai.hr_genai_backend.repository.CandidateRepository;
import com.hrgenai.hr_genai_backend.repository.OfferLetterRepository;
import com.hrgenai.hr_genai_backend.repository.UserRepository;
import com.hrgenai.hr_genai_backend.service.LLMService;
import com.hrgenai.hr_genai_backend.service.OfferLetterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OfferLetterServiceImpl implements OfferLetterService {

    private final OfferLetterRepository offerLetterRepository;
    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;
    private final LLMService llmService;

    @Override
    public OfferLetterResponse generate(OfferLetterRequest request, String email) {
        User generatedBy = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Candidate candidate = candidateRepository.findById(request.getCandidateId())
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        log.info("Generating offer letter for candidate: {}", candidate.getName());

        String generatedContent = llmService.generateOfferLetter(
                candidate.getName(),
                request.getJobRole(),
                request.getSalary().toString(),
                request.getJoiningDate().toString(),
                request.getCompanyName()
        );

        OfferLetter offerLetter = new OfferLetter();
        offerLetter.setCandidate(candidate);
        offerLetter.setGeneratedBy(generatedBy);
        offerLetter.setJobRole(request.getJobRole());
        offerLetter.setSalary(request.getSalary());
        offerLetter.setJoiningDate(request.getJoiningDate());
        offerLetter.setGeneratedContent(generatedContent);
        offerLetter.setStatus(OfferStatus.DRAFT);

        OfferLetter saved = offerLetterRepository.save(offerLetter);
        log.info("Offer letter generated and saved with id: {}", saved.getId());

        return mapToResponse(saved, request.getCompanyName());
    }

    @Override
    public OfferLetterResponse update(Long id, String updatedContent) {
        OfferLetter offerLetter = offerLetterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer letter not found"));

        if (offerLetter.getStatus() == OfferStatus.FINALIZED) {
            throw new RuntimeException("Cannot edit a finalized offer letter");
        }

        offerLetter.setGeneratedContent(updatedContent);
        return mapToResponse(offerLetterRepository.save(offerLetter), "");
    }

    @Override
    public OfferLetterResponse finalize(Long id) {
        OfferLetter offerLetter = offerLetterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer letter not found"));

        offerLetter.setStatus(OfferStatus.FINALIZED);
        return mapToResponse(offerLetterRepository.save(offerLetter), "");
    }

    @Override
    public List<OfferLetterResponse> getAll(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return offerLetterRepository.findByGeneratedById(user.getId())
                .stream()
                .map(o -> mapToResponse(o, ""))
                .collect(Collectors.toList());
    }

    @Override
    public OfferLetterResponse getById(Long id) {
        OfferLetter offerLetter = offerLetterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer letter not found"));
        return mapToResponse(offerLetter, "");
    }

    private OfferLetterResponse mapToResponse(OfferLetter o, String companyName) {
        return new OfferLetterResponse(
                o.getId(),
                o.getCandidate().getName(),
                o.getJobRole(),
                o.getSalary(),
                o.getJoiningDate(),
                companyName,
                o.getGeneratedContent(),
                o.getStatus(),
                o.getCreatedAt()
        );
    }
}