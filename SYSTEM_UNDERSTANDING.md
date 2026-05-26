# SYSTEM UNDERSTANDING — MCP Tuto Java Spring AI

## 1. Application Overview
- **Application Name:** MCP Tuto Java Spring AI
- **Purpose:** This application serves as a comprehensive demonstration of the **Model Context Protocol (MCP)** implementation using the Java ecosystem. It showcases how local proprietary data (PDFs) can be securely and efficiently shared with Large Language Models (LLMs) via a standardized protocol.
- **Primary Problem it Solves:** Bridges the gap between LLMs and local, private data sources without requiring complex custom integrations for every data type. It allows AI agents to "read" and understand local documents.
- **Target Users:** Java developers, AI engineers, and architects looking to implement MCP in a Spring-based environment.
- **Real-World Use Cases:** 
    - Intelligent document retrieval for corporate knowledge bases.
    - Local AI assistants with access to private technical manuals.
    - Standardized tool integration for AI agents in a Java-centric enterprise.

---

## 2. High-Level System Architecture
- **Architecture Style:** Decoupled Client-Server architecture utilizing the Model Context Protocol (MCP).
- **Interaction Flow:**
    1. **MCP Server** starts and hosts tools that can read local PDF files.
    2. **MCP Client** (CLI or UI) connects to the server via **Server-Sent Events (SSE)**.
    3. The **Client** interfaces with an LLM (Ollama).
    4. When a user asks a question, the LLM determines if it needs to use a "tool" (e.g., read a PDF page).
    5. The Client executes the tool via the MCP connection and returns the data to the LLM.
    6. The LLM provides a final answer based on the retrieved context.
- **External Services:**
    - **Ollama:** Local LLM runner (hosting models like `gpt-oss:20b`).
- **Text-Based Architecture Diagram:**
```text
[ User (CLI / Angular UI) ]
          ↕
[ MCP Client (Spring Boot / Ollama API) ]
          ↕ (MCP via SSE)
[ MCP Server (Spring Boot) ]
          ↕
[ Local PDF Storage (ai-training-for-java-dev.pdf) ]
```

---

## 3. Frontend
- **Framework/Library:** Angular (v21.0.0-next.0).
- **Folder Structure:**
    - `src/app/services`: Contains `McpService` (MCP protocol handling) and `ChatService` (Ollama integration and chat logic).
    - `src/app`: Main component (`app.ts`, `app.html`, `app.scss`) for the chat interface.
- **Routing:** Uses `app.routes.ts` for standard Angular routing (though primarily a single-page chatbot).
- **State Management:** Uses Angular **Signals** (`signal`) for managing messages, typing status, and connection state.
- **UI/UX Behavior:**
    - **Theme:** "Caramel" theme featuring Deep Teal (`#004040`) and Electric Yellow (`#FFDF00`).
    - **Interactions:** Real-time streaming chat responses from Ollama.
    - **Markdown:** Utilizes `marked` for rendering LLM responses.
- **Key Screens:**
    - **Chat Window:** The main interface with message history, status indicators for MCP connection, and input area.

---

## 4. Backend
- **Runtime & Framework:** Java 21, Spring Boot 3.4.1, Spring AI 1.0.0-M6.
- **Folder Structure:**
    - `mcp-server/`: The "Brain" containing the MCP tools and resource management.
    - `mcp-client/`: A CLI-based client application.
    - `org/springframework/ai/...`: Custom/Internal autoconfiguration for MCP.
- **API Design Pattern:** Follows the MCP specification over SSE (Server-Sent Events).
- **Controllers / Services:**
    - `PdfService`: Handles PDF reading using `PagePdfDocumentReader`.
    - `McpServerApp`: Configures the MCP server and registers tools.
- **Authentication & Authorization:** None implemented (Open for local development).
- **Error Handling:** Basic try-catch blocks in `PdfService` with error messages returned as tool outputs.

---

## 5. Database & Storage
- **Type:** File-based storage.
- **Schema:** No formal database schema.
- **Data Source:** `ai-training-for-java-dev.pdf` located in `mcp-server/src/main/resources`.
- **Persistence:** Documents are read into memory and cached in `PdfService` during the application lifecycle.

---

