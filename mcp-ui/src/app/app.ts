import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from './services/chat.service';
import { McpService } from './services/mcp.service';
import { marked } from 'marked';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  public chatService = inject(ChatService);
  public mcpService = inject(McpService);

  userInput = '';

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Secret System Scan: Ctrl + Shift + F
    if (event.ctrlKey && event.shiftKey && event.key === 'F') {
      this.triggerSystemScan();
    }
  }

  private triggerSystemScan() {
    console.log('%c --- MCP SYSTEM SCAN ACTIVE --- ', 'background: #004040; color: #FFDF00; font-weight: bold; font-size: 14px;');
    console.log('Connectivity:', this.mcpService.isConnected() ? 'ONLINE' : 'OFFLINE');
    console.log('Protocol:', 'Model Context Protocol (SSE)');
    console.log('Brain:', 'Ollama (gpt-oss:20b)');
    console.log('Tools Discovered:', this.mcpService.tools().map(t => t.name).join(', '));
    console.log('%c Scanning PDF metadata... ', 'color: #FFDF00; font-style: italic;');
    
    if (this.mcpService.isConnected()) {
      this.mcpService.callTool('getPdfInfo', {}).then(res => {
        console.table(res.content);
      });
    }
  }

  renderMarkdown(text: string): string {
    return marked.parse(text || '') as string;
  }

  async sendMessage() {
    if (!this.userInput.trim()) return;
    const text = this.userInput;
    this.userInput = '';
    await this.chatService.sendMessage(text);
  }
}

