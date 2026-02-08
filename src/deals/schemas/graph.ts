import { z } from 'zod';

export const GenerateContextGraphSchema = z.object({
  dealId: z.string().describe('The deal ID to generate a context graph for'),
  includeRelatedDeals: z.boolean().optional().describe('Include other deals for the same account (default true)'),
});
export type GenerateContextGraphInput = z.infer<typeof GenerateContextGraphSchema>;

export const GenerateStakeholderMapSchema = z.object({
  dealId: z.string().describe('The deal ID to generate a stakeholder map for'),
});
export type GenerateStakeholderMapInput = z.infer<typeof GenerateStakeholderMapSchema>;

export const GenerateExpansionMapSchema = z.object({
  accountId: z.string().describe('The account ID to generate an expansion map for'),
});
export type GenerateExpansionMapInput = z.infer<typeof GenerateExpansionMapSchema>;

export const GenerateTimelineSchema = z.object({
  dealId: z.string().describe('The deal ID to generate a timeline for'),
});
export type GenerateTimelineInput = z.infer<typeof GenerateTimelineSchema>;
