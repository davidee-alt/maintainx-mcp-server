import { getClient } from '../api/client.js';
import {
  ListMetersInput,
  GetMeterInput,
  CreateMeterReadingInput,
  ListMeterReadingsInput,
} from '../schemas/meters.js';
import { formatPaginatedResponse } from '../utils/pagination.js';

interface Meter {
  id: number;
  name: string;
  unit: string;
  asset?: { id: number; name: string };
  currentReading?: number;
  lastReadingDate?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

interface MeterReading {
  id: number;
  meterId: number;
  value: number;
  readingDate: string;
  notes?: string;
  createdAt: string;
  [key: string]: unknown;
}

interface ListMetersResponse {
  meters: Meter[];
  cursor?: string;
}

interface ListMeterReadingsResponse {
  readings: MeterReading[];
  cursor?: string;
}

export async function listMeters(input: ListMetersInput): Promise<string> {
  const client = getClient();

  const response = await client.get<ListMetersResponse>('/meters', {
    assetId: input.assetId,
    cursor: input.cursor,
    limit: input.limit,
  });

  return formatPaginatedResponse(response.meters, response.cursor, 'meters');
}

export async function getMeter(input: GetMeterInput): Promise<string> {
  const client = getClient();

  const response = await client.get<Meter>(`/meters/${input.id}`);

  return JSON.stringify(response, null, 2);
}

export async function createMeterReading(input: CreateMeterReadingInput): Promise<string> {
  const client = getClient();

  const response = await client.post<MeterReading>(`/meters/${input.meterId}/readings`, {
    value: input.value,
    readingDate: input.readingDate,
    notes: input.notes,
  });

  return JSON.stringify(response, null, 2);
}

export async function listMeterReadings(input: ListMeterReadingsInput): Promise<string> {
  const client = getClient();

  const response = await client.get<ListMeterReadingsResponse>(`/meters/${input.meterId}/readings`, {
    startDate: input.startDate,
    endDate: input.endDate,
    cursor: input.cursor,
    limit: input.limit,
  });

  return formatPaginatedResponse(response.readings, response.cursor, 'readings');
}
