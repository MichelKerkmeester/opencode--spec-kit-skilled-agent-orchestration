# Iteration 002 — Track A: A2 — Scope of change detection

## Question
Which files and metadata surfaces should Phase 027 treat as change-detection inputs for the skill-graph auto-update daemon?

## Evidence Collected
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/deep-research-strategy.md:49` → Iteration 2 is mapped to "A2 Scope of change detection".
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/deep-research-strategy.md:105` → A2 evidence map requires reading `skill_graph_compiler.py`, grepping `generate-context.js` invocations, and inventorying SKILL.md frontmatter template fields.
- `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:50`-`.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:89` → The legacy compiler scans skill folders only for per-skill `graph-metadata.json` files and silently skips skills without one.
- `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:107`-`.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:179` → Validation requires `schema_version`, `skill_id`, `family`, `category`, `edges`, `domains`, and `intent_signals`, with schema v2 delegating `derived` validation.
- `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:189`-`.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:207` → Schema v2 derived metadata requires `trigger_phrases`, `key_topics`, `key_files`, `entities`, `source_docs`, `causal_summary`, `created_at`, and `last_updated_at`.
- `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:219`-`.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:242` → `derived.source_docs` must be skill-relative existing files, while `derived.key_files` must resolve to existing repo files under the repo root.
- `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:244`-`.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:267` → `derived.entities[*]` must include string `name`, `kind`, `path`, and `source`, and entity paths are validated as existing repo-root files.
- `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:575`-`.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:681` → Compiled output is built from parsed graph metadata: families, sparse adjacency, intent signals, reciprocal conflicts, hub skills, and topology warnings.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:320`-`.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:345` → The current TypeScript indexer recursively discovers files named `graph-metadata.json` under the skill directory.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:347`-`.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:379` → The TypeScript indexer parses only JSON graph metadata fields for each node: schema version, skill id, family, category, domains, intent signals, and derived metadata.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:448`-`.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:463` → The indexer describes its input as all discovered `graph-metadata.json` files and computes a SHA-256 content hash per file before parsing.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:489`-`.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:558` → Incremental skip logic compares stored `content_hash` and `source_path`; unchanged graph metadata files are skipped, while changed entries are upserted.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:558`-`.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:586` → Edges are deleted and reinserted only for changed metadata entries inside a transaction, with self-loop and unknown-target rejection.
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1510`-`.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1544` → The existing skill graph watcher builds its watch glob with `path.join(skillGraphSourceDir, '*', SKILL_GRAPH_METADATA_FILENAME)`, handles add/change/unlink/error, and schedules a debounced skill graph index.
- `.opencode/skill/sk-doc/assets/skill/skill_md_template.md:73`-`.opencode/skill/sk-doc/assets/skill/skill_md_template.md:90` → The SKILL.md creation template defines required frontmatter fields `name`, `description`, and `allowed-tools`, plus recommended `version`.
- `.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:111`-`.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:117` → The broader frontmatter reference says SKILL.md always needs `name`, `description`, and `allowed-tools`; optional fields include `tags`, `category`, and `version`.
- `.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:156`-`.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:167` → Frontmatter field summary adds `argument-hint` and `model` for commands, but SKILL.md only requires `name`, `description`, and `allowed-tools`.
- `.opencode/skill/sk-deep-research/SKILL.md:1`-`.opencode/skill/sk-deep-research/SKILL.md:10` → A real skill includes frontmatter plus body-level keyword comments; those fields are not read directly by either graph compiler/indexer path above.
- `.opencode/skill/sk-deep-research/graph-metadata.json:19`-`.opencode/skill/sk-deep-research/graph-metadata.json:24` → A real graph metadata file duplicates routing intent through `intent_signals` and a schema v2 `derived` block.
- `.opencode/skill/sk-deep-research/graph-metadata.json:25`-`.opencode/skill/sk-deep-research/graph-metadata.json:61` → The derived block contains trigger phrases, topics, and key files, including `SKILL.md` and other skill-local resources.
- `.opencode/skill/sk-deep-research/graph-metadata.json:119`-`.opencode/skill/sk-deep-research/graph-metadata.json:127` → The derived block records `source_docs` and `last_updated_at`, which implies derived metadata can go stale when source docs change without regenerating graph metadata.
- `AGENTS.md:52`-`AGENTS.md:53` → Full memory saves through `generate-context.js` handle DB indexing, embeddings, `description.json`, and `graph-metadata.json` refresh for spec packets.
- `AGENTS.md:225`-`AGENTS.md:228` → The Memory Save Rule distinguishes full `generate-context.js` saves, which refresh `graph-metadata.json` and `description.json`, from quick continuity frontmatter edits.
- `.opencode/command/memory/save.md:125`-`.opencode/command/memory/save.md:127` → `/memory:save` outputs canonical spec-doc continuity plus refreshed `graph-metadata.json` derived fields in the spec folder, using `generate-context.js`.
- `.opencode/command/memory/save.md:351`-`.opencode/command/memory/save.md:353` → The save workflow refreshes packet graph metadata with status fallback, sanitized `key_files`, deduplicated entities, capped trigger phrases, then auto-indexes touched canonical spec docs plus `graph-metadata.json`.
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1418`-`.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1455` → The canonical save workflow now unconditionally calls `refreshGraphMetadata()` so every canonical save refreshes packet graph metadata.
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1495`-`.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1526` → Step 11.5 re-indexes touched canonical spec documents after graph metadata refresh, reusing incremental indexing.
- `README.md:591` → The repo overview says each skill folder contains `graph-metadata.json`, the graph is stored in `skill-graph.sqlite`, it is auto-indexed on MCP startup and file changes, and the advisor reads SQLite first with compiled JSON fallback.

