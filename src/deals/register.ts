import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleToolError } from '../utils/error-handler.js';

// Schemas
import { CreateAccountSchema, ListAccountsSchema } from './schemas/account.js';
import { CreateDealSchema, UpdateDealSchema, GetDealContextSchema } from './schemas/deal.js';
import { AddSiteSchema } from './schemas/site.js';
import { AddStakeholderSchema } from './schemas/stakeholder.js';
import { LogActivitySchema } from './schemas/activity.js';
import { AddMilestoneSchema } from './schemas/milestone.js';
import {
  GenerateContextGraphSchema,
  GenerateStakeholderMapSchema,
  GenerateExpansionMapSchema,
  GenerateTimelineSchema,
} from './schemas/graph.js';

// Tool handlers
import { createAccount, listAccounts } from './tools/accounts.js';
import { createDeal, updateDeal, getDealContext } from './tools/deals.js';
import { addSite } from './tools/sites.js';
import { addStakeholder } from './tools/stakeholders.js';
import { logActivity } from './tools/activities.js';
import { addMilestone } from './tools/milestones.js';
import {
  generateContextGraph,
  generateStakeholderMap,
  generateExpansionMap,
  generateTimeline,
} from './tools/graph-generator.js';

export function registerDealTools(server: McpServer): void {
  // ===== Deal Management CRUD Tools =====

  server.tool(
    'deal_create_account',
    'Create a new enterprise account to track in the deal context graph',
    CreateAccountSchema.shape,
    async (input) => {
      try {
        const result = await createAccount(input);
        return { content: [{ type: 'text' as const, text: result }] };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.tool(
    'deal_list_accounts',
    'List all tracked enterprise accounts with optional filters',
    ListAccountsSchema.shape,
    async (input) => {
      try {
        const result = await listAccounts(input);
        return { content: [{ type: 'text' as const, text: result }] };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.tool(
    'deal_create_deal',
    'Create a new deal/opportunity for an account with expansion type and stage tracking',
    CreateDealSchema.shape,
    async (input) => {
      try {
        const result = await createDeal(input);
        return { content: [{ type: 'text' as const, text: result }] };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.tool(
    'deal_update_deal',
    'Update a deal stage, value, probability, or other details',
    UpdateDealSchema.shape,
    async (input) => {
      try {
        const result = await updateDeal(input);
        return { content: [{ type: 'text' as const, text: result }] };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.tool(
    'deal_get_context',
    'Get the full context for a deal including account, sites, stakeholders, activities, and milestones',
    GetDealContextSchema.shape,
    async (input) => {
      try {
        const result = await getDealContext(input);
        return { content: [{ type: 'text' as const, text: result }] };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.tool(
    'deal_add_site',
    'Add a site to a deal with deployment status, user count, and operational type tracking',
    AddSiteSchema.shape,
    async (input) => {
      try {
        const result = await addSite(input);
        return { content: [{ type: 'text' as const, text: result }] };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.tool(
    'deal_add_stakeholder',
    'Add a stakeholder to a deal with role, influence, engagement, and sentiment tracking',
    AddStakeholderSchema.shape,
    async (input) => {
      try {
        const result = await addStakeholder(input);
        return { content: [{ type: 'text' as const, text: result }] };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.tool(
    'deal_log_activity',
    'Log a sales activity (demo, meeting, site visit, etc.) with stakeholders and outcomes',
    LogActivitySchema.shape,
    async (input) => {
      try {
        const result = await logActivity(input);
        return { content: [{ type: 'text' as const, text: result }] };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.tool(
    'deal_add_milestone',
    'Add a milestone to track deal progression (discovery complete, pilot started, contract signed, etc.)',
    AddMilestoneSchema.shape,
    async (input) => {
      try {
        const result = await addMilestone(input);
        return { content: [{ type: 'text' as const, text: result }] };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  // ===== Graph Visualization Tools =====

  server.tool(
    'deal_generate_context_graph',
    'Generate a Mermaid flowchart showing the full deal journey with stages, sites, and expansion paths',
    GenerateContextGraphSchema.shape,
    async (input) => {
      try {
        const result = await generateContextGraph(input);
        return { content: [{ type: 'text' as const, text: result }] };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.tool(
    'deal_generate_stakeholder_map',
    'Generate a Mermaid diagram of stakeholder relationships with role and sentiment color coding',
    GenerateStakeholderMapSchema.shape,
    async (input) => {
      try {
        const result = await generateStakeholderMap(input);
        return { content: [{ type: 'text' as const, text: result }] };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.tool(
    'deal_generate_expansion_map',
    'Generate a Mermaid diagram of site expansion patterns grouped by division',
    GenerateExpansionMapSchema.shape,
    async (input) => {
      try {
        const result = await generateExpansionMap(input);
        return { content: [{ type: 'text' as const, text: result }] };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.tool(
    'deal_generate_timeline',
    'Generate a Mermaid Gantt chart of deal activities and milestones',
    GenerateTimelineSchema.shape,
    async (input) => {
      try {
        const result = await generateTimeline(input);
        return { content: [{ type: 'text' as const, text: result }] };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );
}
