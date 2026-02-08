# US Steel Account Strategy

**Account:** United States Steel Corporation (US Steel)
**Industry:** Integrated Steel Manufacturing
**HQ:** Pittsburgh, PA
**Key Facilities:** Gary Works (IN), Minnesota Ore Operations (MN), Granite City (IL), and others
**Status:** Active Evaluation (Minnesota Ore) / Discovery (Enterprise)
**MaintainX Team:** Davidee Inukpuk (AD - Enterprise), Matthew Baird (ISR), Millen (SDR)
**Last Updated:** February 8, 2026

---

## 1. STAKEHOLDER MAP

### Identified Stakeholders

| Name | Title | Site | Role in Deal | Engagement Level | Notes |
|------|-------|------|-------------|-----------------|-------|
| **Timothy Vandaveer** | Area Manager Reliability | Gary Works, IN | Technical Champion (Emerging) | Active - Discovery Call 2/6/26 | 26yr veteran. De facto company-wide reliability lead since corporate team was disbanded. Oracle super user/admin, BI power user, liaison for 3rd party apps. Most influential individual reliability voice across US Steel. |
| **Justin Adams** | Reliability (title TBD) | Minnesota Ore Operations, MN | Site Champion | Active - Evaluating MaintainX | Initiated the MaintainX evaluation. Participates in Tim's monthly reliability call. Driving paper-to-digital transformation at MN Ore. |
| **Mike Bach** | Plant Manager | Minnesota Ore Operations, MN | Economic Buyer (Site) | Not yet engaged | Justin's boss. Loves A3 format. Straightforward communicator. Justin is socializing MaintainX A3 to him for buy-in. Next step: demo + on-site workshop for Mike. |
| **Andrew** | Unknown | Unknown | Initial Contact | Engaged via email by Millen | First point of contact. Millen emailed Andrew, which led to the Tim introduction. |
| **Daniel King** | SCADA Team | Corporate / Unknown Site | Technical Influencer (OT/IIoT) | Not yet engaged | Works with HiByte or Litmus for data modeling from PLCs/DCS. Key to sensor data integration strategy. |
| **John Tarby** | Unknown | Unknown | Technical Contact | Engaged - Previous call | Was on a call with Tim ~late Jan 2026. Discussed Prometheus Group limitations around marrying CMMS data to crew scheduling. |

### Stakeholder Relationship Map

```
                    ┌─────────────────────────────┐
                    │   EXECUTIVE SPONSOR (TBD)    │
                    │   VP Operations / VP Mfg?    │
                    │   *** NOT YET IDENTIFIED ***  │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                              │
          ┌─────────┴─────────┐        ┌──────────┴──────────┐
          │  TIMOTHY VANDAVEER │        │    MIKE BACH         │
          │  Area Mgr Reliab.  │        │    Plant Mgr         │
          │  Gary Works        │        │    Minnesota Ore     │
          │  ENTERPRISE VIEW   │◄──────►│    SITE BUYER        │
          │  (Our Key Champion)│ monthly│    (Econ. Buyer-Site) │
          └─────────┬─────────┘  call   └──────────┬──────────┘
                    │                              │
     ┌──────────────┼──────────────┐               │
     │              │              │               │
┌────┴────┐  ┌─────┴─────┐ ┌─────┴─────┐  ┌──────┴──────┐
│DANIEL   │  │ JOHN      │ │ OTHER     │  │ JUSTIN      │
│KING     │  │ TARBY     │ │ SITE      │  │ ADAMS       │
│SCADA    │  │ (Unknown) │ │ RELIAB.   │  │ Reliability │
│OT/IIoT  │  │           │ │ LEADS     │  │ MN Ore      │
│         │  │           │ │           │  │ SITE CHAMP  │
└─────────┘  └───────────┘ └───────────┘  └─────────────┘
```

### Key Dynamics

