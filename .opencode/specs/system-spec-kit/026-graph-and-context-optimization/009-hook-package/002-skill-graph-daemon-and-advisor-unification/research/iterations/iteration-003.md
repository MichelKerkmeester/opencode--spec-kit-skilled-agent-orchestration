# Iteration 003 — Track A: A3 — Incremental vs full re-index

## Question
Should Phase 027 use incremental or full skill-graph re-indexing for the auto-update daemon, and does the current stack support per-skill selective recompile against `skill-graph.sqlite`?

## Evidence Collected
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/deep-research-strategy.md:50` → Iteration 3 is mapped to "A3 Incremental vs full re-index".
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/deep-research-strategy.md:106` → A3 evidence map asks whether `skill_graph_compiler.py` supports per-skill selective recompile and requires `skill-graph.sqlite` schema inspection.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-002.md:52` → A2 concluded that the daemon should watch `.opencode/skill/*/graph-metadata.json` and let A3 confirm whether per-skill selective refresh can reuse the current hash/index transaction model.
- `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:7`-`.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:15` → The legacy compiler describes only scan/validate/export modes for compiling all skill folders into one `skill-graph.json`.
- `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:50`-`.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:89` → Legacy discovery iterates every skill folder under `SKILLS_DIR`, reads each `graph-metadata.json`, and skips folders without one; there is no file/path/skill filter in discovery.
- `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:575`-`.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:681` → `compile_graph()` builds one aggregate JSON object from the full `all_metadata` list: families, adjacency, signals, conflicts, hubs, and warnings.
- `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:688`-`.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:713` → The CLI arguments are `--validate-only`, `--output`, `--pretty`, and `--export-json`; none accepts a changed skill, changed file, or force/incremental mode.
- `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:715`-`.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:778` → The CLI always discovers all metadata, validates every discovered skill, validates graph-wide topology, then compiles the whole graph.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:81`-`.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:85` → The TypeScript SQLite path defines `skill-graph.sqlite` and treats `graph-metadata.json` as the skill metadata filename.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:118`-`.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:159` → The schema stores `skill_nodes` with unique `source_path`, `content_hash`, and `indexed_at`; `skill_edges` has cascading foreign keys and unique `(source_id, target_id, edge_type)`; indexes include `idx_skill_nodes_hash`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:316`-`.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:344` → The SQLite indexer computes SHA-256 content hashes and recursively discovers sorted `graph-metadata.json` files.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:448`-`.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:455` → The indexer explicitly documents that unchanged SHA-256 files are skipped and missing source rows are deleted before neighboring files are skipped.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:489`-`.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:555` → Inside one transaction, existing rows are compared by `content_hash` and `source_path`; unchanged entries increment `skippedFiles`, while changed entries are upserted and collected for edge refresh.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:558`-`.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:586` → Only changed entries have their outgoing edges deleted and reinserted; self-loops and unknown targets are rejected during that changed-entry pass.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:588`-`.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:603` → The scan summary reports scanned, indexed, skipped, rejected, and deleted counts, then records `last_scan_summary` metadata.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:625`-`.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:635` → `skill_graph_scan` is described as indexing or re-indexing all `.opencode/skill/*/graph-metadata.json` files with the hash-aware SQLite indexer, but its input schema only accepts `skillsRoot`.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:23`-`.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:43` → The MCP scan handler resolves `skillsRoot`, guards against workspace escape, and calls `indexSkillMetadata(skillsRoot)`; it does not expose `force`, `full`, or per-skill parameters.
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1495`-`.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1508` → Skill graph scans are debounced and startup scan calls reuse `runSkillGraphIndex`, making repeated incremental scans the normal daemon path.
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1510`-`.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1544` → The watcher observes only `*/graph-metadata.json` under the skill root, schedules scans on add/change/unlink, and includes the changed skill folder name in the trigger string.
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:2119`-`.opencode/skill/system-spec-kit/mcp_server/context-server.ts:2123` → Server startup schedules `startupSkillGraphScan()` in the background.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/status.ts:83`-`.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/status.ts:120` → Status reads every node's `source_path`, `content_hash`, and `indexed_at`, summarizes source staleness, and reports `dbStatus` as ready when skills exist.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/status.ts:133`-`.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/status.ts:173` → Staleness detection recomputes each source file hash and reports changed or missing source files by skill id.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/validate.ts:40`-`.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/validate.ts:119` → Live validation reads the SQLite nodes and edges and checks schema support, broken edges, dependency cycles, weight bands, symmetry, reciprocal weights, and orphans.
- `.opencode/skill/system-spec-kit/mcp_server/database/skill-graph.sqlite:sqlite_schema` → Direct SQLite inspection confirms tables `schema_version`, `skill_graph_metadata`, `skill_edges`, and `skill_nodes`; `skill_nodes` includes `source_path`, `content_hash`, and `indexed_at`, and `skill_edges` references `skill_nodes` with `ON DELETE CASCADE`.
- `.opencode/skill/system-spec-kit/mcp_server/database/skill-graph.sqlite:skill_graph_metadata` → Direct SQLite inspection shows the latest `last_scan_summary` was `{"scannedFiles":21,"indexedFiles":0,"skippedFiles":21,"indexedNodes":0,"indexedEdges":0,"rejectedEdges":0,"deletedNodes":0,"warnings":[]}`, demonstrating the existing no-change fast path.
- `.opencode/skill/system-spec-kit/mcp_server/database/skill-graph.sqlite:skill_nodes` → Direct SQLite inspection found 21 nodes, 67 edges, and 64-character hashes for sampled skill metadata rows, matching SHA-256 storage expectations.

