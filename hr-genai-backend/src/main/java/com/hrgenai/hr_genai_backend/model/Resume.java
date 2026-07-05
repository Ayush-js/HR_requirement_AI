package com.hrgenai.hr_genai_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "resumes")
@Data
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_description_id", nullable = false)
    private JobDescription jobDescription;

    @Column(nullable = false, length = 255)
    private String fileName;

    @Column(nullable = false, length = 500)
    private String filePath;

    @Column(columnDefinition = "LONGTEXT")
    private String extractedText;

    @Column(columnDefinition = "TEXT")
    private String extractedSkills;

    private Double relevanceScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResumeStatus status = ResumeStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    @Column(length = 100)
    private String vectorId;

    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
    }

    public enum ResumeStatus {
        PENDING,
        PROCESSING,
        DONE,
        FAILED
    }
}