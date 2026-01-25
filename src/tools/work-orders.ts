import { getClient } from '../api/client.js';
import {
  ListWorkOrdersInput,
  GetWorkOrderInput,
  CreateWorkOrderInput,
  UpdateWorkOrderInput,
  CompleteWorkOrderInput,
} from '../schemas/work-orders.js';
import { formatPaginatedResponse } from '../utils/pagination.js';

interface WorkOrder {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  completedAt?: string;
  asset?: { id: number; name: string };
  location?: { id: number; name: string };
  assignees?: Array<{ id: number; name: string }>;
  [key: string]: unknown;
}

interface ListWorkOrdersResponse {
  workOrders: WorkOrder[];
  cursor?: string;
}

export async function listWorkOrders(input: ListWorkOrdersInput): Promise<string> {
  const client = getClient();

  const response = await client.get<ListWorkOrdersResponse>('/workorders', {
    status: input.status,
    priority: input.priority,
    assigneeId: input.assigneeId,
    assetId: input.assetId,
    locationId: input.locationId,
    cursor: input.cursor,
    limit: input.limit,
  });

  return formatPaginatedResponse(response.workOrders, response.cursor, 'workOrders');
}

export async function getWorkOrder(input: GetWorkOrderInput): Promise<string> {
  const client = getClient();

  const response = await client.get<WorkOrder>(`/workorders/${input.id}`);

  return JSON.stringify(response, null, 2);
}

export async function createWorkOrder(input: CreateWorkOrderInput): Promise<string> {
  const client = getClient();

  const response = await client.post<WorkOrder>('/workorders', {
    title: input.title,
    description: input.description,
    priority: input.priority,
    status: input.status,
    categories: input.category ? [input.category] : undefined,
    assetId: input.assetId,
    locationId: input.locationId,
    assignees: input.assigneeIds?.map(id => ({ id })),
    dueDate: input.dueDate,
    estimatedDuration: input.estimatedDuration,
  });

  return JSON.stringify(response, null, 2);
}

export async function updateWorkOrder(input: UpdateWorkOrderInput): Promise<string> {
  const client = getClient();
  const { id, ...updateData } = input;

  const patchData: Record<string, unknown> = {};

  if (updateData.title !== undefined) patchData.title = updateData.title;
  if (updateData.description !== undefined) patchData.description = updateData.description;
  if (updateData.priority !== undefined) patchData.priority = updateData.priority;
  if (updateData.status !== undefined) patchData.status = updateData.status;
  if (updateData.category !== undefined) patchData.categories = [updateData.category];
  if (updateData.assetId !== undefined) patchData.assetId = updateData.assetId;
  if (updateData.locationId !== undefined) patchData.locationId = updateData.locationId;
  if (updateData.assigneeIds !== undefined) patchData.assignees = updateData.assigneeIds.map(id => ({ id }));
  if (updateData.dueDate !== undefined) patchData.dueDate = updateData.dueDate;
  if (updateData.estimatedDuration !== undefined) patchData.estimatedDuration = updateData.estimatedDuration;

  const response = await client.patch<WorkOrder>(`/workorders/${id}`, patchData);

  return JSON.stringify(response, null, 2);
}

export async function completeWorkOrder(input: CompleteWorkOrderInput): Promise<string> {
  const client = getClient();

  const response = await client.patch<WorkOrder>(`/workorders/${input.id}`, {
    status: 'COMPLETE',
    completedByUserId: input.completedByUserId,
    completionNotes: input.completionNotes,
  });

  return JSON.stringify(response, null, 2);
}
