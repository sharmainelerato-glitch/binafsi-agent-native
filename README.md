# BINAFSI

### Living Intelligence for Real-Life Decisions

**Your life, intelligently connected.**

BINAFSI is an Agent-Native personal intelligence workspace that brings together goals, memories, commitments, decisions, and opportunities. Instead of treating each part of life as a separate list, BINAFSI helps people see how a change in one plan affects the others—while keeping the final decision in human hands.

Built for the **Builder.io Agent-Native Hackathon 2026**.

## The problem

A shift in a work schedule can disrupt studying. A new commitment can conflict with a protected priority. A missed opportunity can require an entirely new plan. Calendars, note-taking tools, and goal trackers each hold pieces of this information, but they rarely help people reason across the connections.

**BINAFSI combines context, deterministic planning, and AI-assisted explanations in one workspace.**

## What BINAFSI does

### Living Memory Twin
- Save and retrieve personal context, preferences, and notes.
- Mark important memories as protected.
- Let authorized AI tools use relevant saved context when requested.

### Goals
- Create goals with categories and measurable targets.
- Save and retrieve goals under the signed-in user's account.

### Connected Life Map
- Record scheduled commitments and distinguish protected from flexible items.
- Find overlapping time blocks.
- Understand which commitments a proposed schedule change could affect.

### Decision Twin
- Describe a requested scheduling change and generate alternatives.
- Show valid and invalid options, conflicts, assumptions, and trade-offs.
- Preview before-and-after schedules before a change is made.
- Require explicit human approval to apply a valid proposal.
- Use version-checked history and undo to reverse eligible changes.
- Preserve protected commitments rather than silently moving them.

### BINAFSI AI
BINAFSI extends the Agent-Native Chat starter with shared actions that the interface and AI can access. The AI can read authorized saved context, add explicitly requested goals, memories, and commitments, propose decisions, and inspect saved proposals. The application keeps consequential approval and undo actions under deliberate user control.

### Daily Briefing and Profile
- Personalized welcome using a profile name and local date/time.
- Today's saved commitments in the workspace.
- Account-scoped preferred name and timezone in the application data layer.

### Event Opportunity Companion
- Record event opportunities, including opportunities a user missed.
- Organize context for follow-up planning.
- Ask the connected assistant to help reason through next steps without automatically contacting anyone.

### Other workspace features
- Manual income and expense recording.
- CINEMATIC landing and BINAFSI-branded access screens.
- Floating AI access, Profile, Settings, and in-app confirmation dialogs.
- Reminder preferences and browser-session reminders where supported.

## Why Agent-Native?

BINAFSI uses the **Builder.io Agent-Native** framework so that chat is not just a decorative assistant beside the product. The application and the AI share authorized server-side actions and persisted records.

Examples of AI-accessible actions include:

| Action | Purpose |
| --- | --- |
| `binafsi-list-context` | Read saved context and schedule information |
| `binafsi-add-memory` | Save an explicitly requested memory |
| `binafsi-add-goal` | Create a measurable goal |
| `binafsi-add-commitment` | Save a commitment |
| `binafsi-propose-decision` | Generate scheduling alternatives |
| `binafsi-get-decision` | Read a saved Decision Twin proposal |
| `binafsi-preview-decision` | Inspect an alternative before any change |

AI-generated explanations help people understand the choices; deterministic planning and action validation enforce scheduling constraints. **The user approves consequential updates.**

## Demonstrated workflow

The core BINAFSI workflow has been exercised locally:

1. A user saves goals, memories, and commitments.
2. BINAFSI AI retrieves the actual saved context.
3. The user requests a scheduling change; the Decision Twin identifies conflicts and proposes alternatives.
4. The user previews a valid option, including before-and-after details.
5. The user explicitly approves it in the interface.
6. The updated schedule is visible in the Life Map.
7. The user can restore the original schedule through **History & Undo** when the safety checks permit.

The same workflow also rejects impossible changes—for example, when all affected commitments are protected.

## Technology

- **Framework:** Builder.io Agent-Native
- **UI:** React, TypeScript, Vite, React Router
- **AI connection:** Builder.io-managed model connection through Agent-Native
- **Authentication:** Better Auth as provided by Agent-Native
- **Data layer:** Agent-Native database integration and Drizzle
- **Local development storage:** PGlite
- **Planning:** Conflict detection, alternatives, protected-commitment safeguards, approval, and version-checked undo

## Run locally

### Requirements

- A Node.js version compatible with this project's Agent-Native dependencies
- Corepack / pnpm
- Required environment configuration for Agent-Native authentication and the chosen AI provider

```bash
# Clone the repository
git clone https://github.com/sharmainelerato-glitch/binafsi-agent-native.git
cd binafsi-agent-native

# Install dependencies
corepack pnpm install

# Generate route types and validate
corepack pnpm exec react-router typegen
corepack pnpm typecheck
corepack pnpm agent-native:doctor

# Start the development application
corepack pnpm dev
```

Follow the framework's configuration instructions to set up authentication, required environment variables, and the AI connection. A fresh clone does not include the original developer's local database, account, credentials, or AI authorization.

### Main routes

| Route | Description |
| --- | --- |
| `/binafsi-welcome` | Cinematic landing page |
| `/binafsi-access` | BINAFSI-branded account access |
| `/binafsi` | Main intelligence workspace |
| `/binafsi-opportunities` | Opportunity Companion |
| `/home` | Agent-Native Chat |

Local development commonly uses a URL such as `http://localhost:8080`, but use the actual address printed by the server.

## Privacy and human control

BINAFSI is designed around account-scoped data and explicit authorization for consequential actions. Its AI tools should not invent memories, fabricate event information, or quietly change protected commitments. Users can inspect decision previews and reject proposals before anything is applied.

**Never commit** `.env` files, API keys, local database directories, authentication sessions, or personal test records to a public repository.

## Current scope and limitations

This repository represents a **locally developed hackathon application**, not a fully verified multi-user production service.

- Public cross-device access requires deployment with shared hosted storage and production authentication configuration.
- Browser-based reminders are limited by browser/session support; reliable notifications with the browser closed require a background delivery system.
- The Opportunity Companion records and supports follow-up planning; automatic attendance detection, live event monitoring, and outreach are not implemented.
- BINAFSI does not automatically access bank accounts, calendars, email, or external personal accounts.
- AI latency depends on the selected model and the development environment.
- Production security, backups, accessibility, and mobile behavior need independent deployment validation.

## Hackathon demonstration

**Event:** Builder.io Agent-Native Hackathon 2026  
**Project:** BINAFSI — Living Intelligence for Real-Life Decisions  
**Demo video:** To be added  
**Live application:** Not yet publicly deployed

The demonstration focuses on a real **AI → context → decision → preview → human approval → undo** workflow, not a simulated chatbot response.

## Attribution

BINAFSI was built on the official **Builder.io Agent-Native Chat starter**. The framework, initial Chat experience, Better Auth integration, and third-party dependencies belong to their respective authors and maintainers. BINAFSI adds custom planning logic, application actions, screens, and integrated workflows for connected life decisions.

## Vision

BINAFSI's long-term direction is a more connected personal assistant: one that understands daily context, helps people adapt to change, and highlights opportunities without taking control away from them.

**BINAFSI — Your life, intelligently connected.**
