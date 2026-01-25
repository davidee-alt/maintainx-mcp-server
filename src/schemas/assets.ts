import { z } from 'zod';

// Asset Status enum
export const AssetStatusSchema = z.enum(['ONLINE', 'OFFLINE']);
export type AssetStatus = z.infer<typeof AssetStatusSchema>;

// List Assets input schema
export const ListAssetsSchema = z.object({
  status: AssetStatusSchema.optional().describe('Filter by asset status (ONLINE/OFFLINE)'),
  locationId: z.number().optional().describe('Filter by location ID'),
  search: z.string().optional().describe('Search by asset name'),
  cursor: z.string().optional().describe('Pagination cursor for next page'),
  limit: z.number().min(1).max(100).optional().describe('Number of results to return (1-100)'),
});
export type ListAssetsInput = z.infer<typeof ListAssetsSchema>;

// Get Asset input schema
export const GetAssetSchema = z.object({
  id: z.number().describe('The asset ID'),
});
export type GetAssetInput = z.infer<typeof GetAssetSchema>;

// Create Asset input schema
export const CreateAssetSchema = z.object({
  name: z.string().min(1).describe('Name of the asset'),
  description: z.string().optional().describe('Description of the asset'),
  serialNumber: z.string().optional().describe('Serial number'),
  model: z.string().optional().describe('Model name/number'),
  manufacturer: z.string().optional().describe('Manufacturer name'),
  locationId: z.number().optional().describe('ID of the location where asset is located'),
  status: AssetStatusSchema.optional().describe('Asset status (defaults to ONLINE)'),
  purchaseDate: z.string().optional().describe('Purchase date in ISO 8601 format'),
  purchasePrice: z.number().optional().describe('Purchase price'),
  warrantyExpirationDate: z.string().optional().describe('Warranty expiration date'),
});
export type CreateAssetInput = z.infer<typeof CreateAssetSchema>;

// Update Asset input schema
export const UpdateAssetSchema = z.object({
  id: z.number().describe('The asset ID to update'),
  name: z.string().min(1).optional().describe('Updated name'),
  description: z.string().optional().describe('Updated description'),
  serialNumber: z.string().optional().describe('Updated serial number'),
  model: z.string().optional().describe('Updated model'),
  manufacturer: z.string().optional().describe('Updated manufacturer'),
  locationId: z.number().optional().describe('Updated location ID'),
  status: AssetStatusSchema.optional().describe('Updated status'),
  purchaseDate: z.string().optional().describe('Updated purchase date'),
  purchasePrice: z.number().optional().describe('Updated purchase price'),
  warrantyExpirationDate: z.string().optional().describe('Updated warranty expiration'),
});
export type UpdateAssetInput = z.infer<typeof UpdateAssetSchema>;
