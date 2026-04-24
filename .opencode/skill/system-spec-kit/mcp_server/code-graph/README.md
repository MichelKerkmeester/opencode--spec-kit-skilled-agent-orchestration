---
title: "Code Graph Subsystem"
description: "Structural code graph indexer, query handlers, scan-scope defaults, and context-surface contracts for the Spec Kit Memory MCP server."
trigger_phrases:
  - "code graph subsystem"
  - "code graph indexer"
  - "structural indexer"
  - "code graph scan defaults"
  - "code graph surfaces"
  - "code graph readme"
---

# Code Graph Subsystem

> Structural code graph for the Spec Kit Memory MCP server. Indexes functions, classes, imports, and call edges into SQLite for `code_graph_*` MCP tools and OpenCode plugin context surfaces.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. CONTEXT SURFACES](#3--context-surfaces)
- [4. SCAN DEFAULTS](#4--scan-defaults)
- [5. RELATED DOCUMENTS](#5--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This folder contains the structural code graph subsystem. It walks a workspace, parses source files via tree-sitter or the shipped regex fallback, and persists nodes (functions, classes, modules) and edges (calls, imports, contains, type_of) into a SQLite database. The graph backs the `code_graph_scan`, `code_graph_query`, `code_graph_status`, and `code_graph_context` MCP tools, and feeds the structural-context payload consumed by both MCP `session_bootstrap` and the OpenCode `compact-code-graph` plugin.

### Subsystem Statistics (current schema)

| Aspect | Value | Notes |
|---|---|---|
| Schema version | 3 | See `lib/code-graph-db.ts` |
| Node kinds | class, enum, export, function, import, interface, method, module, parameter, type_alias, variable | 11 kinds |
| Edge types | CALLS, CONTAINS, DECORATES, EXPORTS, EXTENDS, IMPLEMENTS, IMPORTS, OVERRIDES, TESTED_BY, TYPE_OF | 10 edge types |
| Default scan extensions | `.ts`, `.tsx`, `.js`, `.jsx`, `.py`, `.sh` | See `lib/indexer-types.ts` |
| Default scan excludes | `node_modules`, `dist`, `.git`, `vendor`, `z_future`, `z_archive`, `mcp-coco-index/mcp_server` | Plus `.gitignore` awareness (packet 012) |
| Database file | `database/code-graph.sqlite` (sibling to MCP server) | Backed by better-sqlite3 |

### Key Capabilities

| Capability | Description |
|---|---|
| **Dual parser backends** | Tree-sitter by default plus `SPECKIT_PARSER=regex` fallback via `lib/tree-sitter-parser.ts` and `lib/structural-indexer.ts` |
| **Incremental scan** | Skip unchanged files via mtime + content-hash check (`lib/structural-indexer.ts`); explicit full scans pass `IndexFilesOptions { skipFreshFiles: false }` |
| **`.gitignore` awareness** | Walks honor `.gitignore` patterns via the `ignore` package, with per-directory caching (packet 012) |
| **Stale-graph highlights** | Structural snapshots compute top-called function highlights even when graph status is `stale` (packet 012) |
| **Working set tracking** | Recently-touched file tracking for fresh-context retrieval (`lib/working-set-tracker.ts`) |
| **Budget allocation** | Token budget enforcement on context payloads (`lib/budget-allocator.ts`) |
| **Readiness contract** | Trust state probing (`live` / `stale` / `missing`) via `lib/readiness-contract.ts` |
| **Status diagnostics** | `code_graph_status` returns readiness, parse-health, and `graphQualitySummary` for operator-visible health checks |
| **Blocked read contract** | `code_graph_context` returns a structured `status:"blocked"` payload when a broader full scan is required before graph answers can be trusted |
| **Startup transport metadata** | `buildStartupBrief()` carries `graphQualitySummary` plus shared-payload provenance for hook/runtime startup surfaces |
| **Staged persistence** | Shared `persistIndexedFileResult()` keeps files stale until nodes and edges land (`lib/ensure-ready.ts`) |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:structure -->
## 2. STRUCTURE

```
code-graph/
├── README.md                       # This file
├── lib/                            # Core implementation
│   ├── README.md                   # Library overview
│   ├── code-graph-db.ts            # SQLite schema, getStats(), highlight queries
│   ├── code-graph-context.ts       # Context payload assembly
│   ├── structural-indexer.ts       # Directory walk + parse + persist
│   ├── tree-sitter-parser.ts       # Language detection + AST extraction
│   ├── indexer-types.ts            # DEFAULT_EXCLUDE_PATHS, file-type filters
│   ├── compact-merger.ts           # Token-bounded compaction
│   ├── budget-allocator.ts         # Context size budgets
│   ├── ensure-ready.ts             # Readiness probe + lazy refresh
│   ├── readiness-contract.ts       # Trust state taxonomy
│   ├── ops-hardening.ts            # Query timeout + retry guards
│   ├── query-intent-classifier.ts  # Intent routing for queries
│   ├── runtime-detection.ts        # Runtime context detection
│   ├── seed-resolver.ts            # Seed-node resolution for traversal
│   ├── startup-brief.ts            # Full-payload session startup brief
│   ├── working-set-tracker.ts      # Recently-touched files
│   └── index.ts                    # Library entry point
├── handlers/                       # MCP tool handlers
│   ├── README.md                   # Handler overview
│   ├── scan.ts                     # code_graph_scan
│   ├── query.ts                    # code_graph_query
│   ├── status.ts                   # code_graph_status
│   ├── context.ts                  # code_graph_context
│   ├── ccc-status.ts               # CocoIndex status bridge
│   ├── ccc-reindex.ts              # CocoIndex reindex bridge
│   ├── ccc-feedback.ts             # CocoIndex feedback bridge
│   └── index.ts                    # Handler registry
├── tests/                          # vitest suites
│   ├── code-graph-indexer.vitest.ts
│   ├── code-graph-scan.vitest.ts
│   ├── code-graph-context-handler.vitest.ts
│   ├── code-graph-query-handler.vitest.ts
│   ├── code-graph-ops-hardening.vitest.ts
│   ├── code-graph-seed-resolver.vitest.ts
│   └── code-graph-siblings-readiness.vitest.ts
└── tools/                          # Auxiliary tooling
    ├── code-graph-tools.ts
    └── index.ts
```

### Key Files

| File | Purpose |
|---|---|
| `lib/structural-indexer.ts` | Directory walk, file parsing, DB persistence, gitignore filtering |
| `lib/indexer-types.ts` | `DEFAULT_EXCLUDE_PATHS` constant, scan-config types |
| `lib/code-graph-db.ts` | SQLite schema (`schemaVersion: 3`), `getStats()`, `getStartupHighlights()` SQL |
| `lib/tree-sitter-parser.ts` | Language detection, AST traversal, node/edge extraction |
| `handlers/scan.ts` | `code_graph_scan` MCP handler — entry point for fresh + incremental scans |
| `handlers/status.ts` | `code_graph_status` MCP handler — totals, freshness, parseHealth |
| `handlers/context.ts` | `code_graph_context` MCP handler — context-window-bounded retrieval |
| `handlers/query.ts` | `code_graph_query` MCP handler — graph traversal queries |

Shared regression coverage for the migrated runtime also lives in the parent `mcp_server/tests/` suite. Current examples include `tests/tree-sitter-parser.vitest.ts`, `tests/structural-contract.vitest.ts`, and `tests/ensure-ready.vitest.ts`.

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:context-surfaces -->
## 3. CONTEXT SURFACES

The subsystem now exposes three operator-visible contract families: `code_graph_status`, `code_graph_context`, and startup/compaction payloads. They share the readiness vocabulary (`readiness`, `canonicalReadiness`, `trustState`) but now also surface graph-quality and structured transport metadata that were not present in the older counts-only/readiness overview.

### Status and Readiness Surfaces

| Surface | Status shape | Key fields | Notes |
|---|---|---|---|
| **`code_graph_status`** | `status: "ok"` | `freshness`, `readiness`, `canonicalReadiness`, `trustState`, `parseHealth`, `graphQualitySummary` | Primary operator health probe; keeps counts plus parser/enrichment quality in one response |
| **`code_graph_context` (success path)** | `status: "ok"` | `readiness`, `canonicalReadiness`, `trustState`, `lastPersistedAt`, `anchors`, `graphContext`, `textBrief`, `metadata`, `graphMetadata` | Context reads always echo readiness so callers can judge freshness and detector provenance alongside the returned neighborhood |
| **`code_graph_context` (blocked path)** | `status: "blocked"` | `blocked`, `degraded`, `graphAnswersOmitted`, `requiredAction`, `blockReason`, `readiness`, `canonicalReadiness`, `trustState`, `lastPersistedAt` | Returned when readiness requires a full scan and inline full scans are disallowed; callers should run `code_graph_scan` before retrying |

### Structured Context Metadata

`code_graph_context` success payloads now carry structured metadata instead of a text-only readiness hint.

| Field group | Contents | Why it matters |
|---|---|---|
| `metadata.partialOutput` | `isPartial`, `reasons`, `omittedSections`, `omittedAnchors`, `truncatedText` | Explains whether deadline or budget pressure trimmed the response |
| `metadata.freshness` | `lastScanAt`, `staleness` | Separates context freshness from the higher-level readiness block |
| `graphMetadata` | `detectorProvenance` | Makes parser/detector provenance visible to downstream callers without re-querying status |
| `anchors[*]` | `source`, `provider`, `score`, `snippet`, `range` | Preserves seed provenance so CocoIndex/manual/graph-sourced anchors stay traceable |

### Startup and Compaction Payloads

The structural snapshot reaches startup and compaction consumers through shared startup payloads.

| Surface | Includes summary | Includes highlights | Structured metadata | Typical caller |
|---|---|---|---|---|
| **MCP `session_bootstrap` / `startup-brief`** | Yes | Yes | `graphSummary`, `graphQualitySummary`, `graphState`, `sharedPayload`, `sharedPayloadTransport` | MCP clients calling the startup or bootstrap surface directly |
| **OpenCode plugin compact-code-graph `--minimal` resume** | Yes | Yes (including stale graphs after packet 012) | Reuses the shared snapshot payload while keeping `RESUME_MODE = 'minimal'` for token economy | OpenCode TUI session compaction |

`buildStartupBrief()` returns both human-readable and transport-friendly shapes:

| Field | Shape | Notes |
|---|---|---|
| `graphQualitySummary` | `detectorProvenanceSummary`, `graphEdgeEnrichmentSummary` | Mirrors the quality summary emitted by `code_graph_status` |
| `sharedPayload` | shared envelope with `kind`, `summary`, `sections`, `provenance` | Canonical structured context for hook-capable runtimes |
| `sharedPayloadTransport` | compact JSON with `kind`, `summary`, `provenance`, `sectionKeys` | Lightweight startup digest for transports that do not need full section bodies |
| `provenance` | `producer`, `sourceSurface`, `trustState`, `generatedAt`, `lastUpdated`, `sourceRefs` | Preserves startup-quality/source metadata across runtime boundaries |

### Surface Citations

| Aspect | Source | Notes |
|---|---|---|
| Status quality summary | `handlers/status.ts` | `code_graph_status` includes `parseHealth` and `graphQualitySummary` in the public payload |
| Blocked read contract | `handlers/context.ts` | `status:"blocked"` payload names `requiredAction`, `graphAnswersOmitted`, readiness, and persisted timestamp |
| Partial-output metadata | `lib/code-graph-context.ts` | `metadata.partialOutput` tracks deadline/budget truncation with omitted section/anchor counts |
| Startup quality + transport | `lib/startup-brief.ts` | `buildStartupBrief()` returns `graphQualitySummary`, `sharedPayload`, and `sharedPayloadTransport` |
| Shared payload provenance | `mcp_server/lib/context/shared-payload.ts` | Startup transport provenance carries producer/source/trust/timestamp/source-ref metadata |
| Highlights SQL | `lib/code-graph-db.ts` | `getStartupHighlights()` aggregate query still powers stale-or-ready startup highlights |
| Default scan excludes | `lib/indexer-types.ts` | `DEFAULT_EXCLUDE_PATHS` |
| `.gitignore` filtering | `lib/structural-indexer.ts` | `ignore` package, per-directory cache |
| Compact plugin resume mode | `.opencode/plugins/spec-kit-compact-code-graph.js` | `RESUME_MODE = 'minimal'` is intentional, kept for token economy |

The OpenCode plugin keeps `RESUME_MODE = 'minimal'` deliberately. Packet 012 enriches the shared snapshot payload itself rather than expanding the plugin's mode.

<!-- /ANCHOR:context-surfaces -->

---

<!-- ANCHOR:scan-defaults -->
## 4. SCAN DEFAULTS

`code_graph_scan` walks from a configurable `rootDir` (defaults to `process.cwd()`). The walk applies three filter layers in this order:

1. **Default include glob** — file extensions: `.ts`, `.tsx`, `.js`, `.jsx`, `.py`, `.sh`
2. **Default exclude paths** — `node_modules`, `dist`, `.git`, `vendor`, `z_future`, `z_archive`, `mcp-coco-index/mcp_server`
3. **`.gitignore` patterns** — read per-directory, parsed via the `ignore` package, cached during recursion

User overrides via `excludeGlobs` and `includeGlobs` are additive on top of the defaults. The `incremental` flag (default `true`) skips files whose `(mtime, content-hash)` pair is unchanged since the last scan. The scan handler passes the effective mode into `indexFiles(config, { skipFreshFiles })`: incremental scans use `skipFreshFiles: true`, while caller-requested full scans and git-triggered full reindexes use `skipFreshFiles: false`.

### Scan Behavior Reference

| Parameter | Default | Effect |
|---|---|---|
| `rootDir` | `process.cwd()` | Walk root |
| `incremental` | `true` | Skip unchanged files |
| `excludeGlobs` | `[]` | Added to `DEFAULT_EXCLUDE_PATHS` |
| `includeGlobs` | `[]` | Added to default file-extension filter |

### Scan Response Fields

| Field | Meaning |
|---|---|
| `fullReindexTriggered` | `true` only when an incremental scan was forced into full mode because Git HEAD changed. |
| `fullScanRequested` | `true` when the caller explicitly passed `incremental:false`. |
| `effectiveIncremental` | Final mode used for cleanup and stale-file skipping after caller intent and Git HEAD checks. |

### Indexer Options

`indexFiles(config, options?)` accepts `IndexFilesOptions { skipFreshFiles?: boolean }`. The default is `true` to preserve stale-only incremental behavior for existing callers. Pass `skipFreshFiles:false` only when the caller intentionally wants every post-exclude candidate parsed. Before returning, the indexer deduplicates retained node IDs across the current batch, drops edges whose source nodes were removed by that dedup sweep, and then adds cross-file `TESTED_BY` edges from the retained test nodes.

### Pruning the Existing Graph

After updating excludes (e.g., adding `z_future`), the existing DB still holds nodes from previously-indexed paths. To prune:

```bash
# Force a full re-evaluation with the new excludes
code_graph_scan({ rootDir: '<repo-root>', incremental: false })
```

The DB file size does not shrink automatically. Run `VACUUM` on the SQLite file if size matters.

<!-- /ANCHOR:scan-defaults -->

---

<!-- ANCHOR:related-documents -->
## 5. RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|---|---|
| [lib/README.md](./lib/README.md) | Core library overview |
| [handlers/README.md](./handlers/README.md) | MCP tool handler overview |
| [Spec Kit Memory MCP Server README](../README.md) | Parent MCP server documentation |
| Packet 012 spec folder (`specs/.../012-code-graph-context-and-scan-scope/`) | Origin of the stale-highlights, scan-excludes, and `.gitignore` changes |

### External Resources

| Resource | Description |
|---|---|
| [tree-sitter](https://tree-sitter.github.io/tree-sitter/) | Parser generator backing `lib/tree-sitter-parser.ts` |
| [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) | Synchronous SQLite binding used by `lib/code-graph-db.ts` |
| [ignore (npm)](https://github.com/kaelzhang/node-ignore) | `.gitignore` parser used by `lib/structural-indexer.ts` |

<!-- /ANCHOR:related-documents -->
