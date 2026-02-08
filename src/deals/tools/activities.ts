import { getDealStore } from '../store/deal-store.js';
import type { LogActivityInput } from '../schemas/activity.js';

export async function logActivity(input: LogActivityInput): Promise<string> {
  const store = getDealStore();
  const activity = await store.logActivity(input);
  return JSON.stringify(activity, null, 2);
}
