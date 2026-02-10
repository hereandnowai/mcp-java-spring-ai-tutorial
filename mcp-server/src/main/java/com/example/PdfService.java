package com.example;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.stereotype.Service;

@Service
public class PdfService {
    @Tool(description = "Read the AI training PDF document content")
    public String readPdf() {
        return new PagePdfDocumentReader("classpath:ai-training-for-java-dev.pdf").read().toString();
    }
}
