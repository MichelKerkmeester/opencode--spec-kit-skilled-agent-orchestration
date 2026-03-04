# Agent 5 Architecture Analysis

Scope: cross-boundary analysis between `.opencode/skill/system-spec-kit/scripts/` and `.opencode/skill/system-spec-kit/mcp_server/`.

Method: inspected directory READMEs, entrypoints, dependency imports, and representative runtime modules for memory/index/eval/tooling concerns.

## 1) Overlapping Concerns (memory / index / eval / tooling)

### A. Memory lifecycle overlap
- `scripts/README.md` states scripts own "memory save, and context indexing" (`scripts/README.md:27`).
- `scripts/memory/generate-context.ts` runs `runWorkflow(...)` which eventually indexes memory (`scripts/memory/generate-context.ts:339-342`, `scripts/core/workflow.ts:46`, `scripts/core/memory-indexer.ts:69-155`).
- MCP server also owns save/index via handlers (`mcp_server/handlers/memory-save.ts:342`, `mcp_server/handlers/memory-index.ts:123-131`).

Assessment: both sides contain active memory-ingest/index orchestration, not just one producer and one consumer.

### B. Index maintenance overlap
- Scripts-side reindex is implemented in `scripts/memory/reindex-embeddings.ts` and directly initializes MCP internals plus calls `handleMemoryIndexScan` (`scripts/memory/reindex-embeddings.ts:65-71`, `:117-120`).
- MCP-side has a compatibility wrapper that calls scripts dist output (`mcp_server/scripts/reindex-embeddings.ts:9-12`).
- MCP CLI also offers `reindex` (`mcp_server/cli.ts:12`, `:58-59`).

Assessment: reindex ownership is split across two entrypoint families (scripts + MCP CLI), with wrapper indirection in both directions.

### C. Eval overlap
- Scripts eval runners consume MCP eval/search API (`scripts/evals/run-ablation.ts:21-27`, `scripts/evals/run-bm25-baseline.ts:23-29`).
- Some scripts eval runners bypass stable API and import MCP internals directly (`scripts/evals/run-performance-benchmarks.ts:16-25`, `scripts/evals/run-chk210-quality-backfill.ts:8`).
- MCP server also exposes eval tools (`mcp_server/tool-schemas.ts:314-320`) and has eval library modules (`mcp_server/api/eval.ts:9-30`).

Assessment: eval is deliberately shared, but boundary discipline is inconsistent (public API usage + private lib coupling both present).

### D. Tooling overlap
- Scripts has centralized script registry (`scripts/scripts-registry.json:1-6`).
- MCP has centralized tool schema + dispatcher (`mcp_server/tool-schemas.ts:18-25`, `mcp_server/tools/index.ts:17-37`).

Assessment: each side has its own registry/control-plane concept; no single contract document currently maps how they relate.

## 2) Duplicate / Near-Duplicate Utilities Across `scripts` and `mcp_server`

## Confirmed duplicates

1. Embeddings re-export shims
- Scripts shim: `scripts/lib/embeddings.ts:1-7`.
- MCP shim: `mcp_server/lib/providers/embeddings.ts:1-8`.
- Both re-export `@spec-kit/shared/embeddings` with near-identical purpose.

2. Reindex wrapper entrypoint pattern
- MCP wrapper delegating to scripts dist: `mcp_server/scripts/reindex-embeddings.ts:9-12`.
- Scripts reindex implementation delegating to MCP internals: `scripts/memory/reindex-embeddings.ts:65-71`, `:117-120`.
- This is a functional mirror pair and creates circular operational dependency.

3. Quality metadata extractors
- Scripts copy: `scripts/core/memory-indexer.ts:22-52` (`extractQualityScore`, `extractQualityFlags`).
- MCP copy: `mcp_server/lib/parsing/memory-parser.ts:209-236` (same helper names and regex structure).

## Near-duplicates (same intent, different implementation)

4. Trigger extraction layers
- Shared canonical NLP extractor exists: `shared/trigger-extractor.ts:527-608`.
- MCP parser has its own trigger extractor: `mcp_server/lib/parsing/memory-parser.ts:460-524`.
- MCP quality loop has another lightweight extractor: `mcp_server/handlers/quality-loop.ts:343-362`.
- Scripts consume shared trigger extractor via shim: `scripts/lib/trigger-extractor.ts:1-7`.

Risk: different trigger phrase derivation logic depending on pathway (scripts workflow vs MCP parser/quality loop).

> **CORRECTION (review pass):** These 3 implementations serve fundamentally different purposes and are NOT near-duplicates:
> - `shared/trigger-extractor.ts` — NLP content-based generation (canonical, creates new triggers)
> - `mcp_server/lib/parsing/memory-parser.ts` — YAML/markdown metadata parser (reads existing trigger phrases from frontmatter)
> - `mcp_server/handlers/quality-loop.ts` — Heading-based heuristic for quality fallback (lightweight approximation)
>
> Consolidation tasks (if any) should respect these distinct purposes rather than treating them as duplicates.

5. Token estimation helpers (chars/4) repeated in multiple places
- Scripts tree-thinning: `scripts/core/tree-thinning.ts:70-75`.
- Scripts chunker constant: `scripts/lib/structure-aware-chunker.ts:41-43`.
- MCP formatter: `mcp_server/formatters/token-metrics.ts:33-37`.
- MCP quality loop: `mcp_server/handlers/quality-loop.ts:38-41`.

Risk: silent drift in token-budget behavior.

