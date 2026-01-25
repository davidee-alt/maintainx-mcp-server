import { getClient } from '../api/client.js';
import {
  ListPartsInput,
  GetPartInput,
  CreatePartInput,
  UpdatePartInput,
  AdjustPartQuantityInput,
} from '../schemas/parts.js';
import { formatPaginatedResponse } from '../utils/pagination.js';

interface Part {
  id: number;
  name: string;
  partNumber?: string;
  description?: string;
  quantity?: number;
  minimumQuantity?: number;
  unitCost?: number;
  location?: { id: number; name: string };
  vendor?: { id: number; name: string };
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

interface ListPartsResponse {
  parts: Part[];
  cursor?: string;
}

export async function listParts(input: ListPartsInput): Promise<string> {
  const client = getClient();

  const response = await client.get<ListPartsResponse>('/parts', {
    search: input.search,
    locationId: input.locationId,
    lowStock: input.lowStock,
    cursor: input.cursor,
    limit: input.limit,
  });

  return formatPaginatedResponse(response.parts, response.cursor, 'parts');
}

export async function getPart(input: GetPartInput): Promise<string> {
  const client = getClient();

  const response = await client.get<Part>(`/parts/${input.id}`);

  return JSON.stringify(response, null, 2);
}

export async function createPart(input: CreatePartInput): Promise<string> {
  const client = getClient();

  const response = await client.post<Part>('/parts', {
    name: input.name,
    partNumber: input.partNumber,
    description: input.description,
    quantity: input.quantity,
    minimumQuantity: input.minimumQuantity,
    unitCost: input.unitCost,
    locationId: input.locationId,
    vendorId: input.vendorId,
  });

  return JSON.stringify(response, null, 2);
}

export async function updatePart(input: UpdatePartInput): Promise<string> {
  const client = getClient();
  const { id, ...updateData } = input;

  const patchData: Record<string, unknown> = {};

  if (updateData.name !== undefined) patchData.name = updateData.name;
  if (updateData.partNumber !== undefined) patchData.partNumber = updateData.partNumber;
  if (updateData.description !== undefined) patchData.description = updateData.description;
  if (updateData.quantity !== undefined) patchData.quantity = updateData.quantity;
  if (updateData.minimumQuantity !== undefined) patchData.minimumQuantity = updateData.minimumQuantity;
  if (updateData.unitCost !== undefined) patchData.unitCost = updateData.unitCost;
  if (updateData.locationId !== undefined) patchData.locationId = updateData.locationId;
  if (updateData.vendorId !== undefined) patchData.vendorId = updateData.vendorId;

  const response = await client.patch<Part>(`/parts/${id}`, patchData);

  return JSON.stringify(response, null, 2);
}

export async function adjustPartQuantity(input: AdjustPartQuantityInput): Promise<string> {
  const client = getClient();

  const response = await client.post<Part>(`/parts/${input.id}/adjustments`, {
    adjustment: input.adjustment,
    reason: input.reason,
  });

  return JSON.stringify(response, null, 2);
}
