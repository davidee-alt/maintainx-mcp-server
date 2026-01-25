import { z } from 'zod';

// List Parts input schema
export const ListPartsSchema = z.object({
  search: z.string().optional().describe('Search by part name or number'),
  locationId: z.number().optional().describe('Filter by storage location ID'),
  lowStock: z.boolean().optional().describe('Filter for parts below minimum quantity'),
  cursor: z.string().optional().describe('Pagination cursor for next page'),
  limit: z.number().min(1).max(100).optional().describe('Number of results to return (1-100)'),
});
export type ListPartsInput = z.infer<typeof ListPartsSchema>;

// Get Part input schema
export const GetPartSchema = z.object({
  id: z.number().describe('The part ID'),
});
export type GetPartInput = z.infer<typeof GetPartSchema>;

// Create Part input schema
export const CreatePartSchema = z.object({
  name: z.string().min(1).describe('Name of the part'),
  partNumber: z.string().optional().describe('Part number/SKU'),
  description: z.string().optional().describe('Description of the part'),
  quantity: z.number().optional().describe('Current quantity in stock'),
  minimumQuantity: z.number().optional().describe('Minimum quantity threshold for low stock alerts'),
  unitCost: z.number().optional().describe('Cost per unit'),
  locationId: z.number().optional().describe('Storage location ID'),
  vendorId: z.number().optional().describe('Primary vendor ID'),
});
export type CreatePartInput = z.infer<typeof CreatePartSchema>;

// Update Part input schema
export const UpdatePartSchema = z.object({
  id: z.number().describe('The part ID to update'),
  name: z.string().min(1).optional().describe('Updated name'),
  partNumber: z.string().optional().describe('Updated part number'),
  description: z.string().optional().describe('Updated description'),
  quantity: z.number().optional().describe('Updated quantity'),
  minimumQuantity: z.number().optional().describe('Updated minimum quantity'),
  unitCost: z.number().optional().describe('Updated unit cost'),
  locationId: z.number().optional().describe('Updated storage location'),
  vendorId: z.number().optional().describe('Updated vendor ID'),
});
export type UpdatePartInput = z.infer<typeof UpdatePartSchema>;

// Adjust Part Quantity input schema
export const AdjustPartQuantitySchema = z.object({
  id: z.number().describe('The part ID'),
  adjustment: z.number().describe('Quantity adjustment (positive to add, negative to subtract)'),
  reason: z.string().optional().describe('Reason for the adjustment'),
});
export type AdjustPartQuantityInput = z.infer<typeof AdjustPartQuantitySchema>;
