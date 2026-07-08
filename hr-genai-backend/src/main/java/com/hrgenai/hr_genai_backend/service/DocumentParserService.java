package com.hrgenai.hr_genai_backend.service;

import org.springframework.web.multipart.MultipartFile;

public interface DocumentParserService {
    String parseDocument(MultipartFile file);
    String getFileExtension(String fileName);
    boolean isValidFileType(String fileName);
}