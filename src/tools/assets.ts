import { getClient } from '../api/client.js';
import {
  ListAssetsInput,
  GetAssetInput,
  CreateAssetInput,
  UpdateAssetInput,
} from '../schemas/assets.js';
import { formatPaginatedResponse } from '../utils/pagination.js';

interface Asset {
  id: number;
  name: string;
  description?: string;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  status?: string;
  location?: { id: number; name: string };
  purchaseDate?: string;
  purchasePrice?: number;
  warrantyExpirationDate?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

interface ListAssetsResponse {
  assets: Asset[];
  cursor?: string;
}

export async function listAssets(input: ListAssetsInput): Promise<string> {
  const client = getClient();

  const response = await client.get<ListAssetsResponse>('/assets', {
    status: input.status,
    locationId: input.locationId,
    search: input.search,
    cursor: input.cursor,
    limit: input.limit,
  });

  return formatPaginatedResponse(response.assets, response.cursor, 'assets');
}

export async function getAsset(input: GetAssetInput): Promise<string> {
  const client = getClient();

  const response = await client.get<Asset>(`/assets/${input.id}`);

  return JSON.stringify(response, null, 2);
}

export async function createAsset(input: CreateAssetInput): Promise<string> {
  const client = getClient();

  const response = await client.post<Asset>('/assets', {
    name: input.name,
    description: input.description,
    serialNumber: input.serialNumber,
    model: input.model,
    manufacturer: input.manufacturer,
    locationId: input.locationId,
    status: input.status,
    purchaseDate: input.purchaseDate,
    purchasePrice: input.purchasePrice,
    warrantyExpirationDate: input.warrantyExpirationDate,
  });

  return JSON.stringify(response, null, 2);
}

export async function updateAsset(input: UpdateAssetInput): Promise<string> {
  const client = getClient();
  const { id, ...updateData } = input;

  const patchData: Record<string, unknown> = {};

  if (updateData.name !== undefined) patchData.name = updateData.name;
  if (updateData.description !== undefined) patchData.description = updateData.description;
  if (updateData.serialNumber !== undefined) patchData.serialNumber = updateData.serialNumber;
  if (updateData.model !== undefined) patchData.model = updateData.model;
  if (updateData.manufacturer !== undefined) patchData.manufacturer = updateData.manufacturer;
  if (updateData.locationId !== undefined) patchData.locationId = updateData.locationId;
  if (updateData.status !== undefined) patchData.status = updateData.status;
  if (updateData.purchaseDate !== undefined) patchData.purchaseDate = updateData.purchaseDate;
  if (updateData.purchasePrice !== undefined) patchData.purchasePrice = updateData.purchasePrice;
  if (updateData.warrantyExpirationDate !== undefined) patchData.warrantyExpirationDate = updateData.warrantyExpirationDate;

  const response = await client.patch<Asset>(`/assets/${id}`, patchData);

  return JSON.stringify(response, null, 2);
}
