package com.hrgenai.hr_genai_backend.service;

import com.hrgenai.hr_genai_backend.dto.response.CandidateScoreResponse;
import com.hrgenai.hr_genai_backend.dto.response.ResumeProfileResponse;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface ResumeService {
    List<CandidateScoreResponse> uploadAndProcess(
            List<MultipartFile> files, Long jobDescriptionId, String email);
    List<CandidateScoreResponse> getRankedCandidates(Long jobDescriptionId);
    ResumeProfileResponse getProfile(Long resumeId);
    void deleteResume(Long resumeId);
}