---
title: "SG-001 -- SQLite startup scan"
description: "This scenario validates SQLite startup scan for `SG-001`. It focuses on the live skill graph database appearing on startup and tracking all current metadata files."
---

# SG-001 -- SQLite startup scan

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SG-001`.

---

## 1. OVERVIEW

This scenario validates SQLite startup scan for `SG-001`. It focuses on the live skill graph database appearing on startup and tracking all current metadata files.

### Why This Matters

If the startup scan does not seed the SQLite store, the MCP graph tools and the advisor's SQLite-first runtime path begin in a degraded state.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `SG-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify MCP startup creates the live SQLite graph store and indexes the current metadata set
- Real user request: `"confirm the skill graph database is ready after MCP server startup"`
- Prompt: `As a SQLite graph validation operator, confirm the system-spec-kit MCP server startup scan created the live skill-graph.sqlite store and indexed the current graph metadata set. Verify the database file exists under .opencode/skill/system-spec-kit/mcp_server/database/skill-graph.sqlite and skill_graph_status reports 21 tracked skills with dbStatus "ready". Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: `skill-graph.sqlite` exists, `skill_graph_status` reports `totalSkills: 21`, and `dbStatus` is `ready`
- Pass/fail: PASS if the database file exists and the status tool reports 21 tracked skills; FAIL if the file is missing, the tracked count is lower, or the database is not ready

---

## 3. TEST EXECUTION

### Prompt

`As a SQLite graph validation operator, confirm the system-spec-kit MCP server startup scan created the live skill-graph.sqlite store and indexed the current graph metadata set. Verify the database file exists under .opencode/skill/system-spec-kit/mcp_server/database/skill-graph.sqlite and skill_graph_status reports 21 tracked skills with dbStatus "ready". Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `ls .opencode/skill/system-spec-kit/mcp_server/database/skill-graph.sqlite`
2. `skill_graph_status({})`

### Expected

The database file exists at `.opencode/skill/system-spec-kit/mcp_server/database/skill-graph.sqlite`. `skill_graph_status` reports `totalSkills` as `21`, `staleness.trackedSkills` as `21`, and `dbStatus` as `ready`.

### Evidence

Capture the file-existence check plus the full `skill_graph_status` payload, including the total skill count, staleness summary, and database status.

### Pass/Fail

- **Pass**: the SQLite database file exists and `skill_graph_status` reports 21 tracked skills with `dbStatus: "ready"`
- **Fail**: the database file is missing, the tracked count is lower than 21, or the status payload is not ready

### Failure Triage

Inspect startup scan wiring in `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`. Review `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts` for database initialization or indexing failures. Re-run `skill_graph_scan({})` and compare its scan summary with the status payload.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | Starts the non-blocking startup scan that seeds the live SQLite graph store |
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts` | Creates `skill-graph.sqlite` and indexes discovered `graph-metadata.json` files |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/status.ts` | Reports live node counts and readiness from the SQLite-backed store |

---

## 5. SOURCE METADATA

- Group: SQLite Graph
- Playbook ID: SG-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--sqlite-graph/001-sqlite-startup-scan.md`
