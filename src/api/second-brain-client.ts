export interface SecondBrainClientConfig {
  apiUrl: string;
  apiKey?: string;
}

export interface SecondBrainEntry {
  source: 'maintainx';
  entityType: string;
  entityId: number | string;
  title: string;
  category: string;
  tags: string[];
  data: Record<string, unknown>;
  syncedAt: string;
}

export interface SecondBrainExportPayload {
  entries: SecondBrainEntry[];
  metadata: {
    source: 'maintainx';
    exportedAt: string;
    entityTypes: string[];
    totalEntries: number;
  };
}

export interface SecondBrainResponse {
  success: boolean;
  message?: string;
  entriesProcessed?: number;
  categories?: Record<string, number>;
}

export class SecondBrainClient {
  private apiUrl: string;
  private apiKey?: string;

  constructor(config: SecondBrainClientConfig) {
    this.apiUrl = config.apiUrl.replace(/\/+$/, '');
    this.apiKey = config.apiKey;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  async sendEntries(payload: SecondBrainExportPayload): Promise<SecondBrainResponse> {
    const response = await fetch(`${this.apiUrl}/entries`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = `Second Brain API error (${response.status})`;
      try {
        const body = await response.json();
        if (body && typeof body === 'object' && 'message' in body) {
          errorMessage = `${errorMessage}: ${(body as { message: string }).message}`;
        }
      } catch {
        // ignore parse errors
      }
      throw new Error(errorMessage);
    }

    return response.json() as Promise<SecondBrainResponse>;
  }

  async getStatus(): Promise<SecondBrainResponse> {
    const response = await fetch(`${this.apiUrl}/status`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Second Brain API error (${response.status})`);
    }

    return response.json() as Promise<SecondBrainResponse>;
  }
}

// Singleton instance
let secondBrainInstance: SecondBrainClient | null = null;

export function getSecondBrainClient(): SecondBrainClient {
  if (!secondBrainInstance) {
    const apiUrl = process.env.SECOND_BRAIN_API_URL;

    if (!apiUrl) {
      throw new Error(
        'SECOND_BRAIN_API_URL environment variable is required. Set it to your second brain API endpoint (e.g., a webhook URL, Notion API, or custom server).'
      );
    }

    secondBrainInstance = new SecondBrainClient({
      apiUrl,
      apiKey: process.env.SECOND_BRAIN_API_KEY,
    });
  }

  return secondBrainInstance;
}
