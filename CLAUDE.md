# CLAUDE.md - MaintainX MCP Server

This document provides a comprehensive guide for AI assistants working with the MaintainX MCP Server codebase.

## Project Overview

This is an MCP (Model Context Protocol) server that enables AI assistants like Claude to interact with the MaintainX CMMS (Computerized Maintenance Management System) API. It provides 34 tools across 11 functional domains for managing work orders, assets, maintenance operations, and more.

**Key Technologies:**
- TypeScript 5.0+ with strict mode
- Node.js 18.0+ (ES modules)
- Zod for runtime schema validation
- MCP SDK for server infrastructure

## Directory Structure

```
maintainx-mcp-server/
├── src/
│   ├── index.ts              # Entry point - MCP server initialization & tool registration
│   ├── api/
│   │   └── client.ts         # MaintainX API HTTP client (singleton)
│   ├── tools/                # Tool implementations (13 modules)
│   │   ├── work-orders.ts    # Work order CRUD operations
│   │   ├── assets.ts         # Asset management
│   │   ├── work-requests.ts  # Work request handling
│   │   ├── locations.ts      # Location management
│   │   ├── users.ts          # User queries
│   │   ├── parts.ts          # Parts/inventory management
│   │   ├── meters.ts         # Meter tracking
│   │   ├── teams.ts          # Team queries
│   │   ├── vendors.ts        # Vendor management
│   │   ├── purchase-orders.ts# Purchase order queries
│   │   └── procedures.ts     # Procedure templates
│   ├── schemas/              # Zod input validation schemas (13 modules)
│   │   └── [mirrors tools/]  # One schema file per tool module
│   └── utils/
│       ├── error-handler.ts  # Custom error classes & MCP error formatting
│       └── pagination.ts     # Cursor-based pagination utilities
├── dist/                     # Compiled output (generated)
├── package.json
├── tsconfig.json
└── .env.example
```

## Architecture

### Request Flow

```
Claude User Request
        ↓
[MCP Server (index.ts)]
        ↓
[Tool Handler with try/catch]
        ↓
[Schema Validation (zod)]
        ↓
[Tool Implementation (tools/*.ts)]
        ↓
[MaintainX API Client (singleton)]
        ↓
[HTTP Request to api.getmaintainx.com/v1]
        ↓
[Response Formatting]
        ↓
[Error Handling if needed]
        ↓
Claude Response (JSON)
```

### Key Architectural Patterns

1. **Separation of Concerns**: Schemas (validation) are separate from tools (business logic)
2. **Singleton API Client**: Single instance via `getClient()` factory function
3. **Centralized Error Handling**: All errors go through `handleToolError()`
4. **Cursor-based Pagination**: Consistent pagination across all list endpoints
5. **Type Safety**: Full TypeScript with Zod runtime validation

## Development Commands

```bash
# Install dependencies
npm install

# Run in development mode (with tsx hot reload)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run compiled version
npm start
```

## Coding Conventions

### File Naming
- Use kebab-case for file names: `work-orders.ts`, `error-handler.ts`
- Schema files mirror tool files: `tools/work-orders.ts` → `schemas/work-orders.ts`

### Import Style
- Use `.js` extension for local imports (required for ES modules)
- Group imports: external packages, then local modules

```typescript
// External
import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Local
import { getClient } from '../api/client.js';
import { formatPaginatedResponse } from '../utils/pagination.js';
```

### Schema Pattern

All schemas follow this structure:

```typescript
import { z } from 'zod';

// 1. Define enums first
export const StatusSchema = z.enum(['OPEN', 'CLOSED']);
export type Status = z.infer<typeof StatusSchema>;

// 2. Define input schemas with .describe() for MCP documentation
export const ListItemsSchema = z.object({
  status: StatusSchema.optional().describe('Filter by status'),
  cursor: z.string().optional().describe('Pagination cursor'),
  limit: z.number().min(1).max(100).optional().describe('Results per page (1-100)'),
});
export type ListItemsInput = z.infer<typeof ListItemsSchema>;

// 3. Export both schema and inferred type
export const GetItemSchema = z.object({
  id: z.number().describe('The item ID'),
});
export type GetItemInput = z.infer<typeof GetItemSchema>;
```

### Tool Implementation Pattern

All tools follow this structure:

```typescript
import { getClient } from '../api/client.js';
import { ListItemsInput, GetItemInput } from '../schemas/items.js';
import { formatPaginatedResponse } from '../utils/pagination.js';

// 1. Define response interfaces
interface Item {
  id: number;
  name: string;
  [key: string]: unknown;  // Allow additional fields
}

interface ListItemsResponse {
  items: Item[];
  cursor?: string;
}

// 2. Implement list function (returns paginated response)
export async function listItems(input: ListItemsInput): Promise<string> {
  const client = getClient();

  const response = await client.get<ListItemsResponse>('/items', {
    status: input.status,
    cursor: input.cursor,
    limit: input.limit,
  });

  return formatPaginatedResponse(response.items, response.cursor, 'items');
}

// 3. Implement get function (returns JSON string)
export async function getItem(input: GetItemInput): Promise<string> {
  const client = getClient();

  const response = await client.get<Item>(`/items/${input.id}`);

  return JSON.stringify(response, null, 2);
}
```