1. **Tim is the gatekeeper.** With the corporate reliability team disbanded, Tim has become the de facto enterprise reliability leader. He coordinates a monthly reliability call across all sites. He sees himself as the person who should prevent fragmented software purchases across the company.

2. **Tim's personality: he wants to own this.** He explicitly stated he doesn't want Minnesota Ore going down one path, Granite City another, Gary Works another. He wants a unified solution. This is both an opportunity (enterprise deal) and a risk (single point of failure if he disengages).

3. **The executive sponsor gap is critical.** There is no identified VP or C-level stakeholder yet. Tim operates at the "area manager" level -- influential but not an economic buyer for enterprise deals. We need to identify and engage someone at the VP Operations / VP Manufacturing / SVP level.

4. **Justin is our beachhead but Tim controls expansion.** Justin can prove value at Minnesota Ore, but Tim decides whether it scales. These two channels must be cultivated simultaneously.

---

## 2. COMPLETE TECHNOLOGY STACK

Every system, tool, and technology mentioned across all conversations:

### Enterprise Systems

| System | Type | Scope | Notes |
|--------|------|-------|-------|
| **Oracle (Apex)** | ERP / Central Database | Enterprise-wide | All facility data flows to a central Apex database. Accounting, CMMS, and other systems integrate here. This is the system of record. |
| **Oracle CMMS** | Computerized Maintenance Management | Enterprise-wide (North American Flat Rolled) | Core CMMS for steel-making operations. Too complex for technician-level use per Justin. Migrated to Oracle ~2013 under Tim's guidance. |
| **Oracle Accounting** | Financial System | Enterprise-wide | Where all financial data lives. Not fully integrated with all operational systems (e.g., delay tracking is standalone). |
| **BI Reporting Systems** | Business Intelligence | Enterprise-wide | Tim is a power user. Used for scorecard and workforce management reporting. |

### Maintenance & Reliability Tools

| System | Type | Scope | Notes |
|--------|------|-------|-------|
| **Prometheus Group (Vizia Scheduler)** | Work Scheduling / Planning | Enterprise-wide | Current scheduling tool. Tim identified a critical limitation: cannot marry CMMS data to crew scheduling/payroll data. This is the gap MaintainX must exploit. |
| **Test Oil Program** | Oil Analysis / PdM | Enterprise-wide | Tied into Oracle. Used for oil anomaly detection and analysis. |
| **Internal PdM Tools** | Predictive Maintenance | Various sites | Internal PdM technicians use various tools and software that tie back to Oracle. Specifics not fully identified. |

### Operational Technology (OT) / IIoT

