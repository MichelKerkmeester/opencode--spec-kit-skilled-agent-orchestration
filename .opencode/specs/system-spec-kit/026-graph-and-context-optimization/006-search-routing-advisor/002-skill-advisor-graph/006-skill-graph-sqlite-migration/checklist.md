---
title: "...d-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/006-skill-graph-sqlite-migration/checklist]"
description: "Verification checklist for 006-skill-graph-sqlite-migration."
trigger_phrases:
  - "006-skill-graph-sqlite-migration"
  - "verification"
  - "checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/006-skill-graph-sqlite-migration"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Implemented SQLite migration with 4 MCP tools"
    next_safe_action: "Review and verify implementation"
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
---
# Verification Checklist: Skill Graph SQLite Migration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | HARD BLOCKER | Cannot claim done until complete |
| **P1** | Required | Complete or explicitly defer with rationale |
| **P2** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:schema -->
## SQLite Schema (P0)

- [ ] CHK-001: `skill-graph.sqlite` is created on MCP server startup in `database/` directory [EVIDENCE: file exists after boot]
- [ ] CHK-002: `skill_nodes` table contains all 21 skill entries after startup scan [EVIDENCE: `SELECT COUNT(*) FROM skill_nodes` = 21]
- [ ] CHK-003: `skill_edges` table contains all edges from per-skill metadata [EVIDENCE: edge count matches sum of all `graph-metadata.json` edge arrays]
- [ ] CHK-004: `family` column constraint rejects values outside allowed enum [EVIDENCE: INSERT with invalid family raises constraint error]
- [ ] CHK-005: `edge_type` column constraint rejects values outside 5 allowed types [EVIDENCE: INSERT with invalid type raises constraint error]
- [ ] CHK-006: `weight` column constraint enforces [0.0, 1.0] range [EVIDENCE: INSERT with 1.5 raises constraint error]
- [ ] CHK-007: Self-loop constraint rejects `source_id = target_id` [EVIDENCE: INSERT with same source/target raises constraint error]
- [ ] CHK-008: Foreign key constraint rejects edges referencing non-existent skills [EVIDENCE: INSERT with missing target_id raises constraint error]
- [ ] CHK-009: WAL journal mode is enabled [EVIDENCE: `PRAGMA journal_mode` returns `wal`]
- [ ] CHK-010: Foreign keys are enforced [EVIDENCE: `PRAGMA foreign_keys` returns `1`]
<!-- /ANCHOR:schema -->

---

<!-- ANCHOR:indexer -->
## Indexer (P0)

- [ ] CHK-011: `indexSkillMetadata()` discovers all 21 `graph-metadata.json` files under `.opencode/skill/` [EVIDENCE: scan log reports 21 files]
- [ ] CHK-012: Schema v1 and v2 metadata files are both parsed correctly [EVIDENCE: v1 skills indexed without `derived`, v2 skills indexed with `derived`]
- [ ] CHK-013: Content hash (SHA-256) is stored per skill node [EVIDENCE: `content_hash` column populated for all rows]
- [ ] CHK-014: Incremental scan skips unchanged files [EVIDENCE: second scan with no file changes reports 0 reindexed]
- [ ] CHK-015: Weight band violations are logged as warnings during ingest [EVIDENCE: inserting edge with `enhances: 0.9` produces warning]
- [ ] CHK-016: Broken edge targets are rejected during ingest [EVIDENCE: edge referencing non-existent `skill_id` produces error]
<!-- /ANCHOR:indexer -->

---

<!-- ANCHOR:mcp-tools -->
## MCP Tools (P0)

- [ ] CHK-020: `skill_graph_scan` triggers full reindex and returns node/edge counts [EVIDENCE: tool output includes `nodesIndexed: 21`]
- [ ] CHK-021: `skill_graph_query` supports all 10 query types [EVIDENCE: each query type returns expected results for known test cases]
- [ ] CHK-022: `skill_graph_query("depends_on", "mcp-figma")` returns `mcp-code-mode` [EVIDENCE: tool output]
- [ ] CHK-023: `skill_graph_query("family_members", "cli")` returns cli-claude-code, cli-codex, cli-copilot, cli-gemini [EVIDENCE: tool output]
- [ ] CHK-024: `skill_graph_query("hub_skills")` returns skills with above-median inbound edges [EVIDENCE: matches current compiled graph hub list]
- [ ] CHK-025: `skill_graph_query("orphans")` returns sk-deep-research, sk-git [EVIDENCE: matches current zero-edge warnings]
- [ ] CHK-026: `skill_graph_query("transitive_path", "mcp-figma", "system-spec-kit")` returns a valid path [EVIDENCE: non-empty path result]
- [ ] CHK-027: `skill_graph_status` returns node count, edge count, family distribution, and staleness info [EVIDENCE: tool output includes all fields]
- [ ] CHK-028: `skill_graph_validate` catches weight band violations [EVIDENCE: after inserting out-of-band weight, validate reports it]
- [ ] CHK-029: `skill_graph_validate` catches missing edge targets [EVIDENCE: after removing a skill node, validate reports broken edges]
- [ ] CHK-030: All 4 tools are registered in `tool-schemas.ts` [EVIDENCE: grep for `skill_graph_` in tool-schemas.ts returns 4 definitions]
- [ ] CHK-031: All 4 tools are wired in `context-server.ts` [EVIDENCE: grep for `skill_graph` handler registration]
<!-- /ANCHOR:mcp-tools -->

