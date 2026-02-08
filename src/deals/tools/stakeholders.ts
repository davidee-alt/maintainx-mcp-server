import { getDealStore } from '../store/deal-store.js';
import type { AddStakeholderInput } from '../schemas/stakeholder.js';

export async function addStakeholder(input: AddStakeholderInput): Promise<string> {
  const store = getDealStore();
  const stakeholder = await store.addStakeholder(input);
  return JSON.stringify(stakeholder, null, 2);
}
