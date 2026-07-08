package com.hrgenai.hr_genai_backend.service;

public interface LLMService {
    String generateText(String prompt);
    String scoreResume(String resumeText, String jobDescriptionText);
    String extractResumeDetails(String resumeText);
    String generateAppraisalSummary(String rawNotes, String employeeName);
    String generateOfferLetter(String candidateName, String jobRole,
                                String salary, String joiningDate,
                                String companyName);
    String answerPolicyQuestion(String question, String context);
}