> **CORRECTION (review pass):** Only 2 of these 4 are genuine standalone function duplicates suitable for consolidation:
> - `scripts/core/tree-thinning.ts:70-75` — standalone estimator function (genuine duplicate)
> - `mcp_server/formatters/token-metrics.ts:33-37` — standalone estimator function (genuine duplicate)
>
> The other 2 are context-specific constant declarations, not reusable estimator functions:
> - `scripts/lib/structure-aware-chunker.ts:41-43` — local constant for chunk sizing
> - `mcp_server/handlers/quality-loop.ts:38-41` — local constant for quality budget
>
> Tasks T007-T009 should scope consolidation to the 2 genuine function duplicates only.

6. Logger utility families
- Scripts structured JSON logger (stdout + stderr mix): `scripts/utils/logger.ts:25-44`.
- MCP stderr-safe logger (MCP protocol-safe): `mcp_server/lib/utils/logger.ts:1-6`, `:47-58`.

Risk: semantics differ by runtime constraints; name overlap can obscure critical stdout/stderr contract differences.

## Additional consistency signal (docs/registry drift)
- `scripts/lib/README.md` lists `retry-manager.ts` in inventory (`scripts/lib/README.md:39`), but source file is absent in `scripts/lib/`.
- `scripts/scripts-registry.json` still references `scripts/dist/lib/retry-manager.js` (`scripts/scripts-registry.json:455-458`).

This amplifies boundary ambiguity for retry ownership (scripts vs MCP provider retry manager).

## 3) Boundary Clarity and Dependency Direction

## Intended boundary (documented)
- MCP public API says scripts should import from `mcp_server/api` rather than `lib` internals (`mcp_server/api/index.ts:5-6`, `mcp_server/api/eval.ts:4-7`, `mcp_server/api/search.ts:4-7`).
- `scripts/check-api-boundary.sh` enforces only `mcp_server/lib -> mcp_server/api` one-way dependency (`scripts/check-api-boundary.sh:5-7`, `:25-33`).

## Actual dependency direction (observed)

Primary runtime coupling:
- `scripts -> mcp_server` is heavy and direct:
  - TS project reference/path alias: `scripts/tsconfig.json:10-16`.
  - Internal imports in scripts core/evals: `scripts/core/memory-indexer.ts:13-14`, `scripts/core/workflow.ts:44`, `scripts/evals/run-performance-benchmarks.ts:16-25`, `scripts/evals/run-chk210-quality-backfill.ts:8`.

Reverse coupling exists too (not purely one-way architecture):
- `mcp_server/scripts/reindex-embeddings.ts` calls `../../scripts/dist/memory/reindex-embeddings.js` (`mcp_server/scripts/reindex-embeddings.ts:9-12`).
- MCP docs describe this as compatibility path (`mcp_server/scripts/README.md:32`, `:43`, `:60`).

Operationally, reindex forms a bidirectional bridge:
- scripts implementation calls MCP internals and handlers (`scripts/memory/reindex-embeddings.ts:65-71`, `:117-120`),
- MCP wrapper calls scripts dist (`mcp_server/scripts/reindex-embeddings.ts:9-12`).

## Boundary clarity verdict
- Clarity is medium-low: docs declare stable API boundary, but runtime code frequently bypasses it for convenience/perf/testing.
- Direction is "mostly scripts -> mcp_server", with an explicit compatibility back-edge in MCP scripts.
- This is workable but fragile; refactor blast radius is larger than the documented architecture implies.

## 4) Proposed README Actions (WHY -> WHAT)

### Action 1 (CREATE)
WHY: There is no single "cross-boundary contract" doc; intent is spread across comments and multiple READMEs.
WHAT: Create `system-spec-kit/README.boundaries.md` (or `system-spec-kit/ARCHITECTURE.md`) that explicitly defines:
- allowed dependency directions,
- approved public surfaces (`mcp_server/api/*`),
- exception list (compat wrappers),
- forbidden import patterns.

### Action 2 (CREATE)
WHY: `mcp_server/api/*` is meant to be stable for scripts, but that contract is currently code-comment-only.
WHAT: Create `mcp_server/api/README.md` documenting "public API for external consumers (scripts/evals/automation)" and migration examples from `lib/*` imports to `api/*`.

### Action 3 (MERGE)
WHY: Reindex behavior is documented in at least three places with split ownership narratives:
- `scripts/memory/README.md`,
- `mcp_server/scripts/README.md`,
- `mcp_server/database/README.md`.
WHAT: Merge into one canonical reindex runbook (recommended home: `scripts/memory/README.md`) and keep the other two as short "compatibility pointer" sections linking to canonical docs.

### Action 4 (RENAME)
WHY: `mcp_server/scripts/README.md` currently reads like a general scripts area, but it is explicitly compatibility-only.
WHAT: Rename to `mcp_server/scripts/COMPATIBILITY-README.md` (or keep filename and retitle heading to "Compatibility Wrappers") to reduce ownership confusion.

### Action 5 (CREATE)
WHY: Eval runners in `scripts/evals/` mix stable and internal MCP imports, which erodes boundary guarantees.
WHAT: Create `scripts/evals/README.md` with import policy:
- preferred: `../../mcp_server/api`,
- prohibited-by-default: `@spec-kit/mcp-server/lib/*`,
- exception process for benchmark-only internals.

### Action 6 (MERGE + CLEANUP)
WHY: Scripts library inventory/registry currently advertises entries that no longer exist, which obscures true ownership.
WHAT: Merge inventory truth into one source (either `scripts/lib/README.md` or `scripts/scripts-registry.json`), then align the other via link-only references; remove stale retry-manager references or mark them as "moved to mcp_server/lib/providers/retry-manager".

## 5) Priority Recommendations

1. Highest impact: Actions 1 + 2 + 5 (contract + public API + eval import policy).
2. Next: Action 3 (single canonical reindex docs) to remove cross-tree ambiguity.
3. Then: Action 4 + 6 (naming and inventory hygiene).

These documentation changes are enough to materially improve boundary clarity without immediate code refactors.
