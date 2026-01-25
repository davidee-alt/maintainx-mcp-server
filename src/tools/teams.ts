import { getClient } from '../api/client.js';
import {
  ListTeamsInput,
  GetTeamInput,
} from '../schemas/teams.js';
import { formatPaginatedResponse } from '../utils/pagination.js';

interface Team {
  id: number;
  name: string;
  description?: string;
  members?: Array<{ id: number; name: string; email: string }>;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

interface ListTeamsResponse {
  teams: Team[];
  cursor?: string;
}

export async function listTeams(input: ListTeamsInput): Promise<string> {
  const client = getClient();

  const response = await client.get<ListTeamsResponse>('/teams', {
    search: input.search,
    cursor: input.cursor,
    limit: input.limit,
  });

  return formatPaginatedResponse(response.teams, response.cursor, 'teams');
}

export async function getTeam(input: GetTeamInput): Promise<string> {
  const client = getClient();

  const response = await client.get<Team>(`/teams/${input.id}`);

  return JSON.stringify(response, null, 2);
}
