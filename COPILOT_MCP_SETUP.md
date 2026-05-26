# GitHub Copilot MCP Configuration Guide

## 🎯 Objective
Enable GitHub Copilot to read PDF content from your MCP server.

---

## ✅ Configuration Complete

The MCP server configuration has been added to `.vscode/settings.json`.

### What's Configured:
- **Server Name**: `pdf-server`
- **Type**: SSE (Server-Sent Events)
- **URL**: `http://localhost:8081/sse`
- **Tools**: `getTrainingTitle`, `readPdfPage`, `getPdfInfo` - access "ai-training-for-java-dev.pdf"

---

## 🚀 How to Use

### Step 1: Start the MCP Server
```bash
cd mcp-server
mvn spring-boot:run
```
Wait for: `Started McpServerApp in...` message.

### Step 2: Verify GitHub Copilot Chat

1. **Open GitHub Copilot Chat** in VS Code (Ctrl+Shift+I or Cmd+Shift+I)
2. **Check for MCP Tools**: Look for a tools icon or MCP section
3. **Ask Copilot to use the PDF tool**:

```
@workspace Can you read the AI training PDF and summarize the key concepts?
```

or

```
What are the core takeaways from the AI training document?
```

### Step 3: Copilot Will Automatically:
- Detect the MCP server at `http://localhost:8081/sse`
- Call the `readPdf()` tool
- Get the full PDF content
- Provide answers based on the document

---

## 🧪 Test Commands

### Example Questions for Copilot:

1. **Basic Query**:
   ```
   What topics are covered in the AI training PDF?
   ```

2. **Specific Information**:
   ```
   According to the AI training document, how should Java developers approach AI integration?
   ```

3. **Code Generation**:
   ```
   Based on the AI training PDF, create a sample Java AI integration
   ```

---

## 🔧 Troubleshooting

### Issue: Copilot doesn't see MCP tools

**Solution 1**: Reload VS Code
```bash
# Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows/Linux)
# Type: "Reload Window"
```

**Solution 2**: Check MCP server is running
```bash
curl -m 2 -N http://localhost:8081/sse
# Should establish SSE connection and show event stream
```

**Solution 3**: Enable Copilot MCP in User Settings
1. Open Settings (Cmd+,)
2. Search for "copilot mcp"
3. Ensure "GitHub Copilot Chat: MCP Enabled" is checked

### Issue: Server connection refused

**Verify server is running**:
```bash
lsof -i :8081
# Should show Java process
```

**Restart server**:
```bash
cd mcp-server
mvn spring-boot:run
```

---

## 📖 Understanding the Setup

### MCP Server Details
- **Framework**: Spring AI with Spring Boot
- **Protocol**: SSE (Server-Sent Events)
- **SSE Endpoint**: `/sse` (auto-configured by Spring AI)
- **Message Endpoint**: `/mcp/message` (configured in application.properties)
- **Tool Names**: `getTrainingTitle`, `readPdfPage`, `getPdfInfo`
- **Tool Descriptions**: Access and read pages from the AI training PDF for Java developers

### GitHub Copilot Integration
- Uses native MCP client support
- Automatically discovers tools from server
- Can invoke tools during chat sessions
- Results are incorporated into Copilot's context

---

## 🎓 Advanced Usage

### Combine with Workspace Context
```
@workspace Based on the AI training PDF and our codebase, suggest improvements to McpClientApp.java
```

### Multi-Step Queries
```
First read the AI training PDF, then create a new Spring Boot service that implements those concepts
```

---

<p align="center">
  <i>"AI is Good"</i><br>
  <b>© 2026 HERE AND NOW AI</b>
</p>
