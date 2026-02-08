import { z } from 'zod';

export const StakeholderRoleSchema = z.enum([
  'CHAMPION',
  'DECISION_MAKER',
  'ECONOMIC_BUYER',
  'TECHNICAL_BUYER',
  'INFLUENCER',
  'END_USER',
  'BLOCKER',
  'COACH',
]);
export type StakeholderRole = z.infer<typeof StakeholderRoleSchema>;

export const EngagementLevelSchema = z.enum(['NONE', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH']);
export type EngagementLevel = z.infer<typeof EngagementLevelSchema>;

export const SentimentSchema = z.enum([
  'VERY_NEGATIVE',
  'NEGATIVE',
  'NEUTRAL',
  'POSITIVE',
  'VERY_POSITIVE',
]);
export type Sentiment = z.infer<typeof SentimentSchema>;

export const AddStakeholderSchema = z.object({
  dealId: z.string().describe('Deal ID'),
  name: z.string().min(1).describe('Full name'),
  title: z.string().optional().describe('Job title'),
  department: z.string().optional().describe('Department'),
  role: StakeholderRoleSchema.describe('Role in the buying process'),
  email: z.string().email().optional().describe('Email address'),
  phone: z.string().optional().describe('Phone number'),
  linkedUserId: z.number().optional().describe('MaintainX user ID if they are a user'),
  influenceLevel: EngagementLevelSchema.optional().describe('Level of influence on the deal'),
  engagementLevel: EngagementLevelSchema.optional().describe('Current engagement level'),
  sentiment: SentimentSchema.optional().describe('Current sentiment toward MaintainX'),
  reportsToId: z.string().optional().describe('ID of stakeholder this person reports to'),
  siteIds: z.array(z.string()).optional().describe('Site IDs this stakeholder is associated with'),
  notes: z.string().optional().describe('Notes about this stakeholder'),
});
export type AddStakeholderInput = z.infer<typeof AddStakeholderSchema>;
