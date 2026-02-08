import { z } from 'zod';

export const DealStageSchema = z.enum([
  'PROSPECTING',
  'DISCOVERY',
  'DEMO',
  'PILOT',
  'PROPOSAL',
  'NEGOTIATION',
  'CLOSED_WON',
  'CLOSED_LOST',
]);
export type DealStage = z.infer<typeof DealStageSchema>;

export const ExpansionTypeSchema = z.enum([
  'INITIAL_SITE',
  'SAME_OPS_EXPANSION',
  'SEPARATE_OPS_EXPANSION',
  'DIVISION_ROLLOUT',
  'ENTERPRISE_ROLLOUT',
]);
export type ExpansionType = z.infer<typeof ExpansionTypeSchema>;

export const CreateDealSchema = z.object({
  accountId: z.string().describe('Account ID this deal belongs to'),
  name: z.string().min(1).describe('Deal name/title'),
  stage: DealStageSchema.optional().describe('Current deal stage (defaults to PROSPECTING)'),
  expansionType: ExpansionTypeSchema.describe('Type of expansion this deal represents'),
  value: z.number().optional().describe('Deal value in dollars'),
  probability: z.number().min(0).max(100).optional().describe('Win probability percentage'),
  ownerEmail: z.string().email().optional().describe('Sales rep email'),
  expectedCloseDate: z.string().optional().describe('Expected close date (ISO 8601)'),
  parentDealId: z.string().optional().describe('Parent deal ID if this is an expansion'),
  notes: z.string().optional().describe('Deal notes'),
});
export type CreateDealInput = z.infer<typeof CreateDealSchema>;

export const UpdateDealSchema = z.object({
  id: z.string().describe('The deal ID to update'),
  stage: DealStageSchema.optional().describe('Updated deal stage'),
  value: z.number().optional().describe('Updated deal value'),
  probability: z.number().min(0).max(100).optional().describe('Updated win probability'),
  expectedCloseDate: z.string().optional().describe('Updated expected close date'),
  notes: z.string().optional().describe('Updated notes'),
});
export type UpdateDealInput = z.infer<typeof UpdateDealSchema>;

export const GetDealContextSchema = z.object({
  dealId: z.string().describe('The deal ID to get full context for'),
});
export type GetDealContextInput = z.infer<typeof GetDealContextSchema>;
