package com.hrgenai.hr_genai_backend.service;

import com.hrgenai.hr_genai_backend.dto.request.OfferLetterRequest;
import com.hrgenai.hr_genai_backend.dto.response.OfferLetterResponse;
import java.util.List;

public interface OfferLetterService {
    OfferLetterResponse generate(OfferLetterRequest request, String email);
    OfferLetterResponse update(Long id, String updatedContent);
    OfferLetterResponse finalize(Long id);
    List<OfferLetterResponse> getAll(String email);
    OfferLetterResponse getById(Long id);
}