---
title: "...ph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/006-skill-graph-sqlite-migration/spec]"
description: "Migrate the skill graph from static JSON files to a SQLite-backed store with MCP tools, aligning with the code graph and deep loop graph architecture patterns."
trigger_phrases:
  - "006-skill-graph-sqlite-migration"
  - "skill graph sqlite"
  - "skill graph mcp"
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
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level3-arch | v2.2 -->"
---
# Feature Specification: Skill Graph SQLite Migration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Migrate the skill graph from its current architecture (21 per-skill JSON files + compiled `skill-graph.json` + in-memory Python consumption) to a SQLite-backed store with dedicated MCP tools, following the same architectural patterns used by the Compact Code Graph (`code-graph.sqlite`) and the Deep Loop Graph (`deep-loop-graph.sqlite`). This unifies all five graph systems under a consistent storage + query model and enables real-time graph queries from any runtime without re-reading static files.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-04-13 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (011-skill-advisor-graph) |
| **Predecessor** | `005-repo-wide-path-migration` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM STATEMENT

The codebase has 5 graph systems but they use 3 different storage formats:

| Graph | Storage | Query Interface | Runtime Access |
|-------|---------|----------------|----------------|
| Code Graph | SQLite (`code-graph.sqlite`) | MCP tools (`code_graph_query`, `code_graph_scan`, etc.) | All runtimes via MCP |
| Memory Causal | SQLite (shared `context-index.sqlite`) | MCP tools (`memory_causal_link`, etc.) | All runtimes via MCP |
| Deep Loop Graph | SQLite (`deep-loop-graph.sqlite`) | MCP tools (`deep_loop_graph_upsert`, etc.) | All runtimes via MCP |
| **Skill Graph** | **JSON files** (21 per-skill + 1 compiled) | **Python `json.load()` + in-memory** | **Only `skill_advisor.py`** |
| Causal Graph (memory) | SQLite (shared) | MCP tools | All runtimes |

The skill graph is the only graph system that:
1. **Uses static JSON** instead of SQLite -- requires manual recompilation after any metadata change
2. **Has no MCP tools** -- invisible to agents, session bootstrap, and memory context
3. **Is only queryable from Python** -- other runtimes cannot traverse skill relationships
4. **Requires a separate compiler step** -- `skill_graph_compiler.py --validate-only` is a manual gate
5. **Cannot be queried structurally** -- no equivalent of "what depends on mcp-code-mode?" without parsing JSON

**Consequences:**
- Session bootstrap cannot inject skill topology context
- Agents cannot query skill relationships during routing decisions
- Graph staleness goes undetected until manual compilation
- No live validation -- weight band violations or broken edges persist until next compile
- Skill graph is architecturally inconsistent with every other graph in the system
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:solution -->
## 3. SOLUTION DESIGN

### 3.1 Storage: SQLite in `skill-graph.sqlite`

New dedicated database file alongside the others in `mcp_server/database/`:

```
database/
├── code-graph.sqlite                    # Structural code analysis
├── context-index.sqlite                 # Memory + causal graph
├── deep-loop-graph.sqlite               # Research/review convergence
└── skill-graph.sqlite                   # Skill relationships (NEW)
```

**Schema:**

