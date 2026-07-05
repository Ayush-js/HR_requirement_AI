package com.hrgenai.hr_genai_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "appraisals")
@Data
public class Appraisal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private User employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id", nullable = false)
    private User manager;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String rawNotes;

    @Column(columnDefinition = "LONGTEXT")
    private String generatedSummary;

    @Column(columnDefinition = "TEXT")
    private String strengths;

    @Column(columnDefinition = "TEXT")
    private String improvements;

    @Column(length = 20)
    private String suggestedRating;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppraisalStatus status = AppraisalStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime finalizedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum AppraisalStatus {
        PENDING,
        GENERATED,
        FINALIZED
    }
}