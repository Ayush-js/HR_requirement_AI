package com.hrgenai.hr_genai_backend.repository;

import com.hrgenai.hr_genai_backend.model.Appraisal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AppraisalRepository extends JpaRepository<Appraisal, Long> {
    List<Appraisal> findByEmployeeId(Long employeeId);
    List<Appraisal> findByManagerId(Long managerId);
}