---

<!-- ANCHOR:auto-indexing -->
## Auto-Indexing (P1)

- [ ] CHK-040: File watcher activates on MCP server startup [EVIDENCE: startup log includes skill graph watcher initialization]
- [ ] CHK-041: Modifying a `graph-metadata.json` file triggers reindex within 3 seconds [EVIDENCE: modify file, observe reindex log within debounce window]
- [ ] CHK-042: Creating a new `graph-metadata.json` triggers index addition [EVIDENCE: add new file, observe new skill node in DB]
- [ ] CHK-043: Deleting a `graph-metadata.json` triggers index removal [EVIDENCE: remove file, observe skill node removed from DB]
- [ ] CHK-044: Startup scan is async and non-blocking [EVIDENCE: MCP server responds to other tool calls while scan is running]
- [ ] CHK-045: Watcher does not conflict with code graph watcher [EVIDENCE: both watchers run simultaneously without errors]
<!-- /ANCHOR:auto-indexing -->

---

<!-- ANCHOR:advisor-integration -->
## Advisor Integration (P0)

- [ ] CHK-050: `skill_advisor.py` no longer reads `skill-graph.json` at runtime [EVIDENCE: grep for `skill-graph.json` in `_load_skill_graph` returns no matches]
- [ ] CHK-051: `_apply_graph_boosts()` produces same boost values from SQLite as from JSON [EVIDENCE: diff advisor output for 5 test queries before/after migration]
- [ ] CHK-052: `_apply_family_affinity()` produces same results from SQLite [EVIDENCE: family boost output unchanged for test queries]
- [ ] CHK-053: `_apply_graph_conflict_penalty()` reads conflicts from SQLite [EVIDENCE: code review confirms DB query path]
- [ ] CHK-054: `--health` reports `skill_graph_loaded: true` with SQLite-backed data [EVIDENCE: health output]
- [ ] CHK-055: `--health` reports `skill_graph_source: sqlite` (not `json`) [EVIDENCE: health output includes source field]
- [ ] CHK-056: 44/44 regression test cases pass after migration [EVIDENCE: regression suite output `overall_pass: true`]
- [ ] CHK-057: All 12 P0 regression cases pass [EVIDENCE: `p0_pass_rate: 1.0`]
- [ ] CHK-058: Graph boost reasons still appear in output (e.g., `!graph:depends(...)`) [EVIDENCE: query "use figma" shows graph reason]
- [ ] CHK-059: Graceful degradation when `skill-graph.sqlite` is missing [EVIDENCE: advisor returns results with graph boosts disabled, no crash]
<!-- /ANCHOR:advisor-integration -->

---

<!-- ANCHOR:bootstrap -->
## Session Bootstrap (P1)

- [ ] CHK-060: Session bootstrap includes skill graph summary [EVIDENCE: bootstrap output contains skill topology section]
- [ ] CHK-061: Skill graph summary includes family distribution [EVIDENCE: output shows 6 families with member counts]
- [ ] CHK-062: Skill graph summary includes hub skills list [EVIDENCE: output shows hub skills]
- [ ] CHK-063: Skill graph summary includes edge count and staleness [EVIDENCE: output shows total edges and last scan time]
<!-- /ANCHOR:bootstrap -->

---

<!-- ANCHOR:export -->
## Backwards Compatibility (P1)

- [ ] CHK-070: `skill_graph_compiler.py --export-json` produces valid JSON [EVIDENCE: output parses as valid JSON]
- [ ] CHK-071: Exported JSON structure matches current `skill-graph.json` schema [EVIDENCE: same top-level keys: schema_version, generated_at, skill_count, families, adjacency, signals, conflicts, hub_skills]
- [ ] CHK-072: Exported JSON `skill_count` matches SQLite node count [EVIDENCE: values are equal]
- [ ] CHK-073: `--validate-only` still works as a CLI surface [EVIDENCE: exit code 0 with current metadata]
<!-- /ANCHOR:export -->

---

<!-- ANCHOR:architecture -->
## Architecture Alignment (P2)

- [ ] CHK-080: `skill-graph.sqlite` is stored in same `database/` directory as other graph DBs [EVIDENCE: `ls database/` shows file]
- [ ] CHK-081: Schema follows code graph naming conventions (table names, column types) [EVIDENCE: code review comparison]
- [ ] CHK-082: MCP tool naming follows existing patterns (`skill_graph_*` matches `code_graph_*`) [EVIDENCE: tool-schemas.ts review]
- [ ] CHK-083: File watcher follows code graph debounce pattern (2s) [EVIDENCE: code review of watcher config]
- [ ] CHK-084: Error handling follows code graph patterns (graceful degradation, no crash) [EVIDENCE: code review of error paths]
- [ ] CHK-085: Database is gitignored [EVIDENCE: `.gitignore` includes `skill-graph.sqlite` pattern]
<!-- /ANCHOR:architecture -->
