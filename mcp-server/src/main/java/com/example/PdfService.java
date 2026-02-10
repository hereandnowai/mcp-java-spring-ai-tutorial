package com.example;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.ai.document.Document;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;
import java.util.List;

@Service
public class PdfService {
    
    private List<Document> cachedDocs;
    
    private synchronized List<Document> getDocs() {
        if (cachedDocs == null) {
            cachedDocs = new PagePdfDocumentReader("classpath:ai-training-for-java-dev.pdf").read();
        }
        return cachedDocs;
    }
    
    @Tool(description = "Get the title and overview of the AI training program for Java developers")
    public String getTrainingTitle() {
        try {
            System.out.println("Getting training title...");
            List<Document> docs = getDocs();
            if (docs.isEmpty()) return "No content found";
            
            String firstPage = docs.get(0).getFormattedContent();
            // Extract first 500 characters which should contain the title
            String preview = firstPage.substring(0, Math.min(500, firstPage.length()));
            System.out.println("Returning title preview: " + preview.length() + " chars");
            return preview;
        } catch (Exception e) {
            System.err.println("Error getting title: " + e.getMessage());
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }
    
    @Tool(description = "Read a specific page (1-10) from the AI training PDF for Java developers")
    public String readPdfPage(int pageNumber) {
        try {
            System.out.println("Reading page: " + pageNumber);
            List<Document> docs = getDocs();
            
            if (pageNumber < 1 || pageNumber > docs.size()) {
                return "Invalid page number. PDF has " + docs.size() + " pages (1-" + docs.size() + ")";
            }
            
            String content = docs.get(pageNumber - 1).getFormattedContent();
            System.out.println("Returning page " + pageNumber + ": " + content.length() + " chars");
            return content;
        } catch (Exception e) {
            System.err.println("Error reading page: " + e.getMessage());
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }
    
    @Tool(description = "Get summary info about the AI training PDF (total pages, size)")
    public String getPdfInfo() {
        try {
            List<Document> docs = getDocs();
            return "PDF: ai-training-for-java-dev.pdf\n" +
                   "Total Pages: " + docs.size() + "\n" +
                   "Use getTrainingTitle() for the title, or readPdfPage(n) for specific pages.";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}