| System | Type | Scope | Notes |
|--------|------|-------|-------|
| **In-house Sensors** | Condition Monitoring | Various sites | Tim mentioned in-house sensors that provide the same data as third-party offerings. |
| **HiByte or Litmus** | Data Integration / Digital Twin | TBD (Daniel King's team) | Used for data modeling from PLCs/DCS. MaintainX is a HiByte partner -- this is a key integration vector. |
| **SCADA Systems** | Supervisory Control | Various sites | Daniel King's team manages. Data from PLCs/DCS flows through SCADA. |
| **PLCs / DCS** | Process Control | All facilities | Equipment-level control systems generating operational data. |

### Standalone / Disconnected Systems

| System | Type | Scope | Notes |
|--------|------|-------|-------|
| **Delay Tracking System** | Downtime / OEE | Enterprise-wide | STANDALONE -- not in Oracle. Tracks TOE/SOE (Total/Schedule Operating Efficiency). Tells them when operations slowed, failure issues, reasons. Tim sees this as a data island. Minnesota Ore was exploring moving this to a different system or process control group. |
| **Campaign Tracking System** | Equipment Age / Lifecycle | Enterprise-wide | STANDALONE. Tells Tim how old equipment is. Not integrated with other systems. |
| **Payroll / Manpower Scheduling** | Workforce Management | Enterprise-wide | Separate from CMMS. Shows scheduled hours. The inability to marry this with CMMS available hours is a TOP pain point. |
| **Major Outage Scopes of Work** | Outage Planning | Enterprise-wide | COMPLETELY OUTSIDE ANY DATABASE. Tim explicitly called this out. Commercial entity level, 3-5 year business planning outlook. |

### Third-Party Vendors (from Crossbeam)

| Vendor | Category | Integration with MaintainX | Priority for Introduction |
|--------|----------|--------------------------|--------------------------|
| **AssetWatch** | Vibration PdM + Oil Analysis | EXISTING LIVE INTEGRATION | HIGHEST -- ask for warm intro |
| **Waites** | AI Condition Monitoring (500K sensors) | FORMAL PARTNERSHIP (Dec 2025) | HIGHEST -- use exec relationship |
| **KCF Technologies** | Vibration PdM (per-minute data) | NATIVE INTEGRATION EXISTS | HIGH -- co-sell motion |
| **SAP** | ERP (likely core ERP) | ON SAP STORE | HIGH -- different angle (IT/digital) |
| **Guidewheel** | Factory OPS / OEE / PdM | No integration yet | MEDIUM -- build partnership first |
| **Corso Systems** | SCADA/MES Integrator (Ignition) | None (implementation partner) | MEDIUM -- useful post-deal |

---

## 3. WORKFLOW MAP (Current State vs. MaintainX Future State)

### Workflow 1: Work Order Lifecycle (Current - Broken)

```
CURRENT STATE (Minnesota Ore - Paper Based):

Technician receives     Technician performs    Technician writes      Admin manually enters
paper work order   -->  maintenance work  -->  completion notes  -->  data into Oracle CMMS
                                               on paper                    │
                                                                           ▼
                                                                    DELAYED DATA
                                                                    (hours/days late)
                                                                           │
                                                                           ▼
                                                                    No real-time
                                                                    visibility into
                                                                    backlog, completion,
                                                                    or cost
```

**Problems:**
- Time delay from work completion to data entry (hours to days)
- Information loss in paper-to-digital transcription
- Admin bottleneck for data entry
- No parts charged to WO in real-time
- No time capture at the WO level
- Cannot prove ROI for capex investments (Justin's core pain)
- Oracle too complex for technician-level users

### Workflow 2: Weekly Scheduling (Current - Fragmented)

```
CURRENT STATE (Enterprise):

Oracle CMMS              Payroll/Manpower         Prometheus Vizia
(What work exists)       (Who's available)         (Scheduling tool)
      │                        │                         │
      │    NO INTEGRATION      │    NO INTEGRATION       │
      └────────────X───────────┘────────────X────────────┘
                   │
                   ▼
         Planner must manually:
         1. Check CMMS backlog
         2. Check payroll for available hours
         3. Try to marry them in Prometheus
         4. Schedule must be out every Thursday (contractual)

         Tim wants 4-week lookahead but can't automate it
```

**Problems:**
- Three systems, zero integration
- Manual reconciliation of work demand vs. labor capacity
- Prometheus Group cannot bridge CMMS data to crew scheduling/payroll
- Contractual Thursday deadline creates weekly crunch
- No intelligence around "what can I accomplish this week with who I have"

### Workflow 3: Predictive Maintenance Data Flow (Current - Partial)

```
CURRENT STATE:

In-house Sensors    PdM Technicians     Test Oil Program
PLCs/DCS/SCADA      (Various tools)     (Oil Analysis)
      │                   │                   │
      ▼                   ▼                   ▼
 Daniel King's       Manual analysis     Tied to Oracle
 team (HiByte/       and reporting       (anomaly data)
 Litmus)                  │                   │
      │                   ▼                   │
      ▼              PdM recommendations      │
 Data modeling       manually entered         │
 (not connected      into CMMS                │
  to CMMS)                │                   │
      │                   └─────────┬─────────┘
      X                             ▼
 NOT CONNECTED              Oracle CMMS
 TO EXECUTION          (data in, but hard to
                        act on at floor level)
```

**Problems:**
- PdM insights exist but don't automatically trigger work orders
- HiByte/Litmus data modeling is disconnected from maintenance execution
- Multiple sensor systems and analysis tools not unified
- Technicians don't see predictive data when they're at the machine

### Workflow 4: Strategic Planning & Outage Management (Current - No System)

```
CURRENT STATE:

Campaign Tracking        Delay Tracking        Major Outage Scopes
(Equipment age -         (TOE/SOE -            (3-5yr outlook -
 standalone system)       standalone system)     NOT IN ANY DATABASE)
      │                        │                        │
      │                        │                        │
      ▼                        ▼                        ▼
         All manual. Tim is the human integration layer.
         He manually ties together:
         - 2026 capital maintenance schedule
         - Which shops are down when
         - Business planning (commercial entity level)

         This is Tim's 1-2-3-5 year planning horizon.
```

---

### MAINTAINX FUTURE STATE: The Unified Execution Layer

```
                        ┌─────────────────────────────┐
                        │       ORACLE / APEX          │
                        │   (System of Record - ERP)   │
                        │   Financial, Procurement,    │
                        │   Inventory, HR/Payroll      │
                        └──────────────┬──────────────┘
                                       │ Bi-directional Sync
                                       │ (WO, Parts, Costs, Time)
                        ┌──────────────┴──────────────┐
                        │        MAINTAINX             │
                        │   Mobile-First Execution     │
                        │   Layer for Maintenance      │
                        │                              │
                        │  - WO Management             │
                        │  - Scheduling (drag & drop)  │
                        │  - Procedures on mobile      │
                        │  - Parts charging to WO      │
                        │  - Time capture              │
                        │  - AI-powered diagnostics    │
                        │  - Backlog management        │
                        │  - Labor capacity planning   │
                        └──────┬──────┬──────┬────────┘
                               │      │      │
                ┌──────────────┘      │      └──────────────┐
                │                     │                      │
     ┌──────────┴──────────┐  ┌──────┴───────┐  ┌──────────┴──────────┐
     │  PdM SENSOR LAYER   │  │   SCADA/OT   │  │  TECHNICIAN MOBILE  │
     │                     │  │              │  │                     │
     │  AssetWatch         │  │  HiByte /    │  │  MTMs, MTEs,        │
     │  Waites             │  │  Litmus      │  │  Systems Repairmen  │
     │  KCF Technologies   │  │  (Daniel     │  │                     │
     │  Guidewheel         │  │   King's     │  │  - Receive WOs      │
     │  In-house sensors   │  │   team)      │  │  - Follow procedures│
     │                     │  │              │  │  - Charge parts     │
     │  Alerts auto-create │  │  Real-time   │  │  - Log time         │
     │  WOs in MaintainX   │  │  machine     │  │  - AI: "What was    │
     │                     │  │  data on     │  │    last breakdown?" │
     │                     │  │  tech's      │  │  - Close out WOs    │
     │                     │  │  phone       │  │    with feedback    │
     └─────────────────────┘  └──────────────┘  └─────────────────────┘
```

**What this solves:**
1. **Technician adoption** -- KISS principle, mobile-first, replaces paper
2. **Data feedback loop** -- Parts, time, and completion data captured at point of work
3. **Scheduling intelligence** -- Backlog + available labor hours in one view, drag-and-drop
4. **PdM to execution** -- Sensor alerts auto-generate tracked work orders
5. **Oracle stays system of record** -- Everything syncs back; finance/procurement/HR untouched
6. **ROI proof** -- With data captured, Justin (and others) can finally justify capex
7. **Single pane** -- Tim's dream: "one system to look at everything and make moves happen"

---

## 4. INTRODUCTION PATHS TO EXECUTIVE SPONSOR

### Path A: AssetWatch (HIGHEST PRIORITY)

**Status:** MaintainX has a LIVE integration with AssetWatch. AssetWatch has deep steel/metals expertise with published case studies (Worthington Steel).

**Action:** MaintainX partnership team contacts AssetWatch account manager covering US Steel. Request:
- Confirm AssetWatch deployment at US Steel (which sites, which assets)
- Warm introduction to AssetWatch's US Steel sponsor (likely VP Operations or VP Reliability)
- Position as: "Close the loop on your PdM investment -- every AssetWatch alert becomes a tracked, completed repair in MaintainX"

### Path B: Waites (HIGHEST PRIORITY)

**Status:** Formal MaintainX-Waites partnership announced December 8, 2025. Joint CEO statements. 500K sensors deployed, 13K industrial organizations.

**Action:** MaintainX executive team contacts Waites executive team (CEO-to-CEO or VP-to-VP). Request:
- Introduction to Waites' US Steel account team
- Joint value proposition for US Steel reliability leadership
- This is the most direct path to an executive introduction because the partnership is fresh and has executive sponsorship on both sides

### Path C: KCF Technologies (HIGH PRIORITY)

**Status:** Native MaintainX integration exists. KCF has named steel customers and the largest vibration analyst team in North America.

**Action:** Similar to AssetWatch -- contact KCF partnership/account team for US Steel introduction. Position as complementary execution layer.

### Path D: SAP (HIGH PRIORITY -- DIFFERENT ANGLE)

**Status:** MaintainX is on the SAP Store. SAP is almost certainly US Steel's core ERP.

**Action:** Engage SAP account executive covering US Steel. This gets MaintainX in front of IT/digital transformation leadership rather than just reliability/maintenance. The pitch: "MaintainX is the mobile execution layer that drives SAP PM adoption on the shop floor."

**Why this matters:** This is the path most likely to reach a CIO, VP Digital, or VP IT -- a different buying center than Tim's reliability world. An enterprise deal at US Steel will need both maintenance leadership AND IT/digital sign-off.

### Path E: Guidewheel (MEDIUM PRIORITY)

**Status:** US Steel is a confirmed Guidewheel customer. No existing MaintainX-Guidewheel integration.

**Action:** Explore building a Guidewheel integration, then approach jointly. Lower priority because integration doesn't exist yet.

### Path F: Corso Systems (MEDIUM PRIORITY -- POST-DEAL)

**Status:** SCADA/MES integrator with steel industry experience. Could be the implementation partner.

**Action:** Engage once deal progresses. Corso could architect the MaintainX-to-SCADA/HiByte connection at US Steel, potentially connecting to Daniel King's team.

---

## 5. ACTION PLAN

### Phase 1: Foundation (Now - Feb 17, 2026)

| # | Action | Owner | Deadline | Notes |
|---|--------|-------|----------|-------|
| 1 | Send Tim the A3 document (Minnesota Ore summary) | Davidee | Feb 10 | Tim asked for this. Mike Bach (plant mgr) loves A3 format. Tim will use this to understand MN Ore value prop. |
| 2 | Send Tim the Houston rodeo/MaintainX event info | Davidee | Feb 10 | Tim showed interest. Face-to-face builds champion relationship faster than any call. |
| 3 | Prepare for Monday 2/10 follow-up call (12-1 PM CT) | Davidee + Matthew | Feb 10 | Tim wants to understand: (a) What MN Ore benefits are, (b) Can it scale across the company. Prepare a tailored demo showing US Steel-relevant use cases. |
| 4 | Build a US Steel-specific demo environment | Davidee | Feb 10 | Include: MTM/MTE/Systems Repairman roles, steel-specific assets, procedures, scheduling view with drag-and-drop. Show the "one system" vision Tim described. |
| 5 | Contact AssetWatch partnership team | Davidee / Partnerships | Feb 12 | Ask: Is AssetWatch deployed at US Steel? Can we get a warm intro to their US Steel executive sponsor? |
| 6 | Contact Waites partnership team | Davidee / Partnerships | Feb 12 | Leverage Dec 2025 partnership. Request intro to Waites' US Steel account team. |

### Phase 2: Build Tim as Champion (Feb 17 - Mar 7, 2026)

| # | Action | Owner | Deadline | Notes |
|---|--------|-------|----------|-------|
| 7 | Deep-dive call with Tim: walk through the integration architecture | Davidee | Week of Feb 17 | Show Tim exactly how MaintainX talks to Oracle/Apex, how scheduling works vs. Prometheus, and the PdM sensor integrations. He's technical -- give him the technical answer. |
| 8 | Provide Tim a one-pager: "MaintainX vs. Prometheus Group for Scheduling" | Davidee | Feb 21 | Tim identified Prometheus' inability to marry CMMS to payroll/crew data as a pain point. Give him ammo to justify replacing Prometheus scheduling. |
| 9 | Connect with Justin Adams to align stories | Davidee | Feb 17 | Tim and Justin are on a monthly reliability call together. Their messages to leadership must be consistent. Coordinate the narrative. |
| 10 | Map Tim's monthly reliability call participants | Davidee | Feb 21 | This call is the single biggest influence channel. Who else is on it? These are the site reliability leads across all US Steel. Every one of them is a potential site champion. |
| 11 | Explore inviting Tim to visit a MaintainX reference customer | Davidee | Feb 28 | Nucor was mentioned. Tim knows MaintainX works with Nucor. A peer conversation with a Nucor reliability lead would be powerful. |

### Phase 3: Multi-Thread to Executive Sponsor (Mar 2026)

| # | Action | Owner | Deadline | Notes |
|---|--------|-------|----------|-------|
| 12 | Use AssetWatch/Waites intros to identify VP Operations or VP Manufacturing | Partnerships + Davidee | Mar 7 | Tim is influential but not an economic buyer for enterprise. We need his boss's boss. |
| 13 | Engage SAP account team for US Steel | Partnerships | Mar 7 | Different buying center: IT/Digital. An enterprise CMMS deployment will need IT sign-off. SAP AE can introduce us to CIO/VP Digital. |
| 14 | Ask Tim directly: "Who approves enterprise software decisions?" | Davidee | Next call with Tim | Tim is transparent and knowledgeable. He'll tell us the org structure. Frame it as: "If we prove this works at MN Ore, who would approve expanding it?" |
| 15 | Prepare enterprise ROI business case | Davidee | Mar 14 | Quantify: (a) Admin labor saved from paper elimination, (b) Parts inventory optimization, (c) Scheduling efficiency gains, (d) Downtime reduction from PdM-to-execution loop. Use Nucor benchmarks. |
| 16 | Propose on-site workshop at Gary Works | Davidee | Mar 21 | Tim is at Gary Works. Getting on-site lets us meet more stakeholders, see the operation, and demonstrate seriousness about an enterprise partnership. |

### Phase 4: Minnesota Ore Proof of Value (Mar-Apr 2026)

| # | Action | Owner | Deadline | Notes |
|---|--------|-------|----------|-------|
| 17 | Close Mike Bach on MN Ore pilot | Davidee + Justin | Mar 2026 | Justin socializes A3 -> plant manager demo -> decision. This is the proving ground. |
| 18 | Define MN Ore pilot scope and success metrics | Davidee + Justin | At pilot start | Must include: WO completion rate, time-to-data (vs. paper baseline), parts charged to WO %, technician adoption rate. These metrics become the enterprise business case. |
| 19 | Ensure MN Ore pilot data flows back to Oracle | Davidee + Tech | During pilot | Tim's #1 concern: does it talk to Apex? The pilot must prove Oracle integration works. |
| 20 | Report pilot results to Tim for enterprise socialization | Davidee | Pilot +30 days | Give Tim the ammunition to present to his monthly reliability call and to leadership. |

### Phase 5: Enterprise Expansion (Q2-Q3 2026)

| # | Action | Owner | Deadline | Notes |
|---|--------|-------|----------|-------|
| 21 | Tim presents MN Ore results at monthly reliability call | Tim (enabled by Davidee) | Q2 2026 | Tim becomes the internal evangelist. We prepare his deck/materials. |
| 22 | Gary Works pilot proposal | Davidee + Tim | Q2 2026 | Tim's own site. If he champions it at his own site, credibility is locked in. |
| 23 | Enterprise agreement negotiation | Davidee + Leadership | Q3 2026 | Multi-site licensing, integration architecture, rollout plan. |

---

## 6. RISK REGISTER

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Tim becomes single point of failure** | HIGH | HIGH | Multi-thread aggressively. Use Crossbeam partners (AssetWatch, Waites, SAP) to build relationships at exec level and at other sites. Never let Tim be the only thread. |
| **Tim wants to "own" the evaluation and slows it down** | HIGH | MEDIUM | Feed Tim's desire to be the enterprise decision-maker by giving him enterprise-level materials, but simultaneously drive urgency at MN Ore with Justin/Mike Bach. Two parallel tracks. |
| **Nippon Steel acquisition changes decision-making** | MEDIUM | HIGH | Monitor acquisition status. Nippon Steel may impose their own technology standards. Build relationships now while US Steel leadership still has autonomy. |
| **Prometheus Group fights back** | MEDIUM | MEDIUM | Don't position as "replace Prometheus." Position as "MaintainX does what Prometheus can't: marry CMMS to crew scheduling." Be the complement first, then expand scope. |
| **Technician adoption resistance ("culture" problem Tim raised)** | MEDIUM | HIGH | Tim is right -- no software fixes culture. Propose a structured change management approach: start small (one crew, one unit), show quick wins, let peer pressure drive adoption. Reference the "5% gap" where MaintainX's simplicity kickstarts the feedback culture. |
| **Oracle/Apex integration proves complex** | LOW | HIGH | Engage MaintainX technical team early on Oracle/Apex integration architecture. Get a technical win on this before the pilot starts. |
| **Corporate reliability team is reconstituted under Nippon Steel** | LOW | MEDIUM | This would actually be an opportunity -- a new corporate team would need tools. Position MaintainX as the platform the new team standardizes on. |

---

## 7. KEY QUOTES FROM TIM (Use These in Future Conversations)

These are Tim's own words that reveal his pain points and buying criteria:

> **On fragmentation:** "I don't want to have Minnesota Ore go down the path with MaintainX and Granite City go down the path of whatever with Prometheus and Gary go down the path of whatever with Accenture. And then what we realize at the end of the day is there's a solution that might be able to do everything we need."

> **On the scheduling gap:** "Prometheus Group or any other third party still has a hurdle of marrying the CMMS data to the crew scheduling data. We have independent systems for work management and payroll."

> **On the single-system vision:** "Can I go to one system? Look at everything I got and make all those moves happen?"

> **On culture vs. software:** "No matter which facility you're working with... unless I have the culture on the shop floor level to provide feedback to some system... if you don't get that feedback, it doesn't matter what software tool is available."

> **On his unique role:** "I'm the one man band right now for the company that's trying to bridge all the gaps between IT teams and maintenance teams on the floor."

> **On the right work:** "To do the right work at the right time, at the right cost... that's the goal of any CMMS. But your CMMS doesn't [do that alone]."

---

## 8. CROSSBEAM PARTNER INTRODUCTION PLAYBOOK

### Immediate Actions (This Week)

**1. AssetWatch -- Warm Introduction Request**
- Contact: MaintainX Partnerships team
- Ask: "We have an active opportunity at US Steel. AssetWatch is deployed there. Can our AssetWatch partner contact facilitate a joint introduction to the US Steel reliability/operations leadership team?"
- Value prop for AssetWatch: "Every AssetWatch alert at US Steel that doesn't convert to a completed repair is wasted PdM investment. MaintainX closes that loop."

**2. Waites -- Executive-Level Introduction**
- Contact: MaintainX executive team (the Dec 2025 partnership was announced with CEO involvement)
- Ask: "We need a Waites-facilitated introduction to US Steel's senior reliability or operations leadership. Our mutual integration makes this a compelling joint story."
- Value prop for Waites: "Demonstrate to US Steel that their Waites investment is part of a complete reliability ecosystem, not a standalone tool."

**3. KCF Technologies -- Co-Sell Opportunity**
- Contact: MaintainX Partnerships team
- Ask: "KCF has steel industry customers and a native MaintainX integration. Is KCF deployed at US Steel? If so, can we approach jointly?"
- Value prop for KCF: "MaintainX makes KCF's per-minute vibration data actionable at the technician level."

### Medium-Term Actions (Next 2-4 Weeks)

**4. SAP -- Channel Introduction**
- Contact: MaintainX's SAP partnership contact or SAP Store team
- Ask: "Who is the SAP AE covering US Steel? Can we get introduced to US Steel's IT/digital transformation team through the SAP relationship?"
- Value prop for SAP: "MaintainX drives SAP PM adoption on the shop floor. More SAP usage = more SAP value for the customer = more SAP revenue."

**5. Guidewheel -- Explore Partnership**
- Contact: Guidewheel partnerships team
- Ask: "US Steel runs Guidewheel. MaintainX would be the maintenance execution layer for Guidewheel's factory insights. Is there interest in a partnership?"
- This is a longer play since no integration exists today.

**6. Corso Systems -- Implementation Partner**
- Contact: After deal progresses
- Corso could architect and implement MaintainX at US Steel, especially the SCADA/HiByte/Litmus connections.
- Hold this until there's a signed deal or active pilot that needs integration work.

---

## 9. TIM VANDAVEER CHAMPION DEVELOPMENT PLAN

### Why Tim Matters
Tim is not a typical site-level contact. He is the most technically credible voice for reliability across all of US Steel. His 26-year tenure, his progression from laborer to area manager, and his deep system expertise (Oracle admin, BI power user, third-party liaison) make him uniquely influential. When he speaks on a monthly reliability call, people listen.

### How to Develop Tim Without Getting Pigeonholed

| Strategy | Tactic | Why |
|----------|--------|-----|
| **Feed his enterprise vision** | Give Tim enterprise-level materials, not just site-level demos | Tim thinks enterprise. Giving him site-level content feels beneath his role. |
| **Make him the internal presenter** | Build Tim's deck for the monthly reliability call | If Tim presents MaintainX to all site reliability leads, we get instant multi-site awareness without Tim being the bottleneck. |
| **Respect his expertise** | Never oversell or BS him | Tim called out that no software solves the culture problem. He's seen vendors come and go for 26 years. Earn credibility through honesty. |
| **Give him competitive intelligence** | Help Tim understand why Prometheus can't do what MaintainX can | Tim wants to be the expert. Arm him with knowledge he can use internally. |
| **Don't make him the only path** | Simultaneously pursue Crossbeam intros, Justin/Mike Bach track, and SAP/IT path | Tim should feel like the most important relationship (because he is), but we can't have him as the only door into US Steel. |
| **Get him face-to-face** | Houston rodeo event, on-site workshop at Gary Works, reference customer visit | Tim is a relationship person (26 years at one company). In-person builds trust faster. |

### Red Flags to Watch

- Tim starts gatekeeping: "Let me handle all the internal conversations" -- push back gently by saying "We want to make sure we're not adding to your workload, Tim. Can we support you by engaging directly with [site lead]?"
- Tim deprioritizes MaintainX in favor of another vendor -- he mentioned Accenture, other third parties. Stay top of mind with regular value touches.
- Tim retires or changes roles -- at 26 years, this is possible. Multi-threading mitigates this risk.
