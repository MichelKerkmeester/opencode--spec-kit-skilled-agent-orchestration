---
title: "Feature Specification: Skill Graph Auto-Setup"
description: "Automatic skill graph creation on fresh install and auto-update when skills are added, removed, or modified."
trigger_phrases:
  - "007-skill-graph-auto-setup"
  - "skill graph auto setup"
  - "skill graph setup guide"
importance_tier: "important"
contextType: "planning"
---
# Feature Specification: Skill Graph Auto-Setup

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

Ensure the skill graph SQLite database is automatically created on first install and stays current when skills are added, removed, or modified. Add a setup guide for the skill advisor, a post-install initialization hook, and smart detection of unindexed state so users never have to manually run `skill_graph_scan` or `skill_graph_compiler.py`.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-04-13 |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `006-skill-graph-sqlite-migration` |

---

## 2. PROBLEM STATEMENT

After cloning the repo or adding a new skill, the skill graph SQLite database does not exist until the MCP server starts and runs a scan. This creates three gaps:

1. **Fresh install**: `skill-graph.sqlite` doesn't exist. The advisor falls back to JSON, which also doesn't exist if the user hasn't run the compiler. First query returns no graph boosts.
2. **New skill added**: A developer creates a new skill folder with `graph-metadata.json` but forgets to recompile or trigger a scan. The graph is stale until the next MCP server restart.
3. **No setup guide**: The skill advisor has no SET-UP_GUIDE.md explaining how to initialize, verify, and troubleshoot the graph.

---

## 3. SOLUTION DESIGN

### 3.1 Post-Install Initialization Script

Create `scripts/init-skill-graph.sh` that:
1. Checks if `skill-graph.sqlite` exists
2. If not, runs `skill_graph_compiler.py --export-json` to create the JSON fallback
3. Triggers `skill_graph_scan` via the MCP server if running, or creates the SQLite directly
4. Validates with `skill_graph_compiler.py --validate-only`
5. Reports health via `skill_advisor.py --health`

### 3.2 Lazy Auto-Initialization in Advisor

Update `skill_advisor.py` `_load_skill_graph()` to:
1. Try SQLite first (current behavior)
2. If SQLite missing AND JSON missing: auto-run compiler to generate JSON as emergency fallback
3. Log a warning suggesting `skill_graph_scan` for full SQLite indexing
4. Never silently fail -- always report what happened

### 3.3 MCP Server Startup Enhancement

Update `context-server.ts` startup to:
1. Check if `skill-graph.sqlite` exists on boot
2. If not, auto-create and populate during the startup scan (already partially implemented in Phase 006)
3. Log clearly: "Skill graph: created fresh (21 skills indexed)" vs "Skill graph: loaded existing (21 skills, 0 stale)"

### 3.4 New Skill Detection

When a new `graph-metadata.json` file appears (already watched by Chokidar from Phase 006):
1. Index the new skill into SQLite
2. Re-validate edge targets (new skill may be a target for existing edges)
3. Update compiled JSON if `--export-json` mode is configured
4. Log: "Skill graph: added new-skill-name (22 skills total)"

### 3.5 Setup Guide

Create `.opencode/skill/skill-advisor/SET-UP_GUIDE.md` (or update existing) with:
1. Prerequisites (Node.js, Python 3, MCP server built)
2. First-time setup steps
3. Verification commands (`--health`, `--validate-only`, regression suite)
4. Troubleshooting (missing SQLite, stale graph, broken edges)
5. Adding a new skill checklist

---

## 4. SCOPE

### In Scope
- `scripts/init-skill-graph.sh` initialization script
- `skill_advisor.py` lazy auto-init enhancement
- `context-server.ts` startup logging improvements
- New skill detection logging in the file watcher
- `SET-UP_GUIDE.md` for the skill advisor
- npm `postinstall` hook consideration

### Out of Scope
- Modifying the graph schema (done in Phase 006)
- Adding new MCP tools (done in Phase 006)
- Changing the per-skill metadata format

---

## 5. SUCCESS CRITERIA

- [ ] Fresh clone + `npm install` + MCP server start → `skill-graph.sqlite` auto-created
- [ ] `skill_advisor.py --health` works on fresh install without manual compilation
- [ ] Adding a new `graph-metadata.json` triggers automatic indexing within 3 seconds
- [ ] `SET-UP_GUIDE.md` covers setup, verification, and troubleshooting
- [ ] `init-skill-graph.sh` creates both SQLite and JSON from scratch

---

## 6. KEY FILES

| File | Action |
|------|--------|
| `.opencode/skill/skill-advisor/scripts/init-skill-graph.sh` | Create |
| `.opencode/skill/skill-advisor/SET-UP_GUIDE.md` | Update |
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Modify (lazy auto-init) |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | Modify (startup logging) |