```sql
CREATE TABLE skill_nodes (
  id TEXT PRIMARY KEY,                    -- skill_id (e.g., "sk-code-review")
  family TEXT NOT NULL,                   -- cli, mcp, sk-code, sk-deep, sk-util, system
  category TEXT NOT NULL,                 -- cli-orchestrator, mcp-tool, code-quality, etc.
  schema_version INTEGER NOT NULL,        -- 1 or 2
  domains TEXT,                           -- JSON array of domain strings
  intent_signals TEXT,                    -- JSON array of trigger phrases
  derived TEXT,                           -- JSON object (v2 derived metadata)
  source_path TEXT,                       -- path to graph-metadata.json
  content_hash TEXT,                      -- SHA-256 of source file for staleness
  indexed_at TEXT DEFAULT (datetime('now')),
  CONSTRAINT valid_family CHECK(family IN ('cli','mcp','sk-code','sk-deep','sk-util','system'))
);

CREATE TABLE skill_edges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_id TEXT NOT NULL REFERENCES skill_nodes(id),
  target_id TEXT NOT NULL REFERENCES skill_nodes(id),
  edge_type TEXT NOT NULL,                -- depends_on, enhances, siblings, conflicts_with, prerequisite_for
  weight REAL NOT NULL CHECK(weight >= 0.0 AND weight <= 1.0),
  context TEXT,                           -- human-readable edge context
  UNIQUE(source_id, target_id, edge_type),
  CHECK(source_id != target_id),
  CONSTRAINT valid_edge_type CHECK(edge_type IN ('depends_on','enhances','siblings','conflicts_with','prerequisite_for'))
);

CREATE TABLE skill_graph_metadata (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);
```

### 3.2 MCP Tools (4 tools)

Following the code graph and deep loop graph patterns:

| Tool | Purpose | Pattern Source |
|------|---------|---------------|
| `skill_graph_scan` | Index/reindex all `graph-metadata.json` files into SQLite | `code_graph_scan` |
| `skill_graph_query` | Structural queries: depends_on, enhances, family members, transitive paths, conflicts | `code_graph_query` |
| `skill_graph_status` | Health: node/edge counts, staleness, validation status, family distribution | `code_graph_status` |
| `skill_graph_validate` | Run weight band, symmetry, and schema validation against live DB data | New (replaces `--validate-only`) |

**Query types for `skill_graph_query`:**

| Query | Description |
|-------|-------------|
| `depends_on(skill_id)` | What does this skill depend on? |
| `dependents(skill_id)` | What depends on this skill? |
| `enhances(skill_id)` | What does this skill enhance? |
| `enhanced_by(skill_id)` | What enhances this skill? |
| `family_members(family)` | All skills in a family |
| `conflicts(skill_id)` | Conflicting skills |
| `transitive_path(from, to)` | Shortest relationship path between two skills |
| `hub_skills(min_inbound)` | Skills with high inbound edge count |
| `orphans()` | Skills with zero edges |
| `subgraph(skill_id, depth)` | N-hop neighborhood around a skill |

### 3.3 Auto-Indexing

Following the code graph pattern:

1. **Startup scan** -- index all `graph-metadata.json` files on MCP server boot (async, non-blocking)
2. **File watcher** -- Chokidar monitors `.opencode/skill/*/graph-metadata.json` with debounce, reindexes changed files
3. **Content hash** -- SHA-256 per file, skip unchanged files on incremental scan
4. **Validation on ingest** -- weight bands, edge targets, schema version checked at index time, not as a separate step

### 3.4 Advisor Integration

`skill_advisor.py` switches from `json.load(skill-graph.json)` to MCP tool queries:

- `_load_skill_graph()` → `skill_graph_query` (or direct SQLite if running in same process)
- `_apply_graph_boosts()` → query adjacency from SQLite instead of in-memory dict
- `health_check()` → `skill_graph_status` for graph health reporting

**Backwards compatibility:** Keep `skill-graph.json` generation as an optional export (`skill_graph_compiler.py --export-json`) for offline analysis and CI, but the runtime path uses SQLite.

### 3.5 Session Bootstrap Integration

Add skill graph summary to session bootstrap context:
- Inject skill topology (families, hub skills, edge count) alongside code graph health
- Enable agents to query "what skills work with X?" during planning
<!-- /ANCHOR:solution -->

---

<!-- ANCHOR:scope -->
## 4. SCOPE

### In Scope
- `skill-graph.sqlite` schema and database initialization
- 4 MCP tools: `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate`
- Auto-indexing with file watcher and content hashing
- TypeScript implementation in `mcp_server/lib/skill-graph/`
- MCP tool handlers in `mcp_server/handlers/skill-graph/`
- `skill_advisor.py` migration from JSON to SQLite/MCP queries
- Session bootstrap skill graph injection
- `skill_graph_compiler.py --export-json` for backwards-compatible JSON export
- Tool schema registration in `tool-schemas.ts`

