# Claude (Cline) MCP Configuration Guide

## 🎯 Objective
Enable Claude via Cline extension to read PDF content from your MCP server.

---

## 🔧 Configuration Steps

### Method 1: Using Cline Extension Settings (Recommended)

1. **Open Cline Settings**:
   - Click on Cline icon in VS Code sidebar
   - Click the ⚙️ (Settings) icon
   - Navigate to "MCP Servers" section

2. **Add MCP Server**:
   ```json
   {
     "pdf-server": {
       "type": "sse",
       "url": "http://localhost:8081/sse",
       "name": "PDF Content Server",
       "description": "Access AI training PDF for Java developers"
     }
   }
   ```

3. **Save Settings**: Cline will automatically connect when the server is running.

---

### Method 2: Manual Configuration File

Create or edit Cline's MCP configuration file:

**Location**: `~/Library/Application Support/Code - Insiders/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

**Content**:
```json
{
  "mcpServers": {
    "pdf-server": {
      "type": "sse",
      "url": "http://localhost:8081/sse",
      "name": "PDF Content Server",
      "description": "Access AI training PDF content for Java developers",
      "autoConnect": true
    }
  }
}
```

---

## 🚀 How to Use

### Step 1: Start the MCP Server
```bash
cd mcp-server
mvn spring-boot:run
```
Wait for the server to start (look for "Started McpServerApp").

### Step 2: Connect Cline to MCP Server

1. **Open Cline** in VS Code sidebar
2. **Look for MCP indicator**: Should show "📡 Connected to pdf-server"
3. If not connected, click "Refresh MCP Servers"

### Step 3: Ask Claude Questions

In the Cline chat, you can now ask:

```
Can you read the AI training PDF and tell me what it covers?
```

or

```
Use the getTrainingTitle tool to get the title and overview, then use readPdfPage to read specific pages from the AI training document.
```

---

## 🧪 Example Queries

### 1. Basic Content Reading
```
Connect to the MCP server and read the AI training PDF. What are the main topics?
```

### 2. Specific Questions
```
According to the AI training document, what best practices are recommended for Java developers working with AI?
```

### 3. Code Generation
```
Read the AI training PDF and create a Java class that implements the concepts described in the document.
```

### 4. Analysis
```
Compare the recommendations in the AI training PDF with our current implementation in McpClientApp.java
```

---

## 🔍 Verify Connection

### Check MCP Server Status in Cline

1. Open Cline chat
2. Type: `/mcp status`
3. Should show:
   ```
   📡 MCP Servers:
   - pdf-server: ✅ Connected (http://localhost:8081/sse)
     Tools: getTrainingTitle, readPdfPage, getPdfInfo
   ```

### Test the Tool Directly

Ask Cline:
```
List all available MCP tools
```

Should respond with:
```
Available MCP Tools:
- getTrainingTitle: Get the title and overview of the AI training program for Java developers
- readPdfPage: Read a specific page (1-10) from the AI training PDF for Java developers  
- getPdfInfo: Get summary info about the AI training PDF (total pages, size)
```

---

## 🔧 Troubleshooting

### Issue: Cline doesn't connect to MCP server

**Solution 1**: Restart Cline
1. Close Cline panel
2. Press Cmd+Shift+P
3. Type "Cline: Restart"
4. Reopen Cline

**Solution 2**: Check server is running
```bash
curl -m 2 -N http://localhost:8081/sse
# Should establish SSE connection and show event stream
```

**Solution 3**: Manually refresh
1. Open Cline settings
2. Click "Refresh MCP Servers"
3. Wait 5 seconds
4. Check connection status

### Issue: Tool not found

**Verify tool is exposed**:
```bash
curl -X POST http://localhost:8081/mcp/message \
  -H "Content-Type: application/json" \
  -d '{"method": "tools/list", "params": {}}'
```

Should return:
```json
{
  "tools": [
    {
      "name": "getTrainingTitle",
      "description": "Get the title and overview of the AI training program for Java developers"
    },
    {
      "name": "readPdfPage",
      "description": "Read a specific page (1-10) from the AI training PDF for Java developers"
    },
    {
      "name": "getPdfInfo",
      "description": "Get summary info about the AI training PDF (total pages, size)"
    }
  ]
}
```

### Issue: Permission denied on config file

```bash
# Create directory if needed
mkdir -p ~/Library/Application\ Support/Code\ -\ Insiders/User/globalStorage/saoudrizwan.claude-dev/settings/

# Create config file
touch ~/Library/Application\ Support/Code\ -\ Insiders/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

---

## 📖 Understanding the Architecture

```
┌─────────────────┐
│  Claude (Cline) │
│   Chat UI       │
└────────┬────────┘
         │
         │ MCP Protocol (SSE)
         │
         ▼
┌────────────────────┐
│   MCP Server       │
│   (Spring Boot)    │
│   Port: 8081       │
└────────┬───────────┘
         │
         │ getTrainingTitle(), readPdfPage(), getPdfInfo() tools
         │
         ▼
┌────────────────────┐
│  PDF Document      │
│  ai-training-for-  │
│  java-dev.pdf      │
└────────────────────┘
```

---

## 🎓 Advanced Features

### Context Persistence
Claude remembers PDF content within the conversation:
```
First, read the PDF. Then, based on that content, help me refactor this code...
```

### Multi-Tool Workflows
```
1. Read the AI training PDF
2. Analyze our current codebase
3. Suggest improvements based on the PDF recommendations
4. Generate updated code
```

### Debugging with PDF Context
```
I'm getting an error in my AI integration. Can you read the AI training PDF and help me debug based on the best practices mentioned there?
```

---

## 🔐 Security Notes

- MCP server runs on `localhost:8081` (not exposed externally)
- SSE connection is unencrypted (fine for local development)
- For production: implement authentication and HTTPS

---

## 📚 Resources

- **Cline Documentation**: https://github.com/cline/cline
- **MCP Specification**: https://spec.modelcontextprotocol.io/
- **Spring AI MCP**: https://docs.spring.io/spring-ai/reference/api/mcp.html

---

<p align="center">
  <i>"AI is Good"</i><br>
  <b>© 2026 HERE AND NOW AI</b>
</p>
