import type { Graph, GraphNode, GraphEdge, SubGraph } from './types.js';
import type { DealContext } from '../store/types.js';
import type { Account, Deal, Site, Stakeholder } from '../store/types.js';

const STAGE_ORDER = [
  'PROSPECTING',
  'DISCOVERY',
  'DEMO',
  'PILOT',
  'PROPOSAL',
  'NEGOTIATION',
  'CLOSED_WON',
  'CLOSED_LOST',
];

const SENTIMENT_COLORS: Record<string, string> = {
  VERY_POSITIVE: '#2d8a4e',
  POSITIVE: '#5cb85c',
  NEUTRAL: '#f0ad4e',
  NEGATIVE: '#d9534f',
  VERY_NEGATIVE: '#a02020',
};

const SITE_STATUS_COLORS: Record<string, string> = {
  PROSPECT: '#cccccc',
  QUALIFYING: '#5bc0de',
  PILOTING: '#f0ad4e',
  ACTIVE: '#5cb85c',
  EXPANDING: '#2d8a4e',
  CHURNED: '#d9534f',
};

const EXPANSION_LABELS: Record<string, string> = {
  INITIAL_SITE: 'Initial Site',
  SAME_OPS_EXPANSION: 'Same Ops Expansion',
  SEPARATE_OPS_EXPANSION: 'Separate Ops Expansion',
  DIVISION_ROLLOUT: 'Division Rollout',
  ENTERPRISE_ROLLOUT: 'Enterprise Rollout',
};

function stageLabel(stage: string): string {
  return stage.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function buildContextGraph(context: DealContext, relatedDeals: Deal[] = []): Graph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const subGraphs: SubGraph[] = [];

  // Account node
  nodes.push({
    id: `acct_${context.account.id.slice(0, 8)}`,
    label: `${context.account.name}\\n${context.account.tier} | ${context.account.industry || 'N/A'}`,
    type: 'account',
    metadata: { tier: context.account.tier },
    style: { shape: 'hexagon', fill: '#4a86c8' },
  });

  // Build deal nodes (primary + related)
  const allDeals = [context.deal, ...relatedDeals];
  for (const deal of allDeals) {
    const isPrimary = deal.id === context.deal.id;
    const valueStr = deal.value ? `$${(deal.value / 1000).toFixed(0)}k` : '';
    const label = [
      deal.name,
      `${stageLabel(deal.stage)}${valueStr ? ' | ' + valueStr : ''}`,
      EXPANSION_LABELS[deal.expansionType] || deal.expansionType,
    ].join('\\n');

    nodes.push({
      id: `deal_${deal.id.slice(0, 8)}`,
      label,
      type: 'deal',
      metadata: { stage: deal.stage, expansionType: deal.expansionType },
      style: {
        shape: 'rounded',
        fill: isPrimary ? '#4a86c8' : '#6c9fd4',
        stroke: isPrimary ? '#2a5a8c' : undefined,
      },
    });

    edges.push({
      sourceId: `acct_${context.account.id.slice(0, 8)}`,
      targetId: `deal_${deal.id.slice(0, 8)}`,
      label: EXPANSION_LABELS[deal.expansionType],
      style: isPrimary ? 'thick' : 'dashed',
    });

    // Parent deal edge
    if (deal.parentDealId) {
      edges.push({
        sourceId: `deal_${deal.parentDealId.slice(0, 8)}`,
        targetId: `deal_${deal.id.slice(0, 8)}`,
        label: 'expands to',
        style: 'dashed',
      });
    }
  }

  // Sites subgraph
  if (context.sites.length > 0) {
    const siteNodeIds: string[] = [];
    for (const site of context.sites) {
      const nodeId = `site_${site.id.slice(0, 8)}`;
      const userInfo = site.targetUserCount
        ? `${site.userCount}/${site.targetUserCount} users`
        : `${site.userCount} users`;
      nodes.push({
        id: nodeId,
        label: `${site.name}\\n${userInfo}\\n${site.status}`,
        type: 'site',
        metadata: { status: site.status },
        style: { shape: 'rectangle', fill: SITE_STATUS_COLORS[site.status] || '#cccccc' },
      });
      siteNodeIds.push(nodeId);

      edges.push({
        sourceId: `deal_${context.deal.id.slice(0, 8)}`,
        targetId: nodeId,
        style: 'solid',
      });
    }
    subGraphs.push({ id: 'sites', label: 'Sites', nodeIds: siteNodeIds });
  }

  // Stage progression nodes
  const stageNodeIds: string[] = [];
  const currentIdx = STAGE_ORDER.indexOf(context.deal.stage);
  for (let i = 0; i < STAGE_ORDER.length; i++) {
    const stage = STAGE_ORDER[i];
    if (stage === 'CLOSED_LOST' && context.deal.stage !== 'CLOSED_LOST') continue;
    const nodeId = `stage_${stage.toLowerCase()}`;
    nodes.push({
      id: nodeId,
      label: stageLabel(stage),
      type: 'stage',
      metadata: {},
      style: {
        shape: 'rounded',
        fill: i < currentIdx ? '#5cb85c' : i === currentIdx ? '#4a86c8' : '#e0e0e0',
      },
    });
    stageNodeIds.push(nodeId);

    if (i > 0 && stageNodeIds.length > 1) {
      edges.push({
        sourceId: stageNodeIds[stageNodeIds.length - 2],
        targetId: nodeId,
        style: i <= currentIdx ? 'solid' : 'dashed',
      });
    }
  }
  subGraphs.push({ id: 'pipeline', label: 'Deal Pipeline', nodeIds: stageNodeIds });

  return {
    title: `Deal Context: ${context.account.name} - ${context.deal.name}`,
    direction: 'LR',
    nodes,
    edges,
    subGraphs,
  };
}

