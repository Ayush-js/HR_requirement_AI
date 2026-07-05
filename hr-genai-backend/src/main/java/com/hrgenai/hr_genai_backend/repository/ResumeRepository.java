package com.hrgenai.hr_genai_backend.repository;

import com.hrgenai.hr_genai_backend.model.Resume;
import com.hrgenai.hr_genai_backend.model.Resume.ResumeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByJobDescriptionIdOrderByRelevanceScoreDesc(Long jobDescriptionId);
    List<Resume> findByCandidateId(Long candidateId);
    List<Resume> findByStatus(ResumeStatus status);
}