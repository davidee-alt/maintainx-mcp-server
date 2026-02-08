import { getDealStore } from '../store/deal-store.js';
import {
  buildContextGraph,
  buildStakeholderMap,
  buildExpansionMap,
  buildTimeline,
} from '../graph/graph-builder.js';
import { generateFlowchart, generateGantt } from '../graph/mermaid-generator.js';
import type {
  GenerateContextGraphInput,
  GenerateStakeholderMapInput,
  GenerateExpansionMapInput,
  GenerateTimelineInput,
} from '../schemas/graph.js';

export async function generateContextGraph(input: GenerateContextGraphInput): Promise<string> {
  const store = getDealStore();
  const context = await store.getDealContext(input.dealId);
  const includeRelated = input.includeRelatedDeals !== false;
  const relatedDeals = includeRelated ? context.relatedDeals : [];
  const graph = buildContextGraph(context, relatedDeals);
  const mermaid = generateFlowchart(graph);

  return JSON.stringify(
    {
      mermaid,
      summary: `Deal context graph for ${context.account.name} - ${context.deal.name} showing ${context.sites.length} sites, ${context.stakeholders.length} stakeholders, stage: ${context.deal.stage}`,
    },
    null,
    2
  );
}

export async function generateStakeholderMap(input: GenerateStakeholderMapInput): Promise<string> {
  const store = getDealStore();
  const context = await store.getDealContext(input.dealId);
  const graph = buildStakeholderMap(context.stakeholders, context.deal.name);
  const mermaid = generateFlowchart(graph);

  const roleCount: Record<string, number> = {};
  for (const sh of context.stakeholders) {
    roleCount[sh.role] = (roleCount[sh.role] || 0) + 1;
  }
  const roleSummary = Object.entries(roleCount)
    .map(([role, count]) => `${count} ${role}`)
    .join(', ');

  return JSON.stringify(
    {
      mermaid,
      summary: `Stakeholder map for ${context.deal.name}: ${context.stakeholders.length} contacts (${roleSummary})`,
    },
    null,
    2
  );
}

export async function generateExpansionMap(input: GenerateExpansionMapInput): Promise<string> {
  const store = getDealStore();
  const account = await store.getAccount(input.accountId);
  if (!account) throw new Error(`Account ${input.accountId} not found`);

  const deals = await store.getDealsForAccount(input.accountId);
  const allSites: Awaited<ReturnType<typeof store.getSitesForDeal>> = [];
  for (const deal of deals) {
    const sites = await store.getSitesForDeal(deal.id);
    allSites.push(...sites);
  }

  const graph = buildExpansionMap(account, deals, allSites);
  const mermaid = generateFlowchart(graph);

  const totalUsers = allSites.reduce((sum, s) => sum + s.userCount, 0);

  return JSON.stringify(
    {
      mermaid,
      summary: `Expansion map for ${account.name}: ${deals.length} deals, ${allSites.length} sites, ${totalUsers} total users`,
    },
    null,
    2
  );
}

export async function generateTimeline(input: GenerateTimelineInput): Promise<string> {
  const store = getDealStore();
  const context = await store.getDealContext(input.dealId);
  const sections = buildTimeline(context);

  if (sections.length === 0) {
    return JSON.stringify(
      {
        mermaid: `gantt\n  title ${context.deal.name} Timeline\n  dateFormat YYYY-MM-DD\n  section No Data\n    No activities or milestones recorded :2024-01-01, 1d`,
        summary: `Timeline for ${context.deal.name}: No activities or milestones recorded yet`,
      },
      null,
      2
    );
  }

  const mermaid = generateGantt(`${context.deal.name} Timeline`, sections);

  return JSON.stringify(
    {
      mermaid,
      summary: `Timeline for ${context.deal.name}: ${context.milestones.length} milestones, ${context.activities.length} activities`,
    },
    null,
    2
  );
}
