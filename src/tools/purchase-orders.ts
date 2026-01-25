import { getClient } from '../api/client.js';
import {
  ListPurchaseOrdersInput,
  GetPurchaseOrderInput,
} from '../schemas/purchase-orders.js';
import { formatPaginatedResponse } from '../utils/pagination.js';

interface PurchaseOrder {
  id: number;
  number?: string;
  status: string;
  vendor?: { id: number; name: string };
  totalAmount?: number;
  items?: Array<{
    id: number;
    part?: { id: number; name: string };
    quantity: number;
    unitPrice: number;
  }>;
  orderedDate?: string;
  expectedDeliveryDate?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

interface ListPurchaseOrdersResponse {
  purchaseOrders: PurchaseOrder[];
  cursor?: string;
}

export async function listPurchaseOrders(input: ListPurchaseOrdersInput): Promise<string> {
  const client = getClient();

  const response = await client.get<ListPurchaseOrdersResponse>('/purchaseorders', {
    status: input.status,
    vendorId: input.vendorId,
    cursor: input.cursor,
    limit: input.limit,
  });

  return formatPaginatedResponse(response.purchaseOrders, response.cursor, 'purchaseOrders');
}

export async function getPurchaseOrder(input: GetPurchaseOrderInput): Promise<string> {
  const client = getClient();

  const response = await client.get<PurchaseOrder>(`/purchaseorders/${input.id}`);

  return JSON.stringify(response, null, 2);
}
