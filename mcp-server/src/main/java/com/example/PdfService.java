package com.example;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.ai.document.Document;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

@Service
public class PdfService {
    @Tool(description = "Read the AI training PDF document content for Java developers")
    public String readPdf() {
        return new PagePdfDocumentReader("classpath:ai-training-for-java-dev.pdf")
            .read()
            .stream()
            .map(Document::getFormattedContent)
            .collect(Collectors.joining("\n\n"));
    }
}
