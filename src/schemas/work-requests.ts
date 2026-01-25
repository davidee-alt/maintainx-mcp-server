import { z } from 'zod';

// Work Request Status enum
export const WorkRequestStatusSchema = z.enum(['PENDING', 'APPROVED', 'DECLINED', 'CONVERTED']);
export type WorkRequestStatus = z.infer<typeof WorkRequestStatusSchema>;

// Work Request Priority enum
export const WorkRequestPrioritySchema = z.enum(['NONE', 'LOW', 'MEDIUM', 'HIGH']);
export type WorkRequestPriority = z.infer<typeof WorkRequestPrioritySchema>;

// List Work Requests input schema
export const ListWorkRequestsSchema = z.object({
  status: WorkRequestStatusSchema.optional().describe('Filter by request status'),
  priority: WorkRequestPrioritySchema.optional().describe('Filter by priority level'),
  assetId: z.number().optional().describe('Filter by associated asset ID'),
  locationId: z.number().optional().describe('Filter by location ID'),
  requesterId: z.number().optional().describe('Filter by requester user ID'),
  cursor: z.string().optional().describe('Pagination cursor for next page'),
  limit: z.number().min(1).max(100).optional().describe('Number of results to return (1-100)'),
});
export type ListWorkRequestsInput = z.infer<typeof ListWorkRequestsSchema>;

// Get Work Request input schema
export const GetWorkRequestSchema = z.object({
  id: z.number().describe('The work request ID'),
});
export type GetWorkRequestInput = z.infer<typeof GetWorkRequestSchema>;

// Create Work Request input schema
export const CreateWorkRequestSchema = z.object({
  title: z.string().min(1).describe('Title of the work request'),
  description: z.string().optional().describe('Detailed description of the issue or request'),
  priority: WorkRequestPrioritySchema.optional().describe('Priority level'),
  assetId: z.number().optional().describe('ID of the associated asset'),
  locationId: z.number().optional().describe('ID of the location'),
});
export type CreateWorkRequestInput = z.infer<typeof CreateWorkRequestSchema>;

// Approve Work Request input schema
export const ApproveWorkRequestSchema = z.object({
  id: z.number().describe('The work request ID to approve'),
  convertToWorkOrder: z.boolean().optional().describe('Whether to convert to a work order'),
});
export type ApproveWorkRequestInput = z.infer<typeof ApproveWorkRequestSchema>;

// Decline Work Request input schema
export const DeclineWorkRequestSchema = z.object({
  id: z.number().describe('The work request ID to decline'),
  reason: z.string().optional().describe('Reason for declining'),
});
export type DeclineWorkRequestInput = z.infer<typeof DeclineWorkRequestSchema>;
