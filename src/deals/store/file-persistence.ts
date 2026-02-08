import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { homedir } from 'node:os';
import type { DealStoreData } from './types.js';

const CURRENT_SCHEMA_VERSION = 1;

function getDefaultPath(): string {
  return process.env.DEAL_STORE_PATH || `${homedir()}/.maintainx-mcp/deals.json`;
}

function emptyData(): DealStoreData {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    accounts: {},
    deals: {},
    sites: {},
    stakeholders: {},
    activities: {},
    milestones: {},
  };
}

export async function loadStore(path?: string): Promise<DealStoreData> {
  const filePath = path || getDefaultPath();
  try {
    const raw = await readFile(filePath, 'utf-8');
    const data = JSON.parse(raw) as DealStoreData;
    if (!data.schemaVersion || data.schemaVersion < CURRENT_SCHEMA_VERSION) {
      return migrate(data);
    }
    return data;
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return emptyData();
    }
    throw err;
  }
}

export async function saveStore(data: DealStoreData, path?: string): Promise<void> {
  const filePath = path || getDefaultPath();
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function migrate(data: DealStoreData): DealStoreData {
  // Future migrations go here
  data.schemaVersion = CURRENT_SCHEMA_VERSION;
  return data;
}
