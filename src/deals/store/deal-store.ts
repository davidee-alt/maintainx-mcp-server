import { randomUUID } from 'node:crypto';
import { loadStore, saveStore } from './file-persistence.js';
import type {
  Account,
  Deal,
  Site,
  Stakeholder,
  Activity,
  Milestone,
  DealContext,
  DealStoreData,
} from './types.js';

let instance: DealStore | undefined;

export function getDealStore(): DealStore {
  if (!instance) {
    instance = new DealStore();
  }
  return instance;
}

export class DealStore {
  private data: DealStoreData = {
    schemaVersion: 1,
    accounts: {},
    deals: {},
    sites: {},
    stakeholders: {},
    activities: {},
    milestones: {},
  };
  private loaded = false;

  async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      this.data = await loadStore();
      this.loaded = true;
    }
  }

  private async persist(): Promise<void> {
    await saveStore(this.data);
  }

  // --- Accounts ---

  async createAccount(input: {
    name: string;
    industry?: string;
    employeeCount?: number;
    annualRevenue?: string;
    tier?: string;
    crmId?: string;
    notes?: string;
  }): Promise<Account> {
    await this.ensureLoaded();
    const now = new Date().toISOString();
    const account: Account = {
      id: randomUUID(),
      name: input.name,
      industry: input.industry,
      employeeCount: input.employeeCount,
      annualRevenue: input.annualRevenue,
      tier: (input.tier as Account['tier']) || 'PROSPECT',
      crmId: input.crmId,
      notes: input.notes,
      organizationIds: [],
      createdAt: now,
      updatedAt: now,
    };
    this.data.accounts[account.id] = account;
    await this.persist();
    return account;
  }

  async listAccounts(filter?: { tier?: string; search?: string }): Promise<Account[]> {
    await this.ensureLoaded();
    let accounts = Object.values(this.data.accounts);
    if (filter?.tier) {
      accounts = accounts.filter(a => a.tier === filter.tier);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      accounts = accounts.filter(
        a => a.name.toLowerCase().includes(q) || a.industry?.toLowerCase().includes(q)
      );
    }
    return accounts;
  }

  async getAccount(id: string): Promise<Account | undefined> {
    await this.ensureLoaded();
    return this.data.accounts[id];
  }

  // --- Deals ---

  async createDeal(input: {
    accountId: string;
    name: string;
    stage?: string;
    expansionType: string;
    value?: number;
    probability?: number;
    ownerEmail?: string;
    expectedCloseDate?: string;
    parentDealId?: string;
    notes?: string;
  }): Promise<Deal> {
    await this.ensureLoaded();
    if (!this.data.accounts[input.accountId]) {
      throw new Error(`Account ${input.accountId} not found`);
    }
    const now = new Date().toISOString();
    const deal: Deal = {
      id: randomUUID(),
      accountId: input.accountId,
      name: input.name,
      stage: (input.stage as Deal['stage']) || 'PROSPECTING',
      expansionType: input.expansionType as Deal['expansionType'],
      value: input.value,
      probability: input.probability,
      ownerEmail: input.ownerEmail,
      expectedCloseDate: input.expectedCloseDate,
      parentDealId: input.parentDealId,
      notes: input.notes,
      createdAt: now,
      updatedAt: now,
    };
    this.data.deals[deal.id] = deal;
    await this.persist();
    return deal;
  }

  async updateDeal(
    id: string,
    updates: Partial<Omit<Deal, 'id' | 'accountId' | 'createdAt'>>
  ): Promise<Deal> {
    await this.ensureLoaded();
    const deal = this.data.deals[id];
    if (!deal) throw new Error(`Deal ${id} not found`);
    Object.assign(deal, updates, { updatedAt: new Date().toISOString() });
    await this.persist();
    return deal;
  }

  async getDeal(id: string): Promise<Deal | undefined> {
    await this.ensureLoaded();
    return this.data.deals[id];
  }

  async getDealsForAccount(accountId: string): Promise<Deal[]> {
    await this.ensureLoaded();
    return Object.values(this.data.deals).filter(d => d.accountId === accountId);
  }

  // --- Sites ---

  async addSite(input: {
    dealId: string;
    name: string;
    locationId?: number;
    organizationId?: string;
    address?: string;
    userCount?: number;
    targetUserCount?: number;
    status?: string;
    operationType?: string;
    division?: string;
  }): Promise<Site> {
    await this.ensureLoaded();
    if (!this.data.deals[input.dealId]) {
      throw new Error(`Deal ${input.dealId} not found`);
    }
    const now = new Date().toISOString();
    const site: Site = {
      id: randomUUID(),
      dealId: input.dealId,
      name: input.name,
      locationId: input.locationId,
      organizationId: input.organizationId,
      address: input.address,
      userCount: input.userCount || 0,
      targetUserCount: input.targetUserCount,
      status: (input.status as Site['status']) || 'PROSPECT',
      operationType: input.operationType,
      division: input.division,
      createdAt: now,
      updatedAt: now,
    };
    this.data.sites[site.id] = site;
    await this.persist();
    return site;
  }

  async getSitesForDeal(dealId: string): Promise<Site[]> {
    await this.ensureLoaded();
    return Object.values(this.data.sites).filter(s => s.dealId === dealId);
  }

  // --- Stakeholders ---

  async addStakeholder(input: {
    dealId: string;
    name: string;
    title?: string;
    department?: string;
    role: string;
    email?: string;
    phone?: string;
    linkedUserId?: number;
    influenceLevel?: string;
    engagementLevel?: string;
    sentiment?: string;
    reportsToId?: string;
    siteIds?: string[];
    notes?: string;
  }): Promise<Stakeholder> {
    await this.ensureLoaded();
    if (!this.data.deals[input.dealId]) {
      throw new Error(`Deal ${input.dealId} not found`);
    }
    const now = new Date().toISOString();
    const stakeholder: Stakeholder = {
      id: randomUUID(),
      dealId: input.dealId,
      name: input.name,
      title: input.title,
      department: input.department,
      role: input.role as Stakeholder['role'],
      email: input.email,
      phone: input.phone,
      linkedUserId: input.linkedUserId,
      influenceLevel: (input.influenceLevel as Stakeholder['influenceLevel']) || 'MEDIUM',
      engagementLevel: (input.engagementLevel as Stakeholder['engagementLevel']) || 'NONE',
      sentiment: (input.sentiment as Stakeholder['sentiment']) || 'NEUTRAL',
      reportsToId: input.reportsToId,
      siteIds: input.siteIds || [],
      notes: input.notes,
      createdAt: now,
      updatedAt: now,
    };
    this.data.stakeholders[stakeholder.id] = stakeholder;
    await this.persist();
    return stakeholder;
  }

  async getStakeholdersForDeal(dealId: string): Promise<Stakeholder[]> {
    await this.ensureLoaded();
    return Object.values(this.data.stakeholders).filter(s => s.dealId === dealId);
  }

  // --- Activities ---

  async logActivity(input: {
    dealId: string;
    type: string;
    title: string;
    description?: string;
    date?: string;
    stakeholderIds?: string[];
    siteIds?: string[];
    outcome?: string;
    nextSteps?: string;
  }): Promise<Activity> {
    await this.ensureLoaded();
    if (!this.data.deals[input.dealId]) {
      throw new Error(`Deal ${input.dealId} not found`);
    }
    const activity: Activity = {
      id: randomUUID(),
      dealId: input.dealId,
      type: input.type as Activity['type'],
      title: input.title,
      description: input.description,
      date: input.date || new Date().toISOString(),
      stakeholderIds: input.stakeholderIds || [],
      siteIds: input.siteIds || [],
      outcome: input.outcome,
      nextSteps: input.nextSteps,
      createdAt: new Date().toISOString(),
    };
    this.data.activities[activity.id] = activity;
    await this.persist();
    return activity;
  }

  async getActivitiesForDeal(dealId: string): Promise<Activity[]> {
    await this.ensureLoaded();
    return Object.values(this.data.activities)
      .filter(a => a.dealId === dealId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // --- Milestones ---

  async addMilestone(input: {
    dealId: string;
    type: string;
    name: string;
    targetDate?: string;
    completedDate?: string;
    notes?: string;
  }): Promise<Milestone> {
    await this.ensureLoaded();
    if (!this.data.deals[input.dealId]) {
      throw new Error(`Deal ${input.dealId} not found`);
    }
    const now = new Date().toISOString();
    const milestone: Milestone = {
      id: randomUUID(),
      dealId: input.dealId,
      type: input.type as Milestone['type'],
      name: input.name,
      targetDate: input.targetDate,
      completedDate: input.completedDate,
      notes: input.notes,
      createdAt: now,
      updatedAt: now,
    };
    this.data.milestones[milestone.id] = milestone;
    await this.persist();
    return milestone;
  }

  async getMilestonesForDeal(dealId: string): Promise<Milestone[]> {
    await this.ensureLoaded();
    return Object.values(this.data.milestones).filter(m => m.dealId === dealId);
  }

  // --- Full Context ---

  async getDealContext(dealId: string): Promise<DealContext> {
    await this.ensureLoaded();
    const deal = this.data.deals[dealId];
    if (!deal) throw new Error(`Deal ${dealId} not found`);
    const account = this.data.accounts[deal.accountId];
    if (!account) throw new Error(`Account ${deal.accountId} not found`);

    const relatedDeals = Object.values(this.data.deals).filter(
      d => d.accountId === deal.accountId && d.id !== dealId
    );

    return {
      account,
      deal,
      sites: await this.getSitesForDeal(dealId),
      stakeholders: await this.getStakeholdersForDeal(dealId),
      activities: await this.getActivitiesForDeal(dealId),
      milestones: await this.getMilestonesForDeal(dealId),
      relatedDeals,
    };
  }
}