### Tool Registration Pattern (in index.ts)

```typescript
server.tool(
  'tool_name',           // Snake_case tool name
  'Description text',    // Human-readable description
  SchemaName.shape,      // Zod schema .shape property
  async (input) => {
    try {
      const result = await toolFunction(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);
```

## Error Handling

### Custom Error Classes (in `utils/error-handler.ts`)

| Class | HTTP Status | Use Case |
|-------|-------------|----------|
| `MaintainXApiError` | Any | Base class for API errors |
| `RateLimitError` | 429 | Rate limit exceeded |
| `AuthenticationError` | 401 | Invalid/missing API key |
| `ValidationError` | N/A | Input validation failures |

### Error Response Format

All errors are converted to MCP-compliant format:
```typescript
{
  content: [{ type: 'text', text: errorMessage }],
  isError: true
}
```

## API Client

The `MaintainXClient` class (`src/api/client.ts`) provides:

- **Methods**: `get()`, `post()`, `patch()`, `delete()`
- **Authentication**: Bearer token via `MAINTAINX_API_KEY` env var
- **Multi-org Support**: Optional `MAINTAINX_ORGANIZATION_ID` header
- **Error Handling**: Automatic parsing of 401, 429, and other HTTP errors

### Usage

```typescript
import { getClient } from '../api/client.js';

const client = getClient();  // Returns singleton instance

// GET with query params
const items = await client.get<Response>('/endpoint', { param: 'value' });

// POST with body
const created = await client.post<Response>('/endpoint', { field: 'value' });

// PATCH with body
const updated = await client.patch<Response>('/endpoint/123', { field: 'value' });

// DELETE
await client.delete('/endpoint/123');
```

## Pagination

All list endpoints use cursor-based pagination:

```typescript
import { formatPaginatedResponse } from '../utils/pagination.js';

// Format paginated response
return formatPaginatedResponse(
  items,           // Array of items
  cursor,          // Next page cursor (or undefined)
  'items'          // Key name for the array
);

// Output format:
// {
//   "items": [...],
//   "cursor": "abc123",
//   "hasMore": true
// }
```

**Pagination Parameters:**
- `cursor`: String token for fetching next page
- `limit`: Number between 1-100 (default varies by endpoint)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MAINTAINX_API_KEY` | Yes | API key from MaintainX Settings > Integrations |
| `MAINTAINX_ORGANIZATION_ID` | No | For multi-organization accounts |

## Adding New Tools

1. **Create schema** in `src/schemas/new-domain.ts`:
   - Define Zod schemas with `.describe()` for all fields
   - Export both schemas and inferred types

2. **Create tool implementation** in `src/tools/new-domain.ts`:
   - Import types from schema
   - Implement functions that return `Promise<string>`
   - Use `getClient()` for API calls
   - Use `formatPaginatedResponse()` for list endpoints

3. **Register tools** in `src/index.ts`:
   - Import schemas and tool functions
   - Add `server.tool()` calls in appropriate section
   - Follow existing pattern with try/catch and `handleToolError()`

## Available Tool Categories

| Category | Tools | Description |
|----------|-------|-------------|
| Work Orders | 5 | Create, read, update, complete work orders |
| Assets | 4 | Manage physical equipment |
| Work Requests | 5 | Handle maintenance requests with approval workflow |
| Locations | 4 | Organize physical locations (hierarchical) |
| Users | 2 | Query organization users |
| Parts | 5 | Inventory management with quantity adjustments |
| Meters | 4 | Track asset meters and readings |
| Teams | 2 | Query team information |
| Vendors | 3 | Manage vendor contacts |
| Purchase Orders | 2 | View procurement information |
| Procedures | 2 | Access maintenance procedure templates |

## Rate Limits

MaintainX API enforces:
- **100 requests per 60 seconds** per user
- **500 requests per 60 seconds** per organization

The server returns `RateLimitError` with `retryAfter` when limits are exceeded.

## Testing

**Current Status**: No test framework configured.

When adding tests, consider:
- Unit tests for schema validation
- Unit tests for tool implementations (mock API client)
- Integration tests against sandbox API (if available)

Recommended frameworks: Vitest or Jest with `@types/jest`.

## Common Enum Values

### Work Order Status
`OPEN` | `IN_PROGRESS` | `ON_HOLD` | `COMPLETE`

### Work Order Priority
`NONE` | `LOW` | `MEDIUM` | `HIGH`

### Work Order Category
`DAMAGE` | `ELECTRICAL` | `INSPECTION` | `METER_READING` | `PREVENTATIVE` | `PROJECT` | `SAFETY` | `UPGRADE` | `OTHER`

### Asset Status
`ONLINE` | `OFFLINE`

### Meter Unit
`HOURS` | `MILES` | `KILOMETERS` | `CYCLES` | `GALLONS` | `LITERS` | `OTHER`

### Purchase Order Status
`DRAFT` | `PENDING` | `APPROVED` | `ORDERED` | `PARTIALLY_RECEIVED` | `RECEIVED` | `CANCELLED`

## Build Output

TypeScript compiles to `dist/` with:
- ES2022 target
- NodeNext module system
- Declaration files (`.d.ts`)
- Source maps

The package is executable via `npx maintainx-mcp-server` (binary in `package.json`).
