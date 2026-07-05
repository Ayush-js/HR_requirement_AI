package com.hrgenai.hr_genai_backend.repository;

import com.hrgenai.hr_genai_backend.model.OfferLetter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OfferLetterRepository extends JpaRepository<OfferLetter, Long> {
    List<OfferLetter> findByCandidateId(Long candidateId);
    List<OfferLetter> findByGeneratedById(Long userId);
}