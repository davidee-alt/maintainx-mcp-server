import { z } from 'zod';

// Meter Unit enum
export const MeterUnitSchema = z.enum([
  'HOURS',
  'MILES',
  'KILOMETERS',
  'CYCLES',
  'GALLONS',
  'LITERS',
  'OTHER'
]);
export type MeterUnit = z.infer<typeof MeterUnitSchema>;

// List Meters input schema
export const ListMetersSchema = z.object({
  assetId: z.number().optional().describe('Filter by associated asset ID'),
  cursor: z.string().optional().describe('Pagination cursor for next page'),
  limit: z.number().min(1).max(100).optional().describe('Number of results to return (1-100)'),
});
export type ListMetersInput = z.infer<typeof ListMetersSchema>;

// Get Meter input schema
export const GetMeterSchema = z.object({
  id: z.number().describe('The meter ID'),
});
export type GetMeterInput = z.infer<typeof GetMeterSchema>;

// Create Meter Reading input schema
export const CreateMeterReadingSchema = z.object({
  meterId: z.number().describe('The meter ID to record a reading for'),
  value: z.number().describe('The meter reading value'),
  readingDate: z.string().optional().describe('Date of the reading in ISO 8601 format (defaults to now)'),
  notes: z.string().optional().describe('Notes about the reading'),
});
export type CreateMeterReadingInput = z.infer<typeof CreateMeterReadingSchema>;

// List Meter Readings input schema
export const ListMeterReadingsSchema = z.object({
  meterId: z.number().describe('The meter ID to get readings for'),
  startDate: z.string().optional().describe('Filter readings after this date (ISO 8601)'),
  endDate: z.string().optional().describe('Filter readings before this date (ISO 8601)'),
  cursor: z.string().optional().describe('Pagination cursor for next page'),
  limit: z.number().min(1).max(100).optional().describe('Number of results to return (1-100)'),
});
export type ListMeterReadingsInput = z.infer<typeof ListMeterReadingsSchema>;
