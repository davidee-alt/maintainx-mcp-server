import { getClient } from '../api/client.js';
import {
  ListWorkRequestsInput,
  GetWorkRequestInput,
  CreateWorkRequestInput,
  ApproveWorkRequestInput,
  DeclineWorkRequestInput,
} from '../schemas/work-requests.js';
import { formatPaginatedResponse } from '../utils/pagination.js';

interface WorkRequest {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  asset?: { id: number; name: string };
  location?: { id: number; name: string };
  requester?: { id: number; name: string };
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

interface ListWorkRequestsResponse {
  workRequests: WorkRequest[];
  cursor?: string;
}

export async function listWorkRequests(input: ListWorkRequestsInput): Promise<string> {
  const client = getClient();

  const response = await client.get<ListWorkRequestsResponse>('/workrequests', {
    status: input.status,
    priority: input.priority,
    assetId: input.assetId,
    locationId: input.locationId,
    requesterId: input.requesterId,
    cursor: input.cursor,
    limit: input.limit,
  });

  return formatPaginatedResponse(response.workRequests, response.cursor, 'workRequests');
}

export async function getWorkRequest(input: GetWorkRequestInput): Promise<string> {
  const client = getClient();

  const response = await client.get<WorkRequest>(`/workrequests/${input.id}`);

  return JSON.stringify(response, null, 2);
}

export async function createWorkRequest(input: CreateWorkRequestInput): Promise<string> {
  const client = getClient();

  const response = await client.post<WorkRequest>('/workrequests', {
    title: input.title,
    description: input.description,
    priority: input.priority,
    assetId: input.assetId,
    locationId: input.locationId,
  });

  return JSON.stringify(response, null, 2);
}

export async function approveWorkRequest(input: ApproveWorkRequestInput): Promise<string> {
  const client = getClient();

  const response = await client.patch<WorkRequest>(`/workrequests/${input.id}`, {
    status: 'APPROVED',
    convertToWorkOrder: input.convertToWorkOrder,
  });

  return JSON.stringify(response, null, 2);
}

export async function declineWorkRequest(input: DeclineWorkRequestInput): Promise<string> {
  const client = getClient();

  const response = await client.patch<WorkRequest>(`/workrequests/${input.id}`, {
    status: 'DECLINED',
    declineReason: input.reason,
  });

  return JSON.stringify(response, null, 2);
}
