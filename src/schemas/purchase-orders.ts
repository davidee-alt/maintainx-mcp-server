import { z } from 'zod';

// Purchase Order Status enum
export const PurchaseOrderStatusSchema = z.enum([
  'DRAFT',
  'PENDING',
  'APPROVED',
  'ORDERED',
  'PARTIALLY_RECEIVED',
  'RECEIVED',
  'CANCELLED'
]);
export type PurchaseOrderStatus = z.infer<typeof PurchaseOrderStatusSchema>;

// List Purchase Orders input schema
export const ListPurchaseOrdersSchema = z.object({
  status: PurchaseOrderStatusSchema.optional().describe('Filter by status'),
  vendorId: z.number().optional().describe('Filter by vendor ID'),
  cursor: z.string().optional().describe('Pagination cursor for next page'),
  limit: z.number().min(1).max(100).optional().describe('Number of results to return (1-100)'),
});
export type ListPurchaseOrdersInput = z.infer<typeof ListPurchaseOrdersSchema>;

// Get Purchase Order input schema
export const GetPurchaseOrderSchema = z.object({
  id: z.number().describe('The purchase order ID'),
});
export type GetPurchaseOrderInput = z.infer<typeof GetPurchaseOrderSchema>;
