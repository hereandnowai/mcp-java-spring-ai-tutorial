package com.example;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.mcp.SyncMcpToolCallbackProvider;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class McpClientApp {
    public static void main(String[] args) {
        SpringApplication.run(McpClientApp.class, args);
    }

    @Bean
    CommandLineRunner chat(ChatClient.Builder builder, SyncMcpToolCallbackProvider tools) {
        return args -> {
            var client = builder.defaultTools(tools).build();
            var scanner = new java.util.Scanner(System.in);
            System.out.println("\n--- HERE AND NOW AI ---");
            System.out.println("AI is Good | Chatting with Caramel (M4 Pro Max Optimized)\n");
            while (true) {
                System.out.print("You: ");
                String input = scanner.nextLine();
                if ("exit".equalsIgnoreCase(input)) break;
                // Using non-streaming due to Spring AI M6 bug with Ollama streaming
                // Performance still optimized via application.properties settings
                System.out.println("\nCaramel: " + client.prompt(input).call().content() + "\n");
            }
        };
    }
}