## Analysis
The old Python compiler should not be the Phase 027 daemon's re-index engine. It can validate and compile the whole legacy JSON graph, but its control surface is explicitly all-discovered-skills: discovery loops every skill folder, validation walks the complete metadata set, and the CLI has no changed-skill or changed-file argument. That means any "per-skill selective recompile" bolted onto this path would be new design work rather than reuse.

The TypeScript SQLite indexer is already closer to the desired daemon shape. It still discovers and parses all `graph-metadata.json` files on each scan, so it is not yet path-scoped in the strictest sense, but it is hash-aware at the write boundary: unchanged rows are skipped, changed rows are upserted, and only changed nodes have outgoing edges rebuilt. The schema is also designed for incremental correctness because `source_path` is unique, `content_hash` is indexed, and edge rows cascade when source nodes disappear.

For Phase 027, "incremental" should mean hash-aware incremental SQLite indexing as the default on startup and watcher events, not a full rebuild of every node and edge. A full re-index should remain an explicit recovery/administrative path for schema migrations, suspected DB corruption, or validation/staleness repair. The current MCP tool lacks `force` or per-skill options, so adding those would be useful but not required for the first daemon slice; the existing scan already avoids DB churn on no-change runs.

The remaining nuance is that the watcher trigger includes the changed skill folder name but the handler discards that specificity and rescans the whole skill root. Given the current repo size (21 indexed skills) and the evidence from `last_scan_summary` that unchanged rows skip cleanly, this is acceptable for adoption now. A later A6 performance pass can decide whether to prototype a true path-scoped `indexSkillMetadataFiles([paths])` API once the daemon is watching more than `graph-metadata.json`.

## Verdict
- **Call:** adopt now
- **Confidence:** high
- **Rationale:** Use the existing TypeScript SQLite hash-aware incremental indexer as the daemon default, with full re-index reserved for explicit recovery or schema-maintenance workflows. Do not extend the legacy Python compiler for selective recompile; add a future force/path-scoped TS API only if A6 measurements show the all-root scan is too costly.

## Dependencies
A1, A2, A4, A6, A8, B5, D5

## Open follow-ups
A4 should confirm the transaction contract for watcher-triggered updates and recovery scans. A6 should profile whether parsing all 21 current files, and a larger projected skill corpus, is cheap enough or whether true changed-path indexing is worth prototyping. A8 should define when validation/staleness failure escalates from incremental retry to full re-index or DB rebuild.

## Metrics
- newInfoRatio: 0.74
- dimensions_advanced: [A]
