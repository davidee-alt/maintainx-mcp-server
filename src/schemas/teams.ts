import { z } from 'zod';

// List Teams input schema
export const ListTeamsSchema = z.object({
  search: z.string().optional().describe('Search by team name'),
  cursor: z.string().optional().describe('Pagination cursor for next page'),
  limit: z.number().min(1).max(100).optional().describe('Number of results to return (1-100)'),
});
export type ListTeamsInput = z.infer<typeof ListTeamsSchema>;

// Get Team input schema
export const GetTeamSchema = z.object({
  id: z.number().describe('The team ID'),
});
export type GetTeamInput = z.infer<typeof GetTeamSchema>;
