export class MaintainXApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'MaintainXApiError';
  }
}

export class RateLimitError extends MaintainXApiError {
  constructor(
    public retryAfter?: number
  ) {
    super(
      `Rate limit exceeded. ${retryAfter ? `Retry after ${retryAfter} seconds.` : 'Please wait before retrying.'}`,
      429
    );
    this.name = 'RateLimitError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends MaintainXApiError {
  constructor(message: string = 'Invalid or missing API key') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export function handleToolError(error: unknown): { content: Array<{ type: 'text'; text: string }>; isError: true } {
  let errorMessage: string;

  if (error instanceof RateLimitError) {
    errorMessage = `Rate limit exceeded. MaintainX API limits: 100 requests/60 seconds per user, 500 requests/60 seconds per organization. ${error.retryAfter ? `Retry after ${error.retryAfter} seconds.` : ''}`;
  } else if (error instanceof AuthenticationError) {
    errorMessage = `Authentication failed: ${error.message}. Please verify your MAINTAINX_API_KEY environment variable.`;
  } else if (error instanceof MaintainXApiError) {
    errorMessage = `MaintainX API error (${error.statusCode}): ${error.message}`;
  } else if (error instanceof ValidationError) {
    errorMessage = `Validation error${error.field ? ` for field '${error.field}'` : ''}: ${error.message}`;
  } else if (error instanceof Error) {
    errorMessage = `Error: ${error.message}`;
  } else {
    errorMessage = 'An unknown error occurred';
  }

  return {
    content: [{ type: 'text', text: errorMessage }],
    isError: true
  };
}
