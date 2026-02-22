import { getClient } from '../api/client.js';
import {
  getSecondBrainClient,
  SecondBrainEntry,
  SecondBrainExportPayload,
} from '../api/second-brain-client.js';
import {
  ExportToSecondBrainInput,
  ExportAllToSecondBrainInput,
  SecondBrainEntityType,
} from '../schemas/second-brain.js';

// ============================================================================
// Data fetchers - pull data from MaintainX API
// ============================================================================

interface MaintainXRecord {
  id: number;
  [key: string]: unknown;
}

async function fetchWorkOrders(limit: number): Promise<MaintainXRecord[]> {
  const client = getClient();
  const response = await client.get<{ workOrders: MaintainXRecord[] }>('/workorders', { limit });
  return response.workOrders || [];
}

async function fetchAssets(limit: number): Promise<MaintainXRecord[]> {
  const client = getClient();
  const response = await client.get<{ assets: MaintainXRecord[] }>('/assets', { limit });
  return response.assets || [];
}

async function fetchLocations(limit: number): Promise<MaintainXRecord[]> {
  const client = getClient();
  const response = await client.get<{ locations: MaintainXRecord[] }>('/locations', { limit });
  return response.locations || [];
}

async function fetchParts(limit: number): Promise<MaintainXRecord[]> {
  const client = getClient();
  const response = await client.get<{ parts: MaintainXRecord[] }>('/parts', { limit });
  return response.parts || [];
}

async function fetchWorkRequests(limit: number): Promise<MaintainXRecord[]> {
  const client = getClient();
  const response = await client.get<{ workRequests: MaintainXRecord[] }>('/workrequests', { limit });
  return response.workRequests || [];
}

async function fetchMeters(limit: number): Promise<MaintainXRecord[]> {
  const client = getClient();
  const response = await client.get<{ meters: MaintainXRecord[] }>('/meters', { limit });
  return response.meters || [];
}

async function fetchUsers(limit: number): Promise<MaintainXRecord[]> {
  const client = getClient();
  const response = await client.get<{ users: MaintainXRecord[] }>('/users', { limit });
  return response.users || [];
}

async function fetchTeams(limit: number): Promise<MaintainXRecord[]> {
  const client = getClient();
  const response = await client.get<{ teams: MaintainXRecord[] }>('/teams', { limit });
  return response.teams || [];
}

async function fetchVendors(limit: number): Promise<MaintainXRecord[]> {
  const client = getClient();
  const response = await client.get<{ vendors: MaintainXRecord[] }>('/vendors', { limit });
  return response.vendors || [];
}

async function fetchPurchaseOrders(limit: number): Promise<MaintainXRecord[]> {
  const client = getClient();
  const response = await client.get<{ purchaseOrders: MaintainXRecord[] }>('/purchaseorders', { limit });
  return response.purchaseOrders || [];
}

async function fetchProcedures(limit: number): Promise<MaintainXRecord[]> {
  const client = getClient();
  const response = await client.get<{ procedureTemplates: MaintainXRecord[] }>('/proceduretemplates', { limit });
  return response.procedureTemplates || [];
}

// ============================================================================
// Categorization - auto-tag and categorize MaintainX data
// ============================================================================

function categorizeWorkOrder(record: MaintainXRecord): { category: string; tags: string[] } {
  const tags: string[] = ['maintenance'];
  const status = String(record.status || '').toLowerCase();
  const priority = String(record.priority || '').toLowerCase();
  const categories = record.categories as string[] | undefined;
  const category = String(record.category || categories?.[0] || 'general').toLowerCase();

  if (status) tags.push(`status:${status}`);
  if (priority && priority !== 'none') tags.push(`priority:${priority}`);
  if (category !== 'general') tags.push(category);

  // Smart categorization based on content
  const title = String(record.title || '').toLowerCase();
  if (title.includes('emergency') || priority === 'high') tags.push('urgent');
  if (title.includes('inspect') || category === 'inspection') tags.push('compliance');
  if (category === 'preventative') tags.push('scheduled');
  if (category === 'safety') tags.push('safety-critical');

  return {
    category: mapToSecondBrainCategory(category, 'work_order'),
    tags,
  };
}

function categorizeAsset(record: MaintainXRecord): { category: string; tags: string[] } {
  const tags: string[] = ['equipment'];
  const status = String(record.status || '').toLowerCase();

  if (status) tags.push(`status:${status}`);
  if (record.manufacturer) tags.push(`manufacturer:${String(record.manufacturer).toLowerCase()}`);
  if (record.warrantyExpirationDate) tags.push('has-warranty');
  if (status === 'offline') tags.push('needs-attention');

  return {
    category: 'Assets & Equipment',
    tags,
  };
}

