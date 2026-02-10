import { Injectable, inject, signal } from '@angular/core';
import { McpService } from './mcp.service';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  tool_calls?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private mcp = inject(McpService);
  public messages = signal<Message[]>([]);
  public isTyping = signal(false);

  private readonly OLLAMA_URL = 'http://localhost:11434/api/chat';
  private readonly MODEL = 'gpt-oss:20b';

  async sendMessage(text: string) {
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text };
    this.messages.update(msgs => [...msgs, userMsg]);
    this.isTyping.set(true);

    try {
      await this.chatLoop();
    } catch (error) {
      console.error('Chat error:', error);
      this.messages.update(msgs => [...msgs, { id: crypto.randomUUID(), role: 'assistant', content: 'Sorry, I encountered an error. Is Ollama running?' }]);
    } finally {
      this.isTyping.set(false);
    }
  }

  private async chatLoop(): Promise<void> {
    const currentMessages = [...this.messages()];
    
    // Remove IDs for Ollama API
    const ollamaMessages = currentMessages.map(({ id, ...rest }) => rest);
    
    // 1. Convert tools to Ollama format
    const tools = this.mcp.tools().map(t => ({
      type: 'function',
      function: {
        name: t.name,
        description: t.description,
        parameters: t.inputSchema
      }
    }));

    // 2. Initial prompt with STREAMING ENABLED
    const response = await fetch(this.OLLAMA_URL, {
      method: 'POST',
      body: JSON.stringify({
        model: this.MODEL,
        messages: ollamaMessages,
        stream: true, // ✅ STREAMING ENABLED
        tools: tools.length > 0 ? tools : undefined,
        options: {
          num_ctx: 8192,
          num_predict: 2048,
          temperature: 0.7,
          top_p: 0.9,
          top_k: 40
        }
      })
    });

    if (!response.body) throw new Error('No response body');
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let assistantMsg: Message = { 
      id: crypto.randomUUID(), 
      role: 'assistant', 
      content: '',
      tool_calls: []
    };
    
    // Add message placeholder
    this.messages.update(msgs => [...msgs, assistantMsg]);
    const msgIndex = this.messages().length - 1;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            
            if (data.message?.content) {
              assistantMsg.content += data.message.content;
              // Update UI in real-time
              this.messages.update(msgs => {
                const updated = [...msgs];
                updated[msgIndex] = { ...assistantMsg };
                return updated;
              });
            }

            if (data.message?.tool_calls) {
              assistantMsg.tool_calls = data.message.tool_calls;
            }

            if (data.done) break;
          } catch (e) {
            // Skip malformed JSON chunks
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    if (assistantMsg.tool_calls && assistantMsg.tool_calls.length > 0) {
      for (const call of assistantMsg.tool_calls) {
        const result = await this.mcp.callTool(call.function.name, call.function.arguments);
        
        // Extract text content from MCP result
        let toolContent = '';
        if (Array.isArray(result.content)) {
          toolContent = result.content
            .map((item: any) => item.text || JSON.stringify(item))
            .join('\n');
        } else {
          toolContent = JSON.stringify(result.content);
        }
        
        const toolResultMsg: Message = {
          id: crypto.randomUUID(),
          role: 'tool',
          content: toolContent
        };
        this.messages.update(msgs => [...msgs, toolResultMsg]);
      }

      // 3. Final call after tool results
      return this.chatLoop();
    }
  }
}
