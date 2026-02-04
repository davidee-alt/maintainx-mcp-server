# Suzuki USA Manufacturing Research

## Executive Summary

This document provides research on Suzuki's USA manufacturing operations, plant locations, leadership structure, manufacturing technology stack, and integration options via HubSpot and ZoomInfo MCP connectors.

---

## Suzuki USA Plant Locations

### Manufacturing Facility

| Facility | Location | Address | Employees | Products |
|----------|----------|---------|-----------|----------|
| **Suzuki Manufacturing of America Corporation (SMAC)** | Rome, Georgia | 1461 Technology Pkwy NW, Rome, GA 30165 | ~200 | KingQuad ATVs |

**Key Details:**
- **Established:** 2001
- **Investment:** $30+ million
- **Site Size:** 35 acres
- **Daily Production:** 120+ KingQuad ATVs per day
- **Milestone:** 500,000th ATV produced (achieved 22 years after opening)
- **Manufacturing Philosophy:** Just-In-Time (JIT) delivery with regional parts suppliers

### Corporate Headquarters

| Entity | Location | Address | Employees |
|--------|----------|---------|-----------|
| **Suzuki Motor of America, Inc.** | Brea, California | 3251 E Imperial Hwy, Brea, CA 92821 | ~350 |

**Key Details:**
- **Founded:** 2013
- **Campus:** 20-acre campus-like setting
- **Business Units:** Motorcycles, ATVs, Scooters, Outboard Engines, Automotive Parts & Accessories
- **Coverage:** 49 states via extensive dealer network

### Dealer Network
- **Total U.S. Dealerships:** 2,240 (as of March 2025)
- **Top State:** Florida with 306 dealerships (~14% of total)

---

## Suzuki USA Leadership & Key Contacts

### Executive Leadership

| Name | Title | Location | Entity |
|------|-------|----------|--------|
| **Julian Paulini** | President & CEO | Brea, CA | Suzuki Motor of America, Inc. |
| **Takuya Sato** | Executive Vice President | Brea, CA | Suzuki Motor of America, Inc. |
| **Jacob Ewing** | VP of Operations | Tampa, FL | Suzuki Marine USA |

### Historical/Former Executives

| Name | Title | Entity |
|------|-------|--------|
| Noboyuki Yamane | President | Suzuki Manufacturing of America Corp. |
| Masashi Tanaka | Executive Vice President | American Suzuki Motor Corporation |
| Rod Lopusnak | U.S. Sales Manager | Suzuki Motor of America |

### Maintenance Manager Contacts

**Note:** Specific maintenance manager contacts for the Rome, GA plant were not found in public sources. Recommended actions:

1. **ZoomInfo Direct Search:** Use ZoomInfo MCP connector to search for:
   - "Maintenance Manager" at Suzuki Manufacturing of America
   - "Plant Manager" at SMAC Rome, Georgia
   - "Operations Manager" at Suzuki Manufacturing

2. **LinkedIn Company Page:** https://www.linkedin.com/company/suzuki-manufacturing-amer

3. **HubSpot CRM:** Import ZoomInfo enriched contacts for outreach

---

## Manufacturing Technology Stack

### Confirmed Technologies

| Category | Technology/Approach |
|----------|---------------------|
| **Production Philosophy** | Just-In-Time (JIT) Manufacturing |
| **Supply Chain** | Regional Parts Supplier Network |
| **Quality** | Award-winning production (KingQuad quality benchmarks) |

### Technology Stack (Unconfirmed - Requires Further Research)

Manufacturing facilities typically use:

| System Type | Common Solutions | Research Status |
|-------------|------------------|-----------------|
| **ERP** | SAP, Oracle, Microsoft Dynamics | Not publicly disclosed |
| **MES** | Rockwell, Siemens, AVEVA | Not publicly disclosed |
| **CMMS** | MaintainX, Fiix, UpKeep, SAP PM | Not publicly disclosed |
| **SCADA** | Ignition, Wonderware | Not publicly disclosed |
| **PLM** | Siemens Teamcenter, PTC | Not publicly disclosed |

**Note:** Suzuki's specific technology stack is proprietary and not publicly available. Direct engagement or case study research required.

---

## MCP Connector Integration

### HubSpot MCP Server

**Official Server:** https://mcp.hubspot.com

**Status:** Public Beta

