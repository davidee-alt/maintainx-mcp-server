# MaintainX MCP Server

An MCP (Model Context Protocol) server for the [MaintainX](https://www.getmaintainx.com/) CMMS API. This server enables AI assistants like Claude to interact with MaintainX for managing work orders, assets, maintenance operations, and more.

## Features

- **Work Orders**: Create, update, complete, and list work orders
- **Assets**: Manage physical assets and equipment
- **Work Requests**: Handle incoming maintenance requests
- **Locations**: Organize assets by physical locations
- **Parts & Inventory**: Track parts and inventory levels
- **Users & Teams**: Access organization members and teams
- **Meters**: Record and track meter readings
- **Vendors**: Manage vendor relationships
- **Purchase Orders**: View procurement information
- **Procedure Templates**: Access standardized maintenance procedures

## Installation

### Using npx (Recommended)

```bash
npx maintainx-mcp-server
```

### Manual Installation

```bash
npm install -g maintainx-mcp-server
```

## Configuration

### Environment Variables

Set your MaintainX API key as an environment variable:

```bash
export MAINTAINX_API_KEY=your_api_key_here
```

For multi-organization accounts, optionally set:

```bash
export MAINTAINX_ORGANIZATION_ID=your_org_id
```

### Getting Your API Key

1. Log in to your MaintainX account
2. Go to **Settings** > **Integrations** > **API Keys**
3. Generate a new API key

### Claude Desktop Configuration

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "maintainx": {
      "command": "npx",
      "args": ["-y", "maintainx-mcp-server"],
      "env": {
        "MAINTAINX_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Available Tools

### Work Orders
| Tool | Description |
|------|-------------|
| `list_work_orders` | List work orders with filters (status, priority, assignee, etc.) |
| `get_work_order` | Get detailed work order information |
| `create_work_order` | Create a new work order |
| `update_work_order` | Update an existing work order |
| `complete_work_order` | Mark a work order as complete |

### Assets
| Tool | Description |
|------|-------------|
| `list_assets` | List assets with filters |
| `get_asset` | Get detailed asset information |
| `create_asset` | Create a new asset |
| `update_asset` | Update an existing asset |

### Work Requests
| Tool | Description |
|------|-------------|
| `list_work_requests` | List work requests |
| `get_work_request` | Get work request details |
| `create_work_request` | Submit a new work request |
| `approve_work_request` | Approve a work request |
| `decline_work_request` | Decline a work request |

### Locations
| Tool | Description |
|------|-------------|
| `list_locations` | List locations |
| `get_location` | Get location details |
| `create_location` | Create a new location |
| `update_location` | Update a location |

### Users & Teams
| Tool | Description |
|------|-------------|
| `list_users` | List organization users |
| `get_user` | Get user details |
| `list_teams` | List teams |
| `get_team` | Get team details |

### Parts & Inventory
| Tool | Description |
|------|-------------|
| `list_parts` | List parts with optional low stock filter |
| `get_part` | Get part details |
| `create_part` | Create a new part |
| `update_part` | Update a part |
| `adjust_part_quantity` | Adjust inventory quantity |

### Meters
| Tool | Description |
|------|-------------|
| `list_meters` | List meters |
| `get_meter` | Get meter details |
| `create_meter_reading` | Record a meter reading |
| `list_meter_readings` | List readings for a meter |

### Vendors
| Tool | Description |
|------|-------------|
| `list_vendors` | List vendors |
| `get_vendor` | Get vendor details |
| `create_vendor` | Create a new vendor |

### Purchase Orders
| Tool | Description |
|------|-------------|
| `list_purchase_orders` | List purchase orders |
| `get_purchase_order` | Get purchase order details |

### Procedure Templates
| Tool | Description |
|------|-------------|
| `list_procedure_templates` | List procedure templates |
| `get_procedure_template` | Get procedure template details |

## Usage Examples

Once configured, you can ask Claude to:

- "Show me all open work orders"
- "Create a work order for HVAC maintenance on the main building"
- "List all assets that are currently offline"
- "What parts are low on stock?"
- "Record a meter reading of 5000 hours for asset #123"
- "Who is assigned to work order #456?"

## Rate Limits

The MaintainX API has the following rate limits:
- **100 requests per 60 seconds** per user
- **500 requests per 60 seconds** per organization

The server will return appropriate error messages when rate limits are exceeded.

## Development

### Building from Source

```bash
git clone https://github.com/yourusername/maintainx-mcp-server.git
cd maintainx-mcp-server
npm install
npm run build
```

### Running in Development

```bash
npm run dev
```

## License

MIT License - see [LICENSE](LICENSE) for details.

## Links

- [MaintainX](https://www.getmaintainx.com/)
- [MaintainX API Documentation](https://api.getmaintainx.com/v1/docs)
- [Model Context Protocol](https://modelcontextprotocol.io/)
