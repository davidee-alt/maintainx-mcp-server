import { z } from 'zod';

// List Vendors input schema
export const ListVendorsSchema = z.object({
  search: z.string().optional().describe('Search by vendor name'),
  cursor: z.string().optional().describe('Pagination cursor for next page'),
  limit: z.number().min(1).max(100).optional().describe('Number of results to return (1-100)'),
});
export type ListVendorsInput = z.infer<typeof ListVendorsSchema>;

// Get Vendor input schema
export const GetVendorSchema = z.object({
  id: z.number().describe('The vendor ID'),
});
export type GetVendorInput = z.infer<typeof GetVendorSchema>;

// Create Vendor input schema
export const CreateVendorSchema = z.object({
  name: z.string().min(1).describe('Name of the vendor'),
  email: z.string().email().optional().describe('Contact email'),
  phone: z.string().optional().describe('Contact phone number'),
  address: z.string().optional().describe('Street address'),
  city: z.string().optional().describe('City'),
  state: z.string().optional().describe('State/Province'),
  zipCode: z.string().optional().describe('ZIP/Postal code'),
  country: z.string().optional().describe('Country'),
  website: z.string().url().optional().describe('Website URL'),
  notes: z.string().optional().describe('Additional notes'),
});
export type CreateVendorInput = z.infer<typeof CreateVendorSchema>;
