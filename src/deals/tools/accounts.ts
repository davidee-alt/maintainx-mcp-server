import { getDealStore } from '../store/deal-store.js';
import type { CreateAccountInput, ListAccountsInput } from '../schemas/account.js';

export async function createAccount(input: CreateAccountInput): Promise<string> {
  const store = getDealStore();
  const account = await store.createAccount(input);
  return JSON.stringify(account, null, 2);
}

export async function listAccounts(input: ListAccountsInput): Promise<string> {
  const store = getDealStore();
  const accounts = await store.listAccounts(input);
  return JSON.stringify({ accounts, total: accounts.length }, null, 2);
}
