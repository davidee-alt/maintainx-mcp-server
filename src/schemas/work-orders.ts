import { z } from 'zod';

// Work Order Priority enum
export const WorkOrderPrioritySchema = z.enum(['NONE', 'LOW', 'MEDIUM', 'HIGH']);
export type WorkOrderPriority = z.infer<typeof WorkOrderPrioritySchema>;

// Work Order Status enum
export const WorkOrderStatusSchema = z.enum(['OPEN', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETE']);
export type WorkOrderStatus = z.infer<typeof WorkOrderStatusSchema>;

// Work Order Category enum
export const WorkOrderCategorySchema = z.enum([
  'DAMAGE',
  'ELECTRICAL',
  'INSPECTION',
  'METER_READING',
  'PREVENTATIVE',
  'PROJECT',
  'SAFETY',
  'UPGRADE',
  'OTHER'
]);
export type WorkOrderCategory = z.infer<typeof WorkOrderCategorySchema>;

// List Work Orders input schema
export const ListWorkOrdersSchema = z.object({
  status: WorkOrderStatusSchema.optional().describe('Filter by work order status'),
  priority: WorkOrderPrioritySchema.optional().describe('Filter by priority level'),
  assigneeId: z.number().optional().describe('Filter by assigned user ID'),
  assetId: z.number().optional().describe('Filter by associated asset ID'),
  locationId: z.number().optional().describe('Filter by location ID'),
  cursor: z.string().optional().describe('Pagination cursor for next page'),
  limit: z.number().min(1).max(100).optional().describe('Number of results to return (1-100)'),
});
export type ListWorkOrdersInput = z.infer<typeof ListWorkOrdersSchema>;

// Get Work Order input schema
export const GetWorkOrderSchema = z.object({
  id: z.number().describe('The work order ID'),
});
export type GetWorkOrderInput = z.infer<typeof GetWorkOrderSchema>;

// Create Work Order input schema
export const CreateWorkOrderSchema = z.object({
  title: z.string().min(1).describe('Title of the work order'),
  description: z.string().optional().describe('Detailed description of the work to be done'),
  priority: WorkOrderPrioritySchema.optional().describe('Priority level'),
  status: WorkOrderStatusSchema.optional().describe('Initial status (defaults to OPEN)'),
  category: WorkOrderCategorySchema.optional().describe('Category of work'),
  assetId: z.number().optional().describe('ID of the associated asset'),
  locationId: z.number().optional().describe('ID of the location'),
  assigneeIds: z.array(z.number()).optional().describe('Array of user IDs to assign'),
  dueDate: z.string().optional().describe('Due date in ISO 8601 format'),
  estimatedDuration: z.number().optional().describe('Estimated duration in minutes'),
});
export type CreateWorkOrderInput = z.infer<typeof CreateWorkOrderSchema>;

// Update Work Order input schema
export const UpdateWorkOrderSchema = z.object({
  id: z.number().describe('The work order ID to update'),
  title: z.string().min(1).optional().describe('Updated title'),
  description: z.string().optional().describe('Updated description'),
  priority: WorkOrderPrioritySchema.optional().describe('Updated priority'),
  status: WorkOrderStatusSchema.optional().describe('Updated status'),
  category: WorkOrderCategorySchema.optional().describe('Updated category'),
  assetId: z.number().optional().describe('Updated asset ID'),
  locationId: z.number().optional().describe('Updated location ID'),
  assigneeIds: z.array(z.number()).optional().describe('Updated assignee IDs'),
  dueDate: z.string().optional().describe('Updated due date'),
  estimatedDuration: z.number().optional().describe('Updated estimated duration'),
});
export type UpdateWorkOrderInput = z.infer<typeof UpdateWorkOrderSchema>;

// Complete Work Order input schema
export const CompleteWorkOrderSchema = z.object({
  id: z.number().describe('The work order ID to complete'),
  completedByUserId: z.number().optional().describe('ID of the user completing the work order'),
  completionNotes: z.string().optional().describe('Notes about the completion'),
});
export type CompleteWorkOrderInput = z.infer<typeof CompleteWorkOrderSchema>;
