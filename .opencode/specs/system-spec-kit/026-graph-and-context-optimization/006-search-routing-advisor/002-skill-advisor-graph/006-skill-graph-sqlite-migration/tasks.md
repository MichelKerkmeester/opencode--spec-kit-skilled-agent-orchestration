---
title: "...h-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/006-skill-graph-sqlite-migration/tasks]"
description: "Task breakdown for 006-skill-graph-sqlite-migration."
trigger_phrases:
  - "006-skill-graph-sqlite-migration"
  - "tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/006-skill-graph-sqlite-migration"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Implemented SQLite migration with 4 MCP tools"
    next_safe_action: "Review and verify implementation"
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
---
# Tasks: Skill Graph SQLite Migration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Phase A: SQLite Schema + Indexer

- [ ] T001: Create `mcp_server/lib/skill-graph/skill-graph-db.ts` with schema, init, WAL mode
- [ ] T002: Implement `indexSkillMetadata()` -- discover, parse, validate, insert `graph-metadata.json` files
- [ ] T003: Implement content hashing for incremental scan (SHA-256 per file)
- [ ] T004: Create `mcp_server/lib/skill-graph/skill-graph-queries.ts` with 10 query functions

## Phase B: MCP Tool Handlers

- [ ] T005: Create `handlers/skill-graph/scan.ts` -- full reindex handler
- [ ] T006: Create `handlers/skill-graph/query.ts` -- structural query handler with 10 query types
- [ ] T007: Create `handlers/skill-graph/status.ts` -- health/stats handler
- [ ] T008: Create `handlers/skill-graph/validate.ts` -- validation handler
- [ ] T009: Register 4 tool definitions in `tool-schemas.ts`
- [ ] T010: Wire handlers in `context-server.ts`

## Phase C: Auto-Indexing

- [ ] T011: Add Chokidar watcher for `.opencode/skill/*/graph-metadata.json`
- [ ] T012: Implement debounced reindex (2s debounce)
- [ ] T013: Add async startup scan to MCP server initialization

## Phase D: Advisor Integration

- [ ] T014: Update `_load_skill_graph()` to read from SQLite
- [ ] T015: Update `_apply_graph_boosts()` to query edges from DB
- [ ] T016: Update `_apply_family_affinity()` to query family members from DB
- [ ] T017: Update `_apply_graph_conflict_penalty()` to query conflicts from DB
- [ ] T018: Update `health_check()` to use SQLite-backed status
- [ ] T019: Run regression suite -- 44/44 must pass

## Phase E: Bootstrap + Export

- [ ] T020: Add skill graph summary to session bootstrap injection
- [ ] T021: Add `--export-json` flag to `skill_graph_compiler.py`
- [ ] T022: Verify exported JSON matches current `skill-graph.json` structure
