import { z } from 'zod';

// List Procedure Templates input schema
export const ListProcedureTemplatesSchema = z.object({
  search: z.string().optional().describe('Search by template name'),
  cursor: z.string().optional().describe('Pagination cursor for next page'),
  limit: z.number().min(1).max(100).optional().describe('Number of results to return (1-100)'),
});
export type ListProcedureTemplatesInput = z.infer<typeof ListProcedureTemplatesSchema>;

// Get Procedure Template input schema
export const GetProcedureTemplateSchema = z.object({
  id: z.number().describe('The procedure template ID'),
});
export type GetProcedureTemplateInput = z.infer<typeof GetProcedureTemplateSchema>;