export function buildStakeholderMap(stakeholders: Stakeholder[], dealName: string): Graph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const deptGroups: Record<string, string[]> = {};

  for (const sh of stakeholders) {
    const nodeId = `sh_${sh.id.slice(0, 8)}`;
    const roleShape: Record<string, GraphNode['style']> = {
      DECISION_MAKER: { shape: 'diamond', fill: SENTIMENT_COLORS[sh.sentiment] },
      ECONOMIC_BUYER: { shape: 'diamond', fill: SENTIMENT_COLORS[sh.sentiment] },
      CHAMPION: { shape: 'hexagon', fill: SENTIMENT_COLORS[sh.sentiment] },
      BLOCKER: { shape: 'hexagon', fill: '#d9534f' },
    };

    nodes.push({
      id: nodeId,
      label: `${sh.name}\\n${sh.title || sh.role}\\nEng: ${sh.engagementLevel}`,
      type: 'stakeholder',
      metadata: { role: sh.role, sentiment: sh.sentiment, engagement: sh.engagementLevel },
      style: roleShape[sh.role] || { shape: 'rounded', fill: SENTIMENT_COLORS[sh.sentiment] },
    });

    const dept = sh.department || 'Unknown';
    if (!deptGroups[dept]) deptGroups[dept] = [];
    deptGroups[dept].push(nodeId);

    if (sh.reportsToId) {
      edges.push({
        sourceId: `sh_${sh.reportsToId.slice(0, 8)}`,
        targetId: nodeId,
        label: 'manages',
        style: 'solid',
      });
    }
  }

  const subGraphs: SubGraph[] = Object.entries(deptGroups).map(([dept, ids]) => ({
    id: `dept_${dept.toLowerCase().replace(/\s+/g, '_')}`,
    label: dept,
    nodeIds: ids,
  }));

  return {
    title: `Stakeholder Map: ${dealName}`,
    direction: 'TD',
    nodes,
    edges,
    subGraphs,
  };
}

