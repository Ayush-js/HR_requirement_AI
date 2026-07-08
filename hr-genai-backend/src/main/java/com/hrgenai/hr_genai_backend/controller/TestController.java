package com.hrgenai.hr_genai_backend.controller;

import com.hrgenai.hr_genai_backend.service.LLMService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final LLMService llmService;

    @GetMapping("/ai")
    public ResponseEntity<String> testAI() {
        String response = llmService.generateText(
            "Say hello and confirm you are LLaMA running on Groq. Keep it to one sentence."
        );
        return ResponseEntity.ok(response);
    }
}