### Out of Scope
- Removing per-skill `graph-metadata.json` files (these remain the source of truth, like source files for the code graph)
- Modifying the per-skill metadata schema (v1/v2 stays the same)
- Changing the deep loop graph or code graph schemas
- Modifying the memory causal graph
- UI or visualization for the skill graph
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:success -->
## 5. SUCCESS CRITERIA

- [ ] `skill-graph.sqlite` created on MCP server startup with all 21 skills indexed
- [ ] `skill_graph_scan` indexes all `graph-metadata.json` files with validation
- [ ] `skill_graph_query` supports all 10 query types with correct results
- [ ] `skill_graph_status` reports node/edge counts, staleness, and family distribution
- [ ] `skill_graph_validate` catches weight band violations, broken edge targets, and schema errors
- [ ] File watcher reindexes changed `graph-metadata.json` files automatically
- [ ] `skill_advisor.py` uses SQLite instead of `skill-graph.json` for runtime queries
- [ ] `skill_advisor.py --health` reports SQLite-backed graph status
- [ ] Session bootstrap includes skill graph topology summary
- [ ] 44/44 regression test cases still pass
- [ ] `skill_graph_compiler.py --export-json` still produces valid JSON output
<!-- /ANCHOR:success -->

---

<!-- ANCHOR:files -->
## 6. KEY FILES

| File | Action |
|------|--------|
| `mcp_server/lib/skill-graph/skill-graph-db.ts` | Create -- SQLite schema, indexer, query engine |
| `mcp_server/handlers/skill-graph/scan.ts` | Create -- MCP scan handler |
| `mcp_server/handlers/skill-graph/query.ts` | Create -- MCP query handler |
| `mcp_server/handlers/skill-graph/status.ts` | Create -- MCP status handler |
| `mcp_server/handlers/skill-graph/validate.ts` | Create -- MCP validation handler |
| `mcp_server/tool-schemas.ts` | Modify -- register 4 new tool definitions |
| `mcp_server/context-server.ts` | Modify -- initialize skill graph DB, wire handlers |
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Modify -- switch from JSON to SQLite queries |
| `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py` | Modify -- add `--export-json` flag, keep as CLI utility |
| `mcp_server/database/skill-graph.sqlite` | Create (runtime) -- auto-generated on startup |
<!-- /ANCHOR:files -->

---

<!-- ANCHOR:risks -->
## 7. RISKS

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| SQLite adds startup latency | Low | Startup 100-200ms slower | Async non-blocking scan, content hash skip |
| skill_advisor.py regression | Medium | Routing quality degraded | 44-case regression suite must pass before merge |
| MCP tool overhead vs JSON load | Low | Marginally slower per-query | Direct SQLite access when in same process; MCP for cross-runtime |
| File watcher resource usage | Low | Additional memory/CPU | Same chokidar pattern as code graph, proven at scale |
| Migration breaks CI workflows | Low | CI that depends on `skill-graph.json` breaks | Keep `--export-json` for backwards compatibility |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:decisions -->
## 8. KEY DECISIONS

| Decision | Rationale | Alternatives Considered |
|----------|-----------|------------------------|
| Separate `skill-graph.sqlite` (not shared DB) | Follows code graph pattern; independent lifecycle, no migration coupling | Shared with memory DB (rejected: different update frequency) |
| Keep `graph-metadata.json` as source of truth | Same pattern as source files for code graph; human-editable, version-controlled | SQLite-only (rejected: loses editability and git history) |
| 4 MCP tools (scan/query/status/validate) | Matches code graph tool surface; familiar to agents | Python-only API (rejected: not accessible from other runtimes) |
| Auto-indexing with file watcher | Matches code graph auto-indexing; no manual recompile step | Manual-only indexing (rejected: staleness risk) |
<!-- /ANCHOR:decisions -->
