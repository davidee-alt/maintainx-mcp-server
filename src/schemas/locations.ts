import { z } from 'zod';

// List Locations input schema
export const ListLocationsSchema = z.object({
  search: z.string().optional().describe('Search by location name'),
  parentId: z.number().optional().describe('Filter by parent location ID'),
  cursor: z.string().optional().describe('Pagination cursor for next page'),
  limit: z.number().min(1).max(100).optional().describe('Number of results to return (1-100)'),
});
export type ListLocationsInput = z.infer<typeof ListLocationsSchema>;

// Get Location input schema
export const GetLocationSchema = z.object({
  id: z.number().describe('The location ID'),
});
export type GetLocationInput = z.infer<typeof GetLocationSchema>;

// Create Location input schema
export const CreateLocationSchema = z.object({
  name: z.string().min(1).describe('Name of the location'),
  address: z.string().optional().describe('Street address'),
  city: z.string().optional().describe('City'),
  state: z.string().optional().describe('State/Province'),
  zipCode: z.string().optional().describe('ZIP/Postal code'),
  country: z.string().optional().describe('Country'),
  parentId: z.number().optional().describe('Parent location ID for hierarchical organization'),
});
export type CreateLocationInput = z.infer<typeof CreateLocationSchema>;

// Update Location input schema
export const UpdateLocationSchema = z.object({
  id: z.number().describe('The location ID to update'),
  name: z.string().min(1).optional().describe('Updated name'),
  address: z.string().optional().describe('Updated address'),
  city: z.string().optional().describe('Updated city'),
  state: z.string().optional().describe('Updated state'),
  zipCode: z.string().optional().describe('Updated ZIP code'),
  country: z.string().optional().describe('Updated country'),
  parentId: z.number().optional().describe('Updated parent location ID'),
});
export type UpdateLocationInput = z.infer<typeof UpdateLocationSchema>;
