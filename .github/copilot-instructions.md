# Copilot Instructions — MCP Tuto Java Spring AI

## Project Overview
This project is a reference implementation of the **Model Context Protocol (MCP)** using **Java 21**, **Spring Boot 3.4.1**, and **Angular 21**. It enables AI agents to interact with local PDF data through a standardized interface.

## Tech Stack
- **Backend:** Java 21, Spring Boot 3.4.1, Spring AI 1.0.0-M6.
- **Frontend:** Angular 21 (Signals-based state management).
- **Protocol:** Model Context Protocol (MCP) via Server-Sent Events (SSE).
- **LLM Engine:** Ollama (default model: `gpt-oss:20b`).
- **Build Tools:** Maven for Java, npm/Angular CLI for frontend.

## Key Architectural Patterns
- **MCP Server-Client:** The system follows the MCP specification. The server hosts tools; the client (CLI or UI) consumes them to provide context to the LLM.
- **Tool Definition:** Backend tools are defined using the `@Tool` annotation in the `mcp-server` module (specifically in `PdfService.java`). Any method marked with `@Tool` is automatically exposed via MCP.
- **Communication:** The frontend communicates with the backend via SSE (`http://localhost:8081/sse`).
- **State Management:** The Angular frontend uses **Signals** (`signal`, `update`, `set`) for real-time chat state and connection tracking.

## Coding Standards & Conventions

### Backend (Java/Spring)
- Use **Java 21** features (e.g., records, text blocks) where appropriate.
- Annotate new MCP tools with `@Tool(description = "...")` in services registered as `ToolCallbackProvider`.
- Follow Spring Boot best practices for dependency injection and service layering.
- Resource paths for local data should be relative to `classpath:` (e.g., `classpath:ai-training-for-java-dev.pdf`).

### Frontend (Angular)
- Use **Signals** for all reactive state.
- Prefer **Standalone Components** (as seen in `app.ts`).
- Use `@if` and `@for` block syntax for templates.
- Markdown rendering should use the `marked` library as per the current `renderMarkdown` implementation.
- Keep `ChatService` as the orchestrator for Ollama API calls and `McpService` for protocol-level connection.

## Ports & Endpoints
- **MCP Server:** `http://localhost:8081`
- **MCP SSE Endpoint:** `/sse`
- **Ollama API:** `http://localhost:11434/api/chat`

## Development Workflow
1. **Infrastructure:** Ensure Ollama is running and the model (`gpt-oss:20b`) is pulled.
2. **Backend:** Run `mcp-server` first to host the tools. It uses port 8081.
3. **Frontend:** Run `mcp-ui` using `npm start`. It connects to the server and Ollama.
4. **CLI Client:** `mcp-client` can be used as an alternative interface.

## Extension Guide
- **New Tools:** Add a method to `PdfService.java` with the `@Tool` annotation.
- **New Data Sources:** Create a new service, implement tools, and register it in `McpServerApp.java` via a `ToolCallbackProvider` bean.
- **UI Changes:** Modify `app.html` / `app.ts` using the existing "Caramel" theme styles.
