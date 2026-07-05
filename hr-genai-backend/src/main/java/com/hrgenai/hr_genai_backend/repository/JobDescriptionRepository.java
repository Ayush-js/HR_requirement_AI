package com.hrgenai.hr_genai_backend.repository;

import com.hrgenai.hr_genai_backend.model.JobDescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobDescriptionRepository extends JpaRepository<JobDescription, Long> {
    List<JobDescription> findByIsActiveTrue();
}