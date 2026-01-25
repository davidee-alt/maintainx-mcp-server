import { getClient } from '../api/client.js';
import {
  ListVendorsInput,
  GetVendorInput,
  CreateVendorInput,
} from '../schemas/vendors.js';
import { formatPaginatedResponse } from '../utils/pagination.js';

interface Vendor {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  website?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

interface ListVendorsResponse {
  vendors: Vendor[];
  cursor?: string;
}

export async function listVendors(input: ListVendorsInput): Promise<string> {
  const client = getClient();

  const response = await client.get<ListVendorsResponse>('/vendors', {
    search: input.search,
    cursor: input.cursor,
    limit: input.limit,
  });

  return formatPaginatedResponse(response.vendors, response.cursor, 'vendors');
}

export async function getVendor(input: GetVendorInput): Promise<string> {
  const client = getClient();

  const response = await client.get<Vendor>(`/vendors/${input.id}`);

  return JSON.stringify(response, null, 2);
}

export async function createVendor(input: CreateVendorInput): Promise<string> {
  const client = getClient();

  const response = await client.post<Vendor>('/vendors', {
    name: input.name,
    email: input.email,
    phone: input.phone,
    address: input.address,
    city: input.city,
    state: input.state,
    zipCode: input.zipCode,
    country: input.country,
    website: input.website,
    notes: input.notes,
  });

  return JSON.stringify(response, null, 2);
}
