import { getDealStore } from '../store/deal-store.js';
import type { AddSiteInput } from '../schemas/site.js';

export async function addSite(input: AddSiteInput): Promise<string> {
  const store = getDealStore();
  const site = await store.addSite(input);
  return JSON.stringify(site, null, 2);
}
