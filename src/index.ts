#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { handleToolError } from './utils/error-handler.js';

// Import schemas
import {
  ListWorkOrdersSchema,
  GetWorkOrderSchema,
  CreateWorkOrderSchema,
  UpdateWorkOrderSchema,
  CompleteWorkOrderSchema,
} from './schemas/work-orders.js';
import {
  ListAssetsSchema,
  GetAssetSchema,
  CreateAssetSchema,
  UpdateAssetSchema,
} from './schemas/assets.js';
import {
  ListWorkRequestsSchema,
  GetWorkRequestSchema,
  CreateWorkRequestSchema,
  ApproveWorkRequestSchema,
  DeclineWorkRequestSchema,
} from './schemas/work-requests.js';
import {
  ListLocationsSchema,
  GetLocationSchema,
  CreateLocationSchema,
  UpdateLocationSchema,
} from './schemas/locations.js';
import { ListUsersSchema, GetUserSchema } from './schemas/users.js';
import {
  ListPartsSchema,
  GetPartSchema,
  CreatePartSchema,
  UpdatePartSchema,
  AdjustPartQuantitySchema,
} from './schemas/parts.js';
import {
  ListMetersSchema,
  GetMeterSchema,
  CreateMeterReadingSchema,
  ListMeterReadingsSchema,
} from './schemas/meters.js';
import { ListTeamsSchema, GetTeamSchema } from './schemas/teams.js';
import { ListVendorsSchema, GetVendorSchema, CreateVendorSchema } from './schemas/vendors.js';
import { ListPurchaseOrdersSchema, GetPurchaseOrderSchema } from './schemas/purchase-orders.js';
import { ListProcedureTemplatesSchema, GetProcedureTemplateSchema } from './schemas/procedures.js';

// Import tool implementations
import {
  listWorkOrders,
  getWorkOrder,
  createWorkOrder,
  updateWorkOrder,
  completeWorkOrder,
} from './tools/work-orders.js';
import { listAssets, getAsset, createAsset, updateAsset } from './tools/assets.js';
import {
  listWorkRequests,
  getWorkRequest,
  createWorkRequest,
  approveWorkRequest,
  declineWorkRequest,
} from './tools/work-requests.js';
import { listLocations, getLocation, createLocation, updateLocation } from './tools/locations.js';
import { listUsers, getUser } from './tools/users.js';
import { listParts, getPart, createPart, updatePart, adjustPartQuantity } from './tools/parts.js';
import { listMeters, getMeter, createMeterReading, listMeterReadings } from './tools/meters.js';
import { listTeams, getTeam } from './tools/teams.js';
import { listVendors, getVendor, createVendor } from './tools/vendors.js';
import { listPurchaseOrders, getPurchaseOrder } from './tools/purchase-orders.js';
import { listProcedureTemplates, getProcedureTemplate } from './tools/procedures.js';

// Create MCP server
const server = new McpServer({
  name: 'maintainx',
  version: '1.0.0',
});

// ============================================================================
// Work Order Tools
// ============================================================================

