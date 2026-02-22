import { z } from 'zod';

// Entity types that can be exported to the second brain
export const SecondBrainEntityTypeSchema = z.enum([
  'work_orders',
  'assets',
  'locations',
  'parts',
  'work_requests',
  'meters',
  'users',
  'teams',
  'vendors',
  'purchase_orders',
  'procedures',
]);
export type SecondBrainEntityType = z.infer<typeof SecondBrainEntityTypeSchema>;

// Export specific entity types to second brain
export const ExportToSecondBrainSchema = z.object({
  entityTypes: z.array(SecondBrainEntityTypeSchema)
    .min(1)
    .describe('Entity types to export (e.g., ["work_orders", "assets"]). Available: work_orders, assets, locations, parts, work_requests, meters, users, teams, vendors, purchase_orders, procedures'),
  limit: z.number().min(1).max(100).optional()
    .describe('Max items per entity type to export (1-100, default 100)'),
});
export type ExportToSecondBrainInput = z.infer<typeof ExportToSecondBrainSchema>;

// Export ALL data to second brain (one-click full sync)
export const ExportAllToSecondBrainSchema = z.object({
  limit: z.number().min(1).max(100).optional()
    .describe('Max items per entity type to export (1-100, default 100)'),
});
export type ExportAllToSecondBrainInput = z.infer<typeof ExportAllToSecondBrainSchema>;

// Check second brain sync status
export const SecondBrainStatusSchema = z.object({});
export type SecondBrainStatusInput = z.infer<typeof SecondBrainStatusSchema>;
