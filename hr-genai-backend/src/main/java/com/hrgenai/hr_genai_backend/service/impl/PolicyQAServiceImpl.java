package com.hrgenai.hr_genai_backend.service.impl;

import com.hrgenai.hr_genai_backend.dto.response.PolicyAnswerResponse;
import com.hrgenai.hr_genai_backend.dto.response.PolicyDocumentResponse;
import com.hrgenai.hr_genai_backend.model.PolicyDocument;
import com.hrgenai.hr_genai_backend.model.User;
import com.hrgenai.hr_genai_backend.repository.PolicyDocumentRepository;
import com.hrgenai.hr_genai_backend.repository.UserRepository;
import com.hrgenai.hr_genai_backend.service.DocumentParserService;
import com.hrgenai.hr_genai_backend.service.LLMService;
import com.hrgenai.hr_genai_backend.service.PolicyQAService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PolicyQAServiceImpl implements PolicyQAService {

    private final PolicyDocumentRepository policyDocumentRepository;
    private final UserRepository userRepository;
    private final DocumentParserService documentParserService;
    private final LLMService llmService;
    private final VectorStore vectorStore;

    private static final int CHUNK_SIZE = 500;
    private static final int CHUNK_OVERLAP = 50;

    @Override
    public PolicyDocumentResponse uploadPolicy(MultipartFile file, String email) {
        User uploadedBy = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!documentParserService.isValidFileType(file.getOriginalFilename())) {
            throw new RuntimeException("Unsupported file type");
        }

        log.info("Uploading policy document: {}", file.getOriginalFilename());

        String extractedText = documentParserService.parseDocument(file);
        List<String> chunks = chunkText(extractedText);

        log.info("Split into {} chunks", chunks.size());

        // Store chunks in Qdrant
        List<Document> documents = new ArrayList<>();
        for (int i = 0; i < chunks.size(); i++) {
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("document_type", "POLICY");
            metadata.put("file_name", file.getOriginalFilename());
            metadata.put("chunk_index", String.valueOf(i));

            documents.add(new Document(
                    UUID.randomUUID().toString(),
                    chunks.get(i),
                    metadata
            ));
        }

        vectorStore.add(documents);
        log.info("Stored {} chunks in Qdrant", documents.size());

        // Save metadata to MySQL
        PolicyDocument policy = new PolicyDocument();
        policy.setTitle(file.getOriginalFilename()
                .replaceAll("\\.(pdf|docx)$", ""));
        policy.setFileName(file.getOriginalFilename());
        policy.setFilePath("uploads/policies/" + file.getOriginalFilename());
        policy.setUploadedBy(uploadedBy);
        policy.setChunkCount(chunks.size());

        PolicyDocument saved = policyDocumentRepository.save(policy);
        log.info("Policy saved with id: {}", saved.getId());

        return mapToResponse(saved);
    }

    @Override
    public PolicyAnswerResponse askQuestion(String question) {
        log.info("Answering question: {}", question);

        // Search vector store for relevant chunks
        List<Document> relevantDocs = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(question)
                        .topK(5)
                        .filterExpression("document_type == 'POLICY'")
                        .build()
        );

        if (relevantDocs.isEmpty()) {
            return new PolicyAnswerResponse(
                    question,
                    "I couldn't find information about this in the current " +
                    "policy documents.",
                    "No relevant policy found"
            );
        }

        // Build context from retrieved chunks
        String context = relevantDocs.stream()
                .map(Document::getText)
                .collect(Collectors.joining("\n\n"));

        // Get source document name
        String sourceDoc = relevantDocs.get(0).getMetadata()
                .getOrDefault("file_name", "Policy Document").toString();

        // Generate answer using LLM
        String answer = llmService.answerPolicyQuestion(question, context);

        log.info("Answer generated from source: {}", sourceDoc);

        return new PolicyAnswerResponse(question, answer, sourceDoc);
    }

    @Override
    public List<PolicyDocumentResponse> getAllPolicies() {
        return policyDocumentRepository.findByIsActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deletePolicy(Long id) {
        PolicyDocument policy = policyDocumentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found"));
        policy.setIsActive(false);
        policyDocumentRepository.save(policy);
    }

    private List<String> chunkText(String text) {
        List<String> chunks = new ArrayList<>();
        String[] words = text.split("\\s+");
        StringBuilder chunk = new StringBuilder();
        int wordCount = 0;

        for (String word : words) {
            chunk.append(word).append(" ");
            wordCount++;

            if (wordCount >= CHUNK_SIZE) {
                chunks.add(chunk.toString().trim());
                // Keep overlap
                String[] chunkWords = chunk.toString().trim().split("\\s+");
                chunk = new StringBuilder();
                for (int i = Math.max(0, chunkWords.length - CHUNK_OVERLAP);
                     i < chunkWords.length; i++) {
                    chunk.append(chunkWords[i]).append(" ");
                }
                wordCount = CHUNK_OVERLAP;
            }
        }

        if (!chunk.isEmpty()) {
            chunks.add(chunk.toString().trim());
        }

        return chunks;
    }

    private PolicyDocumentResponse mapToResponse(PolicyDocument p) {
        return new PolicyDocumentResponse(
                p.getId(),
                p.getTitle(),
                p.getFileName(),
                p.getUploadedBy().getName(),
                p.getUploadedAt(),
                p.getIsActive(),
                p.getChunkCount()
        );
    }
}