function categorizeLocation(record: MaintainXRecord): { category: string; tags: string[] } {
  const tags: string[] = ['facility'];
  if (record.parentId) tags.push('sub-location');
  else tags.push('top-level');

  return {
    category: 'Facilities & Locations',
    tags,
  };
}

function categorizePart(record: MaintainXRecord): { category: string; tags: string[] } {
  const tags: string[] = ['inventory'];
  const quantity = Number(record.quantity || 0);
  const minimumQuantity = Number(record.minimumQuantity || 0);

  if (quantity <= minimumQuantity && minimumQuantity > 0) tags.push('low-stock');
  if (record.unitCost) tags.push('tracked-cost');

  return {
    category: 'Parts & Inventory',
    tags,
  };
}

function categorizeWorkRequest(record: MaintainXRecord): { category: string; tags: string[] } {
  const tags: string[] = ['request'];
  const status = String(record.status || '').toLowerCase();
  const priority = String(record.priority || '').toLowerCase();

  if (status) tags.push(`status:${status}`);
  if (priority && priority !== 'none') tags.push(`priority:${priority}`);
  if (status === 'pending') tags.push('needs-review');

  return {
    category: 'Work Requests',
    tags,
  };
}

function categorizeMeter(record: MaintainXRecord): { category: string; tags: string[] } {
  const tags: string[] = ['monitoring', 'meter'];
  if (record.units) tags.push(`unit:${String(record.units).toLowerCase()}`);

  return {
    category: 'Monitoring & Meters',
    tags,
  };
}

function categorizeUser(record: MaintainXRecord): { category: string; tags: string[] } {
  const tags: string[] = ['personnel'];
  if (record.role) tags.push(`role:${String(record.role).toLowerCase()}`);

  return {
    category: 'Team & Personnel',
    tags,
  };
}

function categorizeTeam(record: MaintainXRecord): { category: string; tags: string[] } {
  return {
    category: 'Team & Personnel',
    tags: ['team', 'organization'],
  };
}

function categorizeVendor(record: MaintainXRecord): { category: string; tags: string[] } {
  const tags: string[] = ['vendor', 'supplier'];
  if (record.phone || record.email) tags.push('has-contact-info');

  return {
    category: 'Vendors & Suppliers',
    tags,
  };
}

function categorizePurchaseOrder(record: MaintainXRecord): { category: string; tags: string[] } {
  const tags: string[] = ['procurement'];
  const status = String(record.status || '').toLowerCase();
  if (status) tags.push(`status:${status}`);
  if (status === 'draft' || status === 'pending') tags.push('needs-action');

  return {
    category: 'Procurement',
    tags,
  };
}

function categorizeProcedure(record: MaintainXRecord): { category: string; tags: string[] } {
  return {
    category: 'Procedures & SOPs',
    tags: ['procedure', 'documentation', 'sop'],
  };
}

function mapToSecondBrainCategory(rawCategory: string, entityType: string): string {
  const categoryMap: Record<string, string> = {
    damage: 'Repairs & Damage',
    electrical: 'Electrical Systems',
    inspection: 'Inspections & Compliance',
    meter_reading: 'Monitoring & Meters',
    preventative: 'Preventative Maintenance',
    project: 'Projects',
    safety: 'Safety',
    upgrade: 'Upgrades & Improvements',
  };

  if (entityType === 'work_order' && categoryMap[rawCategory]) {
    return categoryMap[rawCategory];
  }

  return 'General Maintenance';
}

// ============================================================================
// Entry builder - transform MaintainX records into second brain entries
// ============================================================================

function getRecordTitle(record: MaintainXRecord, entityType: SecondBrainEntityType): string {
  const title = record.title || record.name || record.displayName || record.firstName;
  if (title) return String(title);

  // Fallback
  return `${entityType} #${record.id}`;
}

type CategorizeFn = (record: MaintainXRecord) => { category: string; tags: string[] };

const categorizers: Record<SecondBrainEntityType, CategorizeFn> = {
  work_orders: categorizeWorkOrder,
  assets: categorizeAsset,
  locations: categorizeLocation,
  parts: categorizePart,
  work_requests: categorizeWorkRequest,
  meters: categorizeMeter,
  users: categorizeUser,
  teams: categorizeTeam,
  vendors: categorizeVendor,
  purchase_orders: categorizePurchaseOrder,
  procedures: categorizeProcedure,
};

function buildEntries(records: MaintainXRecord[], entityType: SecondBrainEntityType): SecondBrainEntry[] {
  const categorize = categorizers[entityType];

  return records.map((record) => {
    const { category, tags } = categorize(record);

    return {
      source: 'maintainx' as const,
      entityType,
      entityId: record.id,
      title: getRecordTitle(record, entityType),
      category,
      tags,
      data: record as Record<string, unknown>,
      syncedAt: new Date().toISOString(),
    };
  });
}

