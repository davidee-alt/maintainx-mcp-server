import { z } from 'zod';

export const MilestoneTypeSchema = z.enum([
  'FIRST_MEETING',
  'DISCOVERY_COMPLETE',
  'DEMO_DELIVERED',
  'PILOT_STARTED',
  'PILOT_COMPLETED',
  'PROPOSAL_SENT',
  'VERBAL_COMMIT',
  'CONTRACT_SIGNED',
  'FIRST_SITE_LIVE',
  'EXPANSION_APPROVED',
  'ENTERPRISE_AGREEMENT',
]);
export type MilestoneType = z.infer<typeof MilestoneTypeSchema>;

export const AddMilestoneSchema = z.object({
  dealId: z.string().describe('Deal ID'),
  type: MilestoneTypeSchema.describe('Milestone type'),
  name: z.string().min(1).describe('Milestone name'),
  targetDate: z.string().optional().describe('Target completion date (ISO 8601)'),
  completedDate: z.string().optional().describe('Actual completion date (ISO 8601)'),
  notes: z.string().optional().describe('Milestone notes'),
});
export type AddMilestoneInput = z.infer<typeof AddMilestoneSchema>;
