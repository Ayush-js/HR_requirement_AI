package com.hrgenai.hr_genai_backend.service.impl;

import com.hrgenai.hr_genai_backend.service.LLMService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class LLMServiceImpl implements LLMService {

    private final ChatClient chatClient;

    @Override
    public String generateText(String prompt) {
        try {
            return chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();
        } catch (Exception e) {
            log.error("LLM call failed: {}", e.getMessage());
            throw new RuntimeException("AI service unavailable: " + e.getMessage());
        }
    }

    @Override
    public String scoreResume(String resumeText, String jobDescriptionText) {
        String prompt = """
                You are an expert HR recruiter. Analyze the resume against the job description.
                
                JOB DESCRIPTION:
                %s
                
                RESUME:
                %s
                
                Respond with ONLY a JSON object in this exact format:
                {
                    "score": <number between 0 and 100>,
                    "reason": "<brief one sentence reason>"
                }
                """.formatted(jobDescriptionText, resumeText);
        return generateText(prompt);
    }

    @Override
    public String extractResumeDetails(String resumeText) {
        String prompt = """
                Extract key details from this resume. Respond with ONLY a JSON object:
                {
                    "name": "<full name>",
                    "email": "<email>",
                    "phone": "<phone>",
                    "skills": "<comma separated skills>",
                    "totalExperience": "<X years>",
                    "currentRole": "<current or latest job title>"
                }
                
                RESUME:
                %s
                """.formatted(resumeText);
        return generateText(prompt);
    }

    @Override
    public String generateAppraisalSummary(String rawNotes, String employeeName) {
        String prompt = """
                You are an HR professional. Convert these raw performance notes into a
                structured appraisal summary for %s.
                
                RAW NOTES:
                %s
                
                Respond with ONLY a JSON object:
                {
                    "strengths": "<key strengths as a paragraph>",
                    "improvements": "<areas for improvement as a paragraph>",
                    "suggestedRating": "<one of: Outstanding, Exceeds Expectations,
                                        Meets Expectations, Needs Improvement>"
                }
                """.formatted(employeeName, rawNotes);
        return generateText(prompt);
    }

    @Override
    public String generateOfferLetter(String candidateName, String jobRole,
                                       String salary, String joiningDate,
                                       String companyName) {
        String prompt = """
                Write a professional offer letter with these details:
                - Candidate Name: %s
                - Job Role: %s
                - Salary: %s per annum
                - Joining Date: %s
                - Company Name: %s
                
                Write a complete, professional offer letter ready to send.
                """.formatted(candidateName, jobRole, salary, joiningDate, companyName);
        return generateText(prompt);
    }

    @Override
    public String answerPolicyQuestion(String question, String context) {
        String prompt = """
                You are an HR assistant. Answer the employee's question using ONLY
                the provided policy document context. If the answer is not in the
                context, say "I couldn't find information about this in the
                current policy documents."
                
                POLICY CONTEXT:
                %s
                
                EMPLOYEE QUESTION:
                %s
                
                Provide a clear, concise answer.
                """.formatted(context, question);
        return generateText(prompt);
    }
}