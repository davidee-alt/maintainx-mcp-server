import {
  MaintainXApiError,
  RateLimitError,
  AuthenticationError,
} from '../utils/error-handler.js';

export interface MaintainXClientConfig {
  apiKey: string;
  organizationId?: string;
}

export class MaintainXClient {
  private apiKey: string;
  private organizationId?: string;
  private baseUrl = 'https://api.getmaintainx.com/v1';

  constructor(config: MaintainXClientConfig) {
    this.apiKey = config.apiKey;
    this.organizationId = config.organizationId;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Authorization': `bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    if (this.organizationId) {
      headers['x-organization-id'] = this.organizationId;
    }

    return headers;
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      throw new RateLimitError(retryAfter ? parseInt(retryAfter, 10) : undefined);
    }

    if (response.status === 401) {
      throw new AuthenticationError();
    }

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      let responseBody: unknown;

      try {
        responseBody = await response.json();
        if (typeof responseBody === 'object' && responseBody !== null && 'message' in responseBody) {
          errorMessage = (responseBody as { message: string }).message;
        }
      } catch {
        // Response body is not JSON
        try {
          errorMessage = await response.text();
        } catch {
          // Could not read response body
        }
      }

      throw new MaintainXApiError(errorMessage, response.status, responseBody);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    const url = this.buildUrl(endpoint, params);

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const url = this.buildUrl(endpoint);

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    const url = this.buildUrl(endpoint);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T = void>(endpoint: string): Promise<T> {
    const url = this.buildUrl(endpoint);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }
}

// Singleton instance
let clientInstance: MaintainXClient | null = null;

export function getClient(): MaintainXClient {
  if (!clientInstance) {
    const apiKey = process.env.MAINTAINX_API_KEY;

    if (!apiKey) {
      throw new AuthenticationError(
        'MAINTAINX_API_KEY environment variable is required'
      );
    }

    clientInstance = new MaintainXClient({
      apiKey,
      organizationId: process.env.MAINTAINX_ORGANIZATION_ID,
    });
  }

  return clientInstance;
}
