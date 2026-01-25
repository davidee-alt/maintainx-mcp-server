import { getClient } from '../api/client.js';
import {
  ListLocationsInput,
  GetLocationInput,
  CreateLocationInput,
  UpdateLocationInput,
} from '../schemas/locations.js';
import { formatPaginatedResponse } from '../utils/pagination.js';

interface Location {
  id: number;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  parent?: { id: number; name: string };
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

interface ListLocationsResponse {
  locations: Location[];
  cursor?: string;
}

export async function listLocations(input: ListLocationsInput): Promise<string> {
  const client = getClient();

  const response = await client.get<ListLocationsResponse>('/locations', {
    search: input.search,
    parentId: input.parentId,
    cursor: input.cursor,
    limit: input.limit,
  });

  return formatPaginatedResponse(response.locations, response.cursor, 'locations');
}

export async function getLocation(input: GetLocationInput): Promise<string> {
  const client = getClient();

  const response = await client.get<Location>(`/locations/${input.id}`);

  return JSON.stringify(response, null, 2);
}

export async function createLocation(input: CreateLocationInput): Promise<string> {
  const client = getClient();

  const response = await client.post<Location>('/locations', {
    name: input.name,
    address: input.address,
    city: input.city,
    state: input.state,
    zipCode: input.zipCode,
    country: input.country,
    parentId: input.parentId,
  });

  return JSON.stringify(response, null, 2);
}

export async function updateLocation(input: UpdateLocationInput): Promise<string> {
  const client = getClient();
  const { id, ...updateData } = input;

  const patchData: Record<string, unknown> = {};

  if (updateData.name !== undefined) patchData.name = updateData.name;
  if (updateData.address !== undefined) patchData.address = updateData.address;
  if (updateData.city !== undefined) patchData.city = updateData.city;
  if (updateData.state !== undefined) patchData.state = updateData.state;
  if (updateData.zipCode !== undefined) patchData.zipCode = updateData.zipCode;
  if (updateData.country !== undefined) patchData.country = updateData.country;
  if (updateData.parentId !== undefined) patchData.parentId = updateData.parentId;

  const response = await client.patch<Location>(`/locations/${id}`, patchData);

  return JSON.stringify(response, null, 2);
}
