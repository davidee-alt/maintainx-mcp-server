import { z } from 'zod';

export const AccountTierSchema = z.enum(['PROSPECT', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE']);
export type AccountTier = z.infer<typeof AccountTierSchema>;

export const CreateAccountSchema = z.object({
  name: z.string().min(1).describe('Company name'),
  industry: z.string().optional().describe('Industry vertical (e.g., Manufacturing, Food & Bev)'),
  employeeCount: z.number().optional().describe('Total company employees'),
  annualRevenue: z.string().optional().describe('Annual revenue range'),
  tier: AccountTierSchema.optional().describe('Account tier classification'),
  crmId: z.string().optional().describe('External CRM ID (Salesforce, HubSpot, etc.)'),
  notes: z.string().optional().describe('General account notes'),
});
export type CreateAccountInput = z.infer<typeof CreateAccountSchema>;

export const ListAccountsSchema = z.object({
  tier: AccountTierSchema.optional().describe('Filter by account tier'),
  search: z.string().optional().describe('Search by name or industry'),
});
export type ListAccountsInput = z.infer<typeof ListAccountsSchema>;
