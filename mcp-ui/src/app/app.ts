import { Component, inject, signal } from '@angular/core';
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

