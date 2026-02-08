import { getDealStore } from '../store/deal-store.js';
import type { AddMilestoneInput } from '../schemas/milestone.js';

export async function addMilestone(input: AddMilestoneInput): Promise<string> {
  const store = getDealStore();
  const milestone = await store.addMilestone(input);
  return JSON.stringify(milestone, null, 2);
}
