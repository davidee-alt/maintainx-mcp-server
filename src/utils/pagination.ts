export interface PaginatedResponse<T> {
  data: T[];
  cursor?: string;
  hasMore?: boolean;
}

export interface PaginationParams {
  cursor?: string;
  limit?: number;
}

export function buildPaginationParams(params: PaginationParams): Record<string, string> {
  const result: Record<string, string> = {};

  if (params.cursor) {
    result.cursor = params.cursor;
  }

  if (params.limit) {
    result.limit = params.limit.toString();
  }

  return result;
}

export function formatPaginatedResponse<T>(
  items: T[],
  cursor?: string,
  resourceName: string = 'items'
): string {
  const response: { [key: string]: unknown } = {
    [resourceName]: items,
    count: items.length,
  };

  if (cursor) {
    response.nextCursor = cursor;
    response.hasMore = true;
  } else {
    response.hasMore = false;
  }

  return JSON.stringify(response, null, 2);
}
