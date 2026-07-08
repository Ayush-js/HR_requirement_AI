package com.hrgenai.hr_genai_backend.service.impl;

import com.hrgenai.hr_genai_backend.service.DocumentParserService;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.io.RandomAccessReadBuffer;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@Service
@Slf4j
public class DocumentParserServiceImpl implements DocumentParserService {

    private static final List<String> SUPPORTED_EXTENSIONS = List.of("pdf", "docx");

    @Override
    public String parseDocument(MultipartFile file) {
        String fileName = file.getOriginalFilename();
        String extension = getFileExtension(fileName);

        try {
            return switch (extension.toLowerCase()) {
                case "pdf" -> parsePdf(file);
                case "docx" -> parseDocx(file);
                default -> throw new RuntimeException(
                    "Unsupported file type: " + extension);
            };
        } catch (IOException e) {
            log.error("Failed to parse document: {}", fileName, e);
            throw new RuntimeException("Failed to parse document: " + fileName);
        }
    }

    @Override
    public String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }

    @Override
    public boolean isValidFileType(String fileName) {
        String extension = getFileExtension(fileName).toLowerCase();
        return SUPPORTED_EXTENSIONS.contains(extension);
    }

   private String parsePdf(MultipartFile file) throws IOException {
    try (PDDocument document = Loader.loadPDF(
            new RandomAccessReadBuffer(file.getInputStream()))) {
        PDFTextStripper stripper = new PDFTextStripper();
        String text = stripper.getText(document);
        log.info("Successfully parsed PDF: {} ({} chars)",
            file.getOriginalFilename(), text.length());
        return text;
    }
}

    private String parseDocx(MultipartFile file) throws IOException {
        try (XWPFDocument document = new XWPFDocument(file.getInputStream())) {
            StringBuilder text = new StringBuilder();
            for (XWPFParagraph paragraph : document.getParagraphs()) {
                text.append(paragraph.getText()).append("\n");
            }
            String result = text.toString();
            log.info("Successfully parsed DOCX: {} ({} chars)",
                file.getOriginalFilename(), result.length());
            return result;
        }
    }
}