## 6. API Documentation (AS-IS)
The MCP Server exposes the following endpoints (standard for Spring AI MCP implementation):

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/sse` | GET | Establishes the SSE connection for MCP events. |
| `/mcp/message` | POST | Handles incoming MCP JSON-RPC messages. |

### MCP Tools (Function Callables)
| Tool Name | Description |
| :--- | :--- |
| `getTrainingTitle` | Returns the first 500 characters of the PDF (title and overview). |
| `readPdfPage(pageNumber)` | Returns the full text content of a specific page (1-indexed). |
| `getPdfInfo` | Returns metadata like total page count and file name. |
| `searchPdf(keyword)` | Searches the entire PDF for a keyword and returns page numbers where it appears. |

---

## 7. Core Functionalities
### 1. PDF Context Retrieval & Search
- **Description:** Allows the LLM to query local PDF content dynamically and search for specific keywords throughout the document.
- **Logic:** `PdfService.getDocs()` initializes a reader that splits the PDF into `Document` objects per page. `searchPdf` iterates through these to find keyword matches.
- **User Flow:** User asks "Where does it mention 'Spring AI'?"; LLM calls `searchPdf("Spring AI")`; Client returns page numbers; LLM offers to read those pages.

### 2. Multi-Component Chat & Discovery Mode
- **Description:** Both a CLI and a Web UI can interact with the same underlying MCP logic. The UI includes a "Neural Pulse" connection indicator and a secret "System Scan" discovery mode.
- **Logic:** The UI uses Angular `@HostListener` to detect secret keyboard shortcuts (`Ctrl+Shift+F`) for developer insights.

### 3. LLM Orchestration (Ollama)
- **Description:** The client acts as the orchestrator, managing the loop between user input, LLM reasoning, tool execution, and output.

---

## 8. Configuration & Environment
- **Server Config (`mcp-server`):**
    - `server.port=8081`
    - `spring.ai.mcp.server.sse-message-endpoint=/mcp/message`
- **Client Config (`mcp-client`):**
    - `spring.ai.ollama.chat.model=gpt-oss:20b`
    - `spring.ai.mcp.client.sse.connections.pdf-server.url=http://localhost:8081`
- **UI Config:**
    - Hardcoded connection to `http://localhost:8081/sse` in `mcp.service.ts`.
    - Hardcoded Ollama endpoint `http://localhost:11434/api/chat` in `chat.service.ts`.

---

## 9. Deployment & Infrastructure
- **Hosting:** Local execution via Maven and npm.
- **Build Flow:**
    - `mvn clean package` for Java modules.
    - `npm install` and `ng serve` for Angular.
- **CI/CD:** Not present in the current codebase.

---

## 10. Security Considerations
- **CORS:** Broadly enabled (`allowedOrigins="*"`) in `McpServerApp`.
- **Data Safety:** Tools are limited to reading a specific PDF file; no arbitrary file system access is exposed.
- **Limitations:** No authentication layer; intended for local/private network use only.

---

## 11. Logging, Monitoring & Debugging
- **Logging:** Standard Spring Boot console logging. `PdfService` has explicit `System.out.println` for tool execution tracking.
- **Debugging:** MCP discovery can be inspected via the `/sse` stream.

---

## 12. Tech Stack Summary
| Category | Technology |
| :--- | :--- |
| **Frontend** | Angular, RxJS, Lucide-Angular, Marked |
| **Backend** | Java 21, Spring Boot 3.4.1, Spring AI |
| **Protocol** | Model Context Protocol (MCP) |
| **LLM Engine** | Ollama |
| **Build Tools** | Maven, npm |

---

## 13. Current Status & Maturity Assessment
- **Status:** Functional MVP / Educational Tutorial.
- **Complete:** MCP Server-Client connection, PDF tool implementation, Basic Chat UI, Ollama integration.
- **Partial:** Streaming is implemented in UI but the Client app notes a bug in Spring AI M6 for streaming with Ollama.
- **Stubbed:** No database or multi-user support (sessions are local).

---

## 14. Known Constraints & Assumptions
- **Context Window:** Ollama is configured with `num_ctx: 8192`.
- **Fixed Resource:** The PDF file path is hardcoded in `PdfService`.
- **Local Dependency:** Relies on a running Ollama instance at `localhost:11434`.

---

## 15. How This App Is Meant to Be Extended
- **Adding Tools:** New methods in `PdfService` (or new services) with the `@Tool` annotation will automatically be discovered by the MCP client.
- **Adding Data Sources:** The `PdfService` can be swapped or augmented with database readers or web scrapers following the same MCP pattern.
- **UI Enhancements:** The `ChatService` in Angular is modular and can support different LLM providers (e.g., Azure OpenAI) by changing the `OLLAMA_URL`.
