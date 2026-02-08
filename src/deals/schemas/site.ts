import { z } from 'zod';

export const SiteStatusSchema = z.enum([
  'PROSPECT',
  'QUALIFYING',
  'PILOTING',
  'ACTIVE',
  'EXPANDING',
  'CHURNED',
]);
export type SiteStatus = z.infer<typeof SiteStatusSchema>;

export const AddSiteSchema = z.object({
  dealId: z.string().describe('Deal ID this site belongs to'),
  name: z.string().min(1).describe('Site name'),
  locationId: z.number().optional().describe('MaintainX location ID if already exists'),
  organizationId: z.string().optional().describe('MaintainX organization ID'),
  address: z.string().optional().describe('Physical address'),
  userCount: z.number().optional().describe('Number of users at this site'),
  targetUserCount: z.number().optional().describe('Target user count for full deployment'),
  status: SiteStatusSchema.optional().describe('Site deployment status (defaults to PROSPECT)'),
  operationType: z.string().optional().describe('Type of operations (e.g., Manufacturing, Warehousing)'),
  division: z.string().optional().describe('Division/business unit name'),
});
export type AddSiteInput = z.infer<typeof AddSiteSchema>;
