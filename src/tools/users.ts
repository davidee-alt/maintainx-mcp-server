import { getClient } from '../api/client.js';
import {
  ListUsersInput,
  GetUserInput,
} from '../schemas/users.js';
import { formatPaginatedResponse } from '../utils/pagination.js';

interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role?: string;
  teams?: Array<{ id: number; name: string }>;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

interface ListUsersResponse {
  users: User[];
  cursor?: string;
}

export async function listUsers(input: ListUsersInput): Promise<string> {
  const client = getClient();

  const response = await client.get<ListUsersResponse>('/users', {
    search: input.search,
    teamId: input.teamId,
    cursor: input.cursor,
    limit: input.limit,
  });

  return formatPaginatedResponse(response.users, response.cursor, 'users');
}

export async function getUser(input: GetUserInput): Promise<string> {
  const client = getClient();

  const response = await client.get<User>(`/users/${input.id}`);

  return JSON.stringify(response, null, 2);
}