**Supported Data (Read-Only):**
- Contacts
- Companies
- Deals
- Tickets
- Products
- Orders
- Line Items
- Invoices
- Quotes
- Subscriptions

**Setup Configuration:**
```json
{
  "mcpServers": {
    "hubspot": {
      "url": "https://mcp.hubspot.com",
      "auth": {
        "type": "oauth2",
        "clientId": "YOUR_APP_CLIENT_ID",
        "clientSecret": "YOUR_APP_CLIENT_SECRET"
      }
    }
  }
}
```

**Use Cases for Suzuki Research:**
- Store and manage Suzuki plant contact information
- Track outreach to maintenance managers
- Manage deal pipeline for MaintainX opportunities
- Log interactions with plant leadership

**Resources:**
- [HubSpot MCP Documentation](https://developers.hubspot.com/mcp)
- [HubSpot MCP Setup Guide](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server)

### ZoomInfo MCP Server

**Official Server:** https://mcp.zoominfo.com/mcp

**Requirements:**
- ZoomInfo subscription
- AI assistant with MCP support (Claude Pro/Max/Team/Enterprise)

**Setup Configuration:**
```json
{
  "mcpServers": {
    "zoominfo": {
      "url": "https://mcp.zoominfo.com/mcp",
      "auth": {
        "type": "api_key",
        "apiKey": "YOUR_ZOOMINFO_API_KEY"
      }
    }
  }
}
```

**Use Cases for Suzuki Research:**
- Find maintenance managers at Suzuki Manufacturing of America
- Enrich contact data with direct phone and email
- Identify VP of Operations and Plant Managers
- Research company technographics (installed technologies)

**Available Actions:**
- Company search and enrichment
- Contact/People search
- Technographic data lookup
- Intent data signals
- Org chart navigation

**Resources:**
- [ZoomInfo MCP Documentation](https://docs.zoominfo.com/docs/zi-api-mcp-overview)
- [ZoomInfo MCP Setup](https://docs.zoominfo.com/docs/mcp)

---

## Recommended Next Steps

### 1. Contact Discovery via ZoomInfo

Search queries to execute:
```
Company: "Suzuki Manufacturing of America Corporation"
Location: Rome, GA
Titles:
  - Maintenance Manager
  - Maintenance Director
  - Plant Manager
  - Operations Manager
  - VP Operations
  - Reliability Engineer
  - Facilities Manager
```

### 2. HubSpot CRM Setup

1. Create company record for "Suzuki Manufacturing of America Corporation"
2. Associate enriched contacts from ZoomInfo
3. Create deal for MaintainX CMMS opportunity
4. Set up outreach sequences

### 3. MaintainX Integration Value Proposition

For Suzuki Manufacturing of America (ATV Production):
- **Asset Management:** Track assembly line equipment, robotics, tooling
- **Work Orders:** Manage preventive and reactive maintenance
- **Inventory:** Parts management for JIT manufacturing support
- **Meter Readings:** Track equipment hours, cycles for predictive maintenance
- **Mobile Access:** Floor-level technician access to procedures

---

## Data Sources

- [Global Suzuki - Production Base](https://www.globalsuzuki.com/corporate/productionbase/index.html)
- [Suzuki USA](https://suzuki.com/)
- [Suzuki Cycles - Fabrication](https://suzukicycles.com/about/fabrication)
- [Suzuki Manufacturing of America - LinkedIn](https://www.linkedin.com/company/suzuki-manufacturing-amer)
- [D&B Company Profile](https://www.dnb.com/business-directory/company-profiles.suzuki_manufacturing_of_america_corporation.f61202877294753f3271a6c090e4d838.html)
- [Bloomberg Company Profile](https://www.bloomberg.com/profile/company/0338454D:US)
- [HubSpot MCP Developers](https://developers.hubspot.com/mcp)
- [ZoomInfo MCP Documentation](https://docs.zoominfo.com/docs/zi-api-mcp-overview)
- [Elliott Report - Suzuki Contacts](https://www.elliott.org/company-contacts/suzuki-motor-of-america/)
- [Powersports Business - Suzuki Marine VP Promotions](https://powersportsbusiness.com/news/suzuki/2025/06/05/suzuki-marine-promotes-two-execs-to-vp-roles/)

---

*Research compiled: February 2026*
