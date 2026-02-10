<p align="center">
  <img src="https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/logo-of-here-and-now-ai.png" alt="HERE AND NOW AI Logo" width="400">
</p>

# 🚀 Building Intelligent MCP Tooling with Java & Spring AI

### *AI is Good*

Welcome to a state-of-the-art implementation of the **Model Context Protocol (MCP)**, engineered by **HERE AND NOW AI**. This project demonstrates how to orchestrate intelligent AI agents using Java and Spring AI, enabling them to bridge the gap between LLMs and your local proprietary data.

## 🌟 Why MCP with Spring AI?

At **HERE AND NOW AI**, we believe that context is the key to unlocking AI's true potential. This project showcases:
- **Scalable Architecture**: Decoupled client-server model using MCP standards.
- **Deep Context Enhancement**: AI agents that can "read" and understand local PDF documents.
- **Developer Productivity**: Leveraging the Spring AI ecosystem for rapid development and deployment.

## 🏗️ Project Structure

- **[mcp-server](mcp-server)**: The "Brain" - A Spring Boot service that exposes a PDF-reading tool.
- **[mcp-ui](mcp-ui)**: The "Face" - A modern Angular 21 chatbot interface for interacting with the AI and tools.
- **[mcp-client](mcp-client)**: The Console Client - Original Java-based terminal interaction tool.

## 🚀 Getting Started

Follow these steps to experience the power of Java-driven AI context.

> **⚡ PERFORMANCE NOTE**: This app is optimized for Apple Silicon with **streaming enabled** for instant responses. See [PERFORMANCE.md](PERFORMANCE.md) for details.

### 1. Prepare the LLM
We recommend using **Ollama** with a robust model:
```bash
ollama pull gpt-oss:20b
```

### 2. Build the System
Compile and package both modules from the root:
```bash
mvn clean package -DskipTests
```

### 3. Launch the MCP Server (Terminal 1)
```bash
cd mcp-server
mvn spring-boot:run
```

### 4. Launch the MCP Client (Terminal 2)
```bash
cd mcp-client
mvn spring-boot:run
```

Once running, engage with the AI! Try asking: *"What are the core takeaways from the AI training document?"*

### Troubleshooting

**If the client times out (120s timeout error)**:
1. Ensure the MCP server (Terminal 1) is running without errors
2. Verify Ollama is running: `ollama list`
3. Test Ollama responds: `curl -X POST http://localhost:11434/api/generate -d '{"model": "gpt-oss:20b", "prompt": "hello", "stream": false}'`
4. Clean restart both services:
   - Kill server: `lsof -ti:8081 | xargs kill -9`
   - Restart server in Terminal 1
   - Restart client in Terminal 2

---

## 🤝 Connect with Us

Join the conversation and build the future with **HERE AND NOW AI**.

- **Website**: [hereandnowai.com](https://hereandnowai.com)
- **LinkedIn**: [Company Profile](https://www.linkedin.com/company/hereandnowai/)
- **X (Twitter)**: [@hereandnow_ai](https://x.com/hereandnow_ai)
- **Instagram**: [@hereandnow_ai](https://instagram.com/hereandnow_ai)
- **YouTube**: [Subscribe](https://youtube.com/@hereandnow_ai)
- **GitHub**: [Source Code](https://github.com/hereandnowai)

📧 **Email**: [info@hereandnowai.com](mailto:info@hereandnowai.com)  
📞 **Phone**: +91 996 296 1000

---

<p align="center">
  <i>"AI is Good"</i><br>
  <b>© 2026 HERE AND NOW AI</b>
</p>



### 5. Launch the Web UI (Terminal 3)

Access the chatbot at  to interact with **Caramel**, your branded AI companion.

