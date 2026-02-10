package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.ai.tool.method.MethodToolCallbackProvider;

@SpringBootApplication
public class McpServerApp {
    public static void main(String[] args) {
        SpringApplication.run(McpServerApp.class, args);
    }

    @Bean
    ToolCallbackProvider pdfTools(PdfService svc) {
        return MethodToolCallbackProvider.builder().toolObjects(svc).build();
    }
}
