package com.hrgenai.hr_genai_backend.repository;

import com.hrgenai.hr_genai_backend.model.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    List<Candidate> findByCreatedById(Long userId);
    Boolean existsByEmail(String email);
}