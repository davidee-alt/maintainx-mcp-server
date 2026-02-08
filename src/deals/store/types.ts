// Deal Context Graph - Entity Types

export type DealStage =
  | 'PROSPECTING'
  | 'DISCOVERY'
  | 'DEMO'
  | 'PILOT'
  | 'PROPOSAL'
  | 'NEGOTIATION'
  | 'CLOSED_WON'
  | 'CLOSED_LOST';

export type ExpansionType =
  | 'INITIAL_SITE'
  | 'SAME_OPS_EXPANSION'
  | 'SEPARATE_OPS_EXPANSION'
  | 'DIVISION_ROLLOUT'
  | 'ENTERPRISE_ROLLOUT';

export type AccountTier = 'PROSPECT' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';

export type SiteStatus = 'PROSPECT' | 'QUALIFYING' | 'PILOTING' | 'ACTIVE' | 'EXPANDING' | 'CHURNED';

export type StakeholderRole =
  | 'CHAMPION'
  | 'DECISION_MAKER'
  | 'ECONOMIC_BUYER'
  | 'TECHNICAL_BUYER'
  | 'INFLUENCER'
  | 'END_USER'
  | 'BLOCKER'
  | 'COACH';

export type EngagementLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';

export type Sentiment = 'VERY_NEGATIVE' | 'NEGATIVE' | 'NEUTRAL' | 'POSITIVE' | 'VERY_POSITIVE';

export type ActivityType =
  | 'DEMO'
  | 'MEETING'
  | 'EMAIL'
  | 'CALL'
  | 'SITE_VISIT'
  | 'PROPOSAL_SENT'
  | 'NEGOTIATION_SESSION'
  | 'PILOT_LAUNCH'
  | 'PILOT_REVIEW'
  | 'TRAINING'
  | 'EXECUTIVE_BRIEFING'
  | 'REFERENCE_CALL'
  | 'TECHNICAL_REVIEW'
  | 'CONTRACT_REVIEW';

export type MilestoneType =
  | 'FIRST_MEETING'
  | 'DISCOVERY_COMPLETE'
  | 'DEMO_DELIVERED'
  | 'PILOT_STARTED'
  | 'PILOT_COMPLETED'
  | 'PROPOSAL_SENT'
  | 'VERBAL_COMMIT'
  | 'CONTRACT_SIGNED'
  | 'FIRST_SITE_LIVE'
  | 'EXPANSION_APPROVED'
  | 'ENTERPRISE_AGREEMENT';

export interface Account {
  id: string;
  name: string;
  industry?: string;
  employeeCount?: number;
  annualRevenue?: string;
  tier: AccountTier;
  crmId?: string;
  notes?: string;
  organizationIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  accountId: string;
  name: string;
  stage: DealStage;
  expansionType: ExpansionType;
  value?: number;
  probability?: number;
  ownerEmail?: string;
  expectedCloseDate?: string;
  parentDealId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Site {
  id: string;
  dealId: string;
  name: string;
  locationId?: number;
  organizationId?: string;
  address?: string;
  userCount: number;
  targetUserCount?: number;
  status: SiteStatus;
  operationType?: string;
  division?: string;
  goLiveDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Stakeholder {
  id: string;
  dealId: string;
  name: string;
  title?: string;
  department?: string;
  role: StakeholderRole;
  email?: string;
  phone?: string;
  linkedUserId?: number;
  influenceLevel: EngagementLevel;
  engagementLevel: EngagementLevel;
  sentiment: Sentiment;
  reportsToId?: string;
  siteIds: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  dealId: string;
  type: ActivityType;
  title: string;
  description?: string;
  date: string;
  stakeholderIds: string[];
  siteIds: string[];
  outcome?: string;
  nextSteps?: string;
  createdAt: string;
}

export interface Milestone {
  id: string;
  dealId: string;
  type: MilestoneType;
  name: string;
  targetDate?: string;
  completedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DealContext {
  account: Account;
  deal: Deal;
  sites: Site[];
  stakeholders: Stakeholder[];
  activities: Activity[];
  milestones: Milestone[];
  relatedDeals: Deal[];
}

export interface DealStoreData {
  schemaVersion: number;
  accounts: Record<string, Account>;
  deals: Record<string, Deal>;
  sites: Record<string, Site>;
  stakeholders: Record<string, Stakeholder>;
  activities: Record<string, Activity>;
  milestones: Record<string, Milestone>;
}