export function buildExpansionMap(
  account: Account,
  deals: Deal[],
  allSites: Site[]
): Graph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const divisionGroups: Record<string, string[]> = {};

  // Account root node
  const acctNodeId = `acct_${account.id.slice(0, 8)}`;
  nodes.push({
    id: acctNodeId,
    label: `${account.name}\\n${account.tier}`,
    type: 'account',
    metadata: {},
    style: { shape: 'hexagon', fill: '#4a86c8' },
  });

  for (const deal of deals) {
    const dealNodeId = `deal_${deal.id.slice(0, 8)}`;
    nodes.push({
      id: dealNodeId,
      label: `${deal.name}\\n${EXPANSION_LABELS[deal.expansionType]}\\n${stageLabel(deal.stage)}`,
      type: 'deal',
      metadata: { stage: deal.stage },
      style: {
        shape: 'rounded',
        fill: deal.stage === 'CLOSED_WON' ? '#5cb85c' : deal.stage === 'CLOSED_LOST' ? '#d9534f' : '#4a86c8',
      },
    });

    const parentId = deal.parentDealId
      ? `deal_${deal.parentDealId.slice(0, 8)}`
      : acctNodeId;
    edges.push({
      sourceId: parentId,
      targetId: dealNodeId,
      label: EXPANSION_LABELS[deal.expansionType],
      style: deal.stage === 'CLOSED_WON' ? 'thick' : 'dashed',
    });

    // Sites for this deal
    const dealSites = allSites.filter(s => s.dealId === deal.id);
    for (const site of dealSites) {
      const siteNodeId = `site_${site.id.slice(0, 8)}`;
      const userInfo = site.targetUserCount
        ? `${site.userCount}/${site.targetUserCount}`
        : `${site.userCount}`;
      nodes.push({
        id: siteNodeId,
        label: `${site.name}\\n${userInfo} users\\n${site.operationType || 'N/A'}`,
        type: 'site',
        metadata: { status: site.status },
        style: { shape: 'rectangle', fill: SITE_STATUS_COLORS[site.status] || '#cccccc' },
      });

      edges.push({ sourceId: dealNodeId, targetId: siteNodeId, style: 'solid' });

      const div = site.division || 'Unassigned';
      if (!divisionGroups[div]) divisionGroups[div] = [];
      divisionGroups[div].push(siteNodeId);
    }
  }

  const subGraphs: SubGraph[] = Object.entries(divisionGroups).map(([div, ids]) => ({
    id: `div_${div.toLowerCase().replace(/\s+/g, '_')}`,
    label: `Division: ${div}`,
    nodeIds: ids,
  }));

  return {
    title: `Expansion Map: ${account.name}`,
    direction: 'TD',
    nodes,
    edges,
    subGraphs,
  };
}

export interface TimelineSection {
  name: string;
  tasks: Array<{ name: string; start: string; end?: string; done?: boolean }>;
}

export function buildTimeline(context: DealContext): TimelineSection[] {
  const sections: TimelineSection[] = [];

  // Milestones section
  if (context.milestones.length > 0) {
    const sorted = [...context.milestones].sort((a, b) => {
      const dateA = a.completedDate || a.targetDate || a.createdAt;
      const dateB = b.completedDate || b.targetDate || b.createdAt;
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });
    sections.push({
      name: 'Milestones',
      tasks: sorted.map(m => ({
        name: m.name,
        start: (m.completedDate || m.targetDate || m.createdAt).slice(0, 10),
        end: m.completedDate ? m.completedDate.slice(0, 10) : undefined,
        done: !!m.completedDate,
      })),
    });
  }

  // Activities by type
  const byType: Record<string, typeof context.activities> = {};
  for (const activity of context.activities) {
    const key = activity.type.replace(/_/g, ' ');
    if (!byType[key]) byType[key] = [];
    byType[key].push(activity);
  }
  for (const [typeName, activities] of Object.entries(byType)) {
    const sorted = [...activities].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    sections.push({
      name: typeName,
      tasks: sorted.map(a => ({
        name: a.title,
        start: a.date.slice(0, 10),
        done: true,
      })),
    });
  }

  return sections;
}