// ============================================================================
// Fetcher map
// ============================================================================

type FetchFn = (limit: number) => Promise<MaintainXRecord[]>;

const fetchers: Record<SecondBrainEntityType, FetchFn> = {
  work_orders: fetchWorkOrders,
  assets: fetchAssets,
  locations: fetchLocations,
  parts: fetchParts,
  work_requests: fetchWorkRequests,
  meters: fetchMeters,
  users: fetchUsers,
  teams: fetchTeams,
  vendors: fetchVendors,
  purchase_orders: fetchPurchaseOrders,
  procedures: fetchProcedures,
};

// ============================================================================
// Tool implementations
// ============================================================================

const ALL_ENTITY_TYPES: SecondBrainEntityType[] = [
  'work_orders',
  'assets',
  'locations',
  'parts',
  'work_requests',
  'meters',
  'users',
  'teams',
  'vendors',
  'purchase_orders',
  'procedures',
];

async function fetchAndBuildEntries(
  entityTypes: SecondBrainEntityType[],
  limit: number
): Promise<{ entries: SecondBrainEntry[]; summary: Record<string, number> }> {
  const allEntries: SecondBrainEntry[] = [];
  const summary: Record<string, number> = {};

  // Fetch all entity types in parallel
  const results = await Promise.allSettled(
    entityTypes.map(async (entityType) => {
      const fetcher = fetchers[entityType];
      const records = await fetcher(limit);
      const entries = buildEntries(records, entityType);
      return { entityType, entries };
    })
  );

  for (const result of results) {
    if (result.status === 'fulfilled') {
      allEntries.push(...result.value.entries);
      summary[result.value.entityType] = result.value.entries.length;
    } else {
      // Record the failure but continue with other types
      const reason = result.reason instanceof Error ? result.reason.message : String(result.reason);
      summary[`error`] = (summary['error'] || 0) + 1;
      console.error(`Failed to fetch entity type: ${reason}`);
    }
  }

  return { entries: allEntries, summary };
}

export async function exportToSecondBrain(input: ExportToSecondBrainInput): Promise<string> {
  const secondBrain = getSecondBrainClient();
  const limit = input.limit || 100;

  const { entries, summary } = await fetchAndBuildEntries(input.entityTypes, limit);

  if (entries.length === 0) {
    return JSON.stringify({
      success: true,
      message: 'No data found to export for the selected entity types.',
      summary,
    }, null, 2);
  }

  const payload: SecondBrainExportPayload = {
    entries,
    metadata: {
      source: 'maintainx',
      exportedAt: new Date().toISOString(),
      entityTypes: input.entityTypes,
      totalEntries: entries.length,
    },
  };

  const response = await secondBrain.sendEntries(payload);

  // Build a readable summary with category breakdown
  const categoryBreakdown: Record<string, number> = {};
  for (const entry of entries) {
    categoryBreakdown[entry.category] = (categoryBreakdown[entry.category] || 0) + 1;
  }

  return JSON.stringify({
    success: true,
    message: `Exported ${entries.length} entries to second brain.`,
    summary,
    categoryBreakdown,
    apiResponse: response,
  }, null, 2);
}

export async function exportAllToSecondBrain(input: ExportAllToSecondBrainInput): Promise<string> {
  const secondBrain = getSecondBrainClient();
  const limit = input.limit || 100;

  const { entries, summary } = await fetchAndBuildEntries(ALL_ENTITY_TYPES, limit);

  if (entries.length === 0) {
    return JSON.stringify({
      success: true,
      message: 'No data found in MaintainX to export.',
      summary,
    }, null, 2);
  }

  const payload: SecondBrainExportPayload = {
    entries,
    metadata: {
      source: 'maintainx',
      exportedAt: new Date().toISOString(),
      entityTypes: ALL_ENTITY_TYPES,
      totalEntries: entries.length,
    },
  };

  const response = await secondBrain.sendEntries(payload);

  // Build a readable summary with category breakdown
  const categoryBreakdown: Record<string, number> = {};
  for (const entry of entries) {
    categoryBreakdown[entry.category] = (categoryBreakdown[entry.category] || 0) + 1;
  }

  return JSON.stringify({
    success: true,
    message: `Full sync complete. Exported ${entries.length} entries across ${ALL_ENTITY_TYPES.length} entity types to second brain.`,
    summary,
    categoryBreakdown,
    apiResponse: response,
  }, null, 2);
}

export async function secondBrainStatus(): Promise<string> {
  const secondBrain = getSecondBrainClient();

  const response = await secondBrain.getStatus();

  return JSON.stringify({
    connected: true,
    apiUrl: process.env.SECOND_BRAIN_API_URL,
    ...response,
  }, null, 2);
}
