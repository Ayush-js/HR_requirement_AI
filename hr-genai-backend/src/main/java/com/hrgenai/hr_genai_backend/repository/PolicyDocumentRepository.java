package com.hrgenai.hr_genai_backend.repository;

import com.hrgenai.hr_genai_backend.model.PolicyDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PolicyDocumentRepository extends JpaRepository<PolicyDocument, Long> {
    List<PolicyDocument> findByIsActiveTrue();
    List<PolicyDocument> findByUploadedById(Long userId);
}