## Analysis
The direct graph index scope is already clear and should remain narrow: both the legacy compiler and the TypeScript SQLite indexer treat `graph-metadata.json` as the authoritative graph input, not `SKILL.md` or arbitrary skill resources. The compiler discovers only `graph-metadata.json`, validates its graph-facing fields, and emits families, adjacency, signals, conflicts, hubs, and warnings from that parsed JSON. The TypeScript indexer mirrors that authority, hashing the graph metadata file and using the hash plus source path to skip unchanged entries.

The broader change-detection question is where derived metadata comes from. Schema v2 `derived` fields explicitly point back to `SKILL.md`, source docs, key files, and entities. The frontmatter templates show that SKILL.md carries the discovery fields `name`, `description`, and `allowed-tools`, while a real skill also carries keyword comments and a body that can inform trigger phrases. Therefore, a daemon that only watches `graph-metadata.json` is sufficient for re-indexing already-refreshed graph facts, but it will not notice stale derived metadata when `SKILL.md`, referenced source docs, or referenced key files change without a graph metadata regeneration pass.

The packet-side `generate-context.js` workflow is an important precedent but not a direct skill-graph solution. It proves this codebase already separates source edits from metadata refresh: canonical saves refresh spec packet `graph-metadata.json` and then re-index touched spec docs. Phase 027 should copy that two-stage shape for skills: source-doc changes should schedule a derived-metadata refresh for that skill, and only the refreshed `graph-metadata.json` should feed the graph index transaction.

For implementation, the daemon should adopt a two-tier scope. Tier 1, adopt now: watch `.opencode/skill/*/graph-metadata.json` for add/change/unlink and run the existing incremental skill graph index. Tier 2, design as part of the A2/A3/B5 pipeline: watch `SKILL.md` and the current metadata's `derived.source_docs`/`derived.key_files` to mark a skill's derived metadata stale or regenerate it, but avoid watching every file under every skill folder by default. That keeps A1's watcher choice useful without turning the daemon into a broad repo watcher before the extraction/sync design is settled.

## Verdict
- **Call:** adopt_now
- **Confidence:** high
- **Rationale:** Adopt a narrow graph-index trigger on `graph-metadata.json` now, and pair it with a targeted derived-metadata invalidation scope for `SKILL.md`, `derived.source_docs`, and `derived.key_files`. Reject broad all-files skill-folder watching because the current graph readers do not consume arbitrary files directly.

## Dependencies
A1, A3, A4, A6, B1, B3, B5

## Open follow-ups
Later iterations should decide whether derived metadata refresh is implemented in the daemon itself or delegated to a separate advisor extraction pipeline. A3 must confirm whether per-skill selective refresh can reuse the current content-hash/index transaction model. B5 should align freshness triggers for auto-derived advisor keywords with this two-tier file scope.

## Metrics
- newInfoRatio: 0.78
- dimensions_advanced: [A]
