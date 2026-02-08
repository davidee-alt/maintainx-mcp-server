import { z } from 'zod';

export const ActivityTypeSchema = z.enum([
  'DEMO',
  'MEETING',
  'EMAIL',
  'CALL',
  'SITE_VISIT',
  'PROPOSAL_SENT',
  'NEGOTIATION_SESSION',
  'PILOT_LAUNCH',
  'PILOT_REVIEW',
  'TRAINING',
  'EXECUTIVE_BRIEFING',
  'REFERENCE_CALL',
  'TECHNICAL_REVIEW',
  'CONTRACT_REVIEW',
]);
export type ActivityType = z.infer<typeof ActivityTypeSchema>;

export const LogActivitySchema = z.object({
  dealId: z.string().describe('Deal ID'),
  type: ActivityTypeSchema.describe('Type of activity'),
  title: z.string().min(1).describe('Activity title/summary'),
  description: z.string().optional().describe('Detailed description'),
  date: z.string().optional().describe('Activity date (ISO 8601, defaults to now)'),
  stakeholderIds: z.array(z.string()).optional().describe('Stakeholder IDs involved'),
  siteIds: z.array(z.string()).optional().describe('Site IDs involved'),
  outcome: z.string().optional().describe('Outcome/result of the activity'),
  nextSteps: z.string().optional().describe('Agreed next steps'),
});
export type LogActivityInput = z.infer<typeof LogActivitySchema>;
