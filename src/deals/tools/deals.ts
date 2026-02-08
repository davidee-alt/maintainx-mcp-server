import { getDealStore } from '../store/deal-store.js';
import type { CreateDealInput, UpdateDealInput, GetDealContextInput } from '../schemas/deal.js';

export async function createDeal(input: CreateDealInput): Promise<string> {
  const store = getDealStore();
  const deal = await store.createDeal(input);
  return JSON.stringify(deal, null, 2);
}

export async function updateDeal(input: UpdateDealInput): Promise<string> {
  const store = getDealStore();
  const { id, ...updates } = input;
  const deal = await store.updateDeal(id, updates);
  return JSON.stringify(deal, null, 2);
}

export async function getDealContext(input: GetDealContextInput): Promise<string> {
  const store = getDealStore();
  const context = await store.getDealContext(input.dealId);
  return JSON.stringify(context, null, 2);
}
