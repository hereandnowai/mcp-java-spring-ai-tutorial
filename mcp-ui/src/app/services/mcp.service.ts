import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

@Injectable({
  providedIn: 'root'
})
export class McpService {
  private platformId = inject(PLATFORM_ID);
  private client: Client | null = null;
  public isConnected = signal(false);
  public tools = signal<any[]>([]);

  constructor() {
    // Only connect in browser environment (not during SSR)
    if (isPlatformBrowser(this.platformId)) {
      this.connect();
    }
  }

  async connect() {
    try {
      const transport = new SSEClientTransport(new URL('http://localhost:8081/sse'));
      this.client = new Client(
        { name: 'mcp-ui-client', version: '1.0.0' },
        { capabilities: {} }
      );

      await this.client.connect(transport);
      this.isConnected.set(true);
      console.log('Connected to MCP Server');

      const response = await this.client.listTools();
      this.tools.set(response.tools);
      console.log('Available tools:', response.tools);
    } catch (error) {
      console.error('Failed to connect to MCP server:', error);
    }
  }

  async callTool(name: string, args: any) {
    if (!this.client) throw new Error('MCP Client not connected');
    return await this.client.callTool({ name, arguments: args });
  }
}
