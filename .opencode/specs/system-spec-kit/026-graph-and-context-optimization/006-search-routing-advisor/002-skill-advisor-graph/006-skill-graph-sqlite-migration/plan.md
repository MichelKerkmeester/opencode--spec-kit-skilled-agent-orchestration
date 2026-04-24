---
title: "...ph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/006-skill-graph-sqlite-migration/plan]"
description: "Implementation plan for migrating the skill graph from JSON to SQLite with MCP tools."
trigger_phrases:
  - "006-skill-graph-sqlite-migration"
  - "implementation"
  - "plan"
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
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: Skill Graph SQLite Migration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (MCP server), Python (advisor integration) |
| **Framework** | Spec Kit MCP server (`context-server.ts`), better-sqlite3 |
| **Storage** | SQLite (`skill-graph.sqlite`) |
| **Testing** | Existing regression harness + new MCP tool tests |
| **Pattern Source** | `code-graph-db.ts`, `coverage-graph-db.ts` |

### Overview
Migrate skill graph storage from static JSON to SQLite, add 4 MCP tools for querying, enable auto-indexing via file watcher, and update `skill_advisor.py` to consume the SQLite store.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Code graph SQLite pattern analyzed (`lib/code-graph/code-graph-db.ts`)
- [x] Deep loop graph SQLite pattern analyzed (`lib/coverage-graph/coverage-graph-db.ts`)
- [x] Current skill graph JSON schema documented (spec.md Section 3.1)
- [x] All 21 per-skill `graph-metadata.json` files identified
- [x] `skill_advisor.py` graph consumption points mapped (4 functions + health check)

### Definition of Done
- [ ] `skill-graph.sqlite` created on MCP server boot with 21 skills indexed
- [ ] 4 MCP tools registered and functional
- [ ] File watcher triggers reindex on `graph-metadata.json` changes
- [ ] `skill_advisor.py` uses SQLite, 44/44 regression cases pass
- [ ] Session bootstrap includes skill graph summary
- [ ] `--export-json` produces backwards-compatible output

---

## 3. APPROACH

### Phase A: SQLite Schema + Indexer (TypeScript)

1. Create `mcp_server/lib/skill-graph/skill-graph-db.ts`
   - Schema: `skill_nodes`, `skill_edges`, `skill_graph_metadata` tables
   - Follow `code-graph-db.ts` patterns: WAL mode, foreign keys, content hashing
   - `initDb()`, `indexSkillMetadata()`, `getDb()`
   - Parse `graph-metadata.json` v1/v2 into normalized rows
   - Weight band validation at ingest time (warn, don't reject)
   - Edge target validation (reject broken targets)

2. Create `mcp_server/lib/skill-graph/skill-graph-queries.ts`
   - Query functions: `dependsOn()`, `dependents()`, `enhances()`, `enhancedBy()`, `familyMembers()`, `conflicts()`, `transitivePath()`, `hubSkills()`, `orphans()`, `subgraph()`
   - Follow `code-graph-db.ts` query patterns with prepared statements

### Phase B: MCP Tool Handlers (TypeScript)

3. Create `mcp_server/handlers/skill-graph/scan.ts` -- full reindex
4. Create `mcp_server/handlers/skill-graph/query.ts` -- structural queries
5. Create `mcp_server/handlers/skill-graph/status.ts` -- health/stats
6. Create `mcp_server/handlers/skill-graph/validate.ts` -- validation checks
7. Register tools in `tool-schemas.ts` (4 new definitions)
8. Wire handlers in `context-server.ts`

### Phase C: Auto-Indexing (TypeScript)

9. Add Chokidar watcher for `.opencode/skill/*/graph-metadata.json`
10. Debounced reindex on file change (2s debounce, matching code graph)
11. Startup scan: async non-blocking, triggered from `context-server.ts` init

### Phase D: Advisor Integration (Python)

12. Update `_load_skill_graph()` to read from SQLite instead of JSON
13. Update `_apply_graph_boosts()` to query edges from DB
14. Update `_apply_family_affinity()` to query family members from DB
15. Update `_apply_graph_conflict_penalty()` to query conflicts from DB
16. Update `health_check()` to use SQLite status
17. Run regression suite: 44/44 must pass

### Phase E: Bootstrap + Export

18. Add skill graph summary to session bootstrap context
19. Update `skill_graph_compiler.py` with `--export-json` flag
20. Verify `--export-json` produces same structure as current `skill-graph.json`

---

## 4. RISKS

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Advisor regression from SQLite migration | Medium | Run full 44-case suite after each Phase D step |
| MCP server startup slowdown | Low | Async scan, content hash skip (same as code graph) |
| SQLite locking between advisor and MCP | Low | WAL mode handles concurrent readers; advisor is read-only |
| File watcher conflicts with code graph watcher | Low | Independent chokidar instances on different paths |

---

## 5. IMPLEMENTATION ORDER

```
Phase A (schema + indexer)     ─────────────────────┐
Phase B (MCP tools)            ─────────────────────┤
                                                     ├──► Phase D (advisor migration)
Phase C (auto-indexing)        ─────────────────────┘          │
                                                               ▼
                                                    Phase E (bootstrap + export)
```

Phases A-C can be developed in parallel. Phase D depends on A. Phase E depends on D.
