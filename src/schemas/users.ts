import { z } from 'zod';

// List Users input schema
export const ListUsersSchema = z.object({
  search: z.string().optional().describe('Search by user name or email'),
  teamId: z.number().optional().describe('Filter by team ID'),
  cursor: z.string().optional().describe('Pagination cursor for next page'),
  limit: z.number().min(1).max(100).optional().describe('Number of results to return (1-100)'),
});
export type ListUsersInput = z.infer<typeof ListUsersSchema>;

// Get User input schema
export const GetUserSchema = z.object({
  id: z.number().describe('The user ID'),
});
export type GetUserInput = z.infer<typeof GetUserSchema>;