server.tool(
  'list_work_orders',
  'List work orders with optional filters for status, priority, assignee, asset, or location',
  ListWorkOrdersSchema.shape,
  async (input) => {
    try {
      const result = await listWorkOrders(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'get_work_order',
  'Get detailed information about a specific work order by ID',
  GetWorkOrderSchema.shape,
  async (input) => {
    try {
      const result = await getWorkOrder(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'create_work_order',
  'Create a new work order for maintenance tasks',
  CreateWorkOrderSchema.shape,
  async (input) => {
    try {
      const result = await createWorkOrder(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'update_work_order',
  'Update an existing work order (title, description, priority, status, assignees, etc.)',
  UpdateWorkOrderSchema.shape,
  async (input) => {
    try {
      const result = await updateWorkOrder(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'complete_work_order',
  'Mark a work order as complete with optional completion notes',
  CompleteWorkOrderSchema.shape,
  async (input) => {
    try {
      const result = await completeWorkOrder(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

// ============================================================================
// Asset Tools
// ============================================================================

server.tool(
  'list_assets',
  'List assets with optional filters for status, location, or search by name',
  ListAssetsSchema.shape,
  async (input) => {
    try {
      const result = await listAssets(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'get_asset',
  'Get detailed information about a specific asset by ID',
  GetAssetSchema.shape,
  async (input) => {
    try {
      const result = await getAsset(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'create_asset',
  'Create a new asset in the system',
  CreateAssetSchema.shape,
  async (input) => {
    try {
      const result = await createAsset(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'update_asset',
  'Update an existing asset (name, description, status, location, etc.)',
  UpdateAssetSchema.shape,
  async (input) => {
    try {
      const result = await updateAsset(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

// ============================================================================
// Work Request Tools
// ============================================================================

server.tool(
  'list_work_requests',
  'List work requests with optional filters for status, priority, asset, location, or requester',
  ListWorkRequestsSchema.shape,
  async (input) => {
    try {
      const result = await listWorkRequests(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'get_work_request',
  'Get detailed information about a specific work request by ID',
  GetWorkRequestSchema.shape,
  async (input) => {
    try {
      const result = await getWorkRequest(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'create_work_request',
  'Submit a new work request for maintenance needs',
  CreateWorkRequestSchema.shape,
  async (input) => {
    try {
      const result = await createWorkRequest(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'approve_work_request',
  'Approve a work request, optionally converting it to a work order',
  ApproveWorkRequestSchema.shape,
  async (input) => {
    try {
      const result = await approveWorkRequest(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'decline_work_request',
  'Decline a work request with an optional reason',
  DeclineWorkRequestSchema.shape,
  async (input) => {
    try {
      const result = await declineWorkRequest(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

// ============================================================================
// Location Tools
// ============================================================================

server.tool(
  'list_locations',
  'List locations with optional search or parent location filter',
  ListLocationsSchema.shape,
  async (input) => {
    try {
      const result = await listLocations(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'get_location',
  'Get detailed information about a specific location by ID',
  GetLocationSchema.shape,
  async (input) => {
    try {
      const result = await getLocation(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'create_location',
  'Create a new location in the system',
  CreateLocationSchema.shape,
  async (input) => {
    try {
      const result = await createLocation(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'update_location',
  'Update an existing location',
  UpdateLocationSchema.shape,
  async (input) => {
    try {
      const result = await updateLocation(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

// ============================================================================
// User Tools
// ============================================================================

server.tool(
  'list_users',
  'List organization users with optional search or team filter',
  ListUsersSchema.shape,
  async (input) => {
    try {
      const result = await listUsers(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'get_user',
  'Get detailed information about a specific user by ID',
  GetUserSchema.shape,
  async (input) => {
    try {
      const result = await getUser(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

// ============================================================================
// Parts/Inventory Tools
// ============================================================================

server.tool(
  'list_parts',
  'List parts/inventory with optional search, location, or low stock filter',
  ListPartsSchema.shape,
  async (input) => {
    try {
      const result = await listParts(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'get_part',
  'Get detailed information about a specific part by ID',
  GetPartSchema.shape,
  async (input) => {
    try {
      const result = await getPart(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'create_part',
  'Create a new part in the inventory system',
  CreatePartSchema.shape,
  async (input) => {
    try {
      const result = await createPart(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'update_part',
  'Update an existing part in the inventory',
  UpdatePartSchema.shape,
  async (input) => {
    try {
      const result = await updatePart(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'adjust_part_quantity',
  'Adjust the quantity of a part (add or subtract inventory)',
  AdjustPartQuantitySchema.shape,
  async (input) => {
    try {
      const result = await adjustPartQuantity(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

// ============================================================================
// Meter Tools
// ============================================================================

server.tool(
  'list_meters',
  'List meters with optional asset filter',
  ListMetersSchema.shape,
  async (input) => {
    try {
      const result = await listMeters(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'get_meter',
  'Get detailed information about a specific meter by ID',
  GetMeterSchema.shape,
  async (input) => {
    try {
      const result = await getMeter(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'create_meter_reading',
  'Record a new meter reading for an asset',
  CreateMeterReadingSchema.shape,
  async (input) => {
    try {
      const result = await createMeterReading(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'list_meter_readings',
  'List meter readings for a specific meter with optional date range',
  ListMeterReadingsSchema.shape,
  async (input) => {
    try {
      const result = await listMeterReadings(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

// ============================================================================
// Team Tools
// ============================================================================

server.tool(
  'list_teams',
  'List teams with optional search filter',
  ListTeamsSchema.shape,
  async (input) => {
    try {
      const result = await listTeams(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'get_team',
  'Get detailed information about a specific team by ID',
  GetTeamSchema.shape,
  async (input) => {
    try {
      const result = await getTeam(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

// ============================================================================
// Vendor Tools
// ============================================================================

server.tool(
  'list_vendors',
  'List vendors with optional search filter',
  ListVendorsSchema.shape,
  async (input) => {
    try {
      const result = await listVendors(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'get_vendor',
  'Get detailed information about a specific vendor by ID',
  GetVendorSchema.shape,
  async (input) => {
    try {
      const result = await getVendor(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'create_vendor',
  'Create a new vendor in the system',
  CreateVendorSchema.shape,
  async (input) => {
    try {
      const result = await createVendor(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

// ============================================================================
// Purchase Order Tools
// ============================================================================

server.tool(
  'list_purchase_orders',
  'List purchase orders with optional status or vendor filter',
  ListPurchaseOrdersSchema.shape,
  async (input) => {
    try {
      const result = await listPurchaseOrders(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'get_purchase_order',
  'Get detailed information about a specific purchase order by ID',
  GetPurchaseOrderSchema.shape,
  async (input) => {
    try {
      const result = await getPurchaseOrder(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

// ============================================================================
// Procedure Template Tools
// ============================================================================

server.tool(
  'list_procedure_templates',
  'List procedure templates with optional search filter',
  ListProcedureTemplatesSchema.shape,
  async (input) => {
    try {
      const result = await listProcedureTemplates(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

server.tool(
  'get_procedure_template',
  'Get detailed information about a specific procedure template by ID',
  GetProcedureTemplateSchema.shape,
  async (input) => {
    try {
      const result = await getProcedureTemplate(input);
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return handleToolError(error);
    }
  }
);

// ============================================================================
// Start Server
// ============================================================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MaintainX MCP Server started');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
