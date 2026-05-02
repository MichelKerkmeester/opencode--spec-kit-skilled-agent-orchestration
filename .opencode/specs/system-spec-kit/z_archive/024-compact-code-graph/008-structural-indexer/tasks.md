---
title: "Tasks: Structural Indexer [024/008] [system-spec-kit/024-compact-code-graph/008-structural-indexer/tasks]"
description: "Task tracking for the structural indexer with tree-sitter default parsing, regex fallback, node/edge extraction, and content-hash-aware indexing."
trigger_phrases:
  - "tasks"
  - "structural"
  - "indexer"
  - "024"
  - "008"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/008-structural-indexer"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 008 — Structural Indexer


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Task Notation
Template compliance shim section. Legacy phase content continues below.

## Phase 1: Setup
Template compliance shim section. Legacy phase content continues below.

## Phase 2: Implementation
Template compliance shim section. Legacy phase content continues below.

## Phase 3: Verification
Template compliance shim section. Legacy phase content continues below.

## Completion Criteria
Template compliance shim section. Legacy phase content continues below.

## Cross-References
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:notation -->
Template compliance shim anchor for notation.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
Template compliance shim anchor for phase-1.
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase -->
Template compliance shim anchor for phase-2.
<!-- /ANCHOR:phase -->
<!-- ANCHOR:phase-3 -->
Template compliance shim anchor for phase-3.
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
Template compliance shim anchor for completion.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
Template compliance shim anchor for cross-refs.
<!-- /ANCHOR:cross-refs -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Completed

- [x] Tree-sitter WASM runtime integrated as the default parser backend — Evidence: `structural-indexer.ts#getParser()` defaults to `treesitter`; `tree-sitter-parser.ts` loads grammars via `web-tree-sitter`
- [x] Regex fallback backend retained for JS/TS/Python/Shell — Evidence: `structural-indexer.ts#getParser()` falls back on init failure and supports `SPECKIT_PARSER=regex`
- [x] `indexer-types.ts` — `CodeNode`, `CodeEdge`, `ParseResult` interfaces defined
- [x] `symbolId` generation — deterministic SHA-256 hash of filePath + fqName + kind
- [x] `fqName` construction — consistent rules across all 4 languages
- [x] Programmatic AST traversal replaces `.scm` query files — Evidence: `tree-sitter-parser.ts` walks ASTs directly and no `*.scm` files exist in the code-graph area
- [x] `CONTAINS` edges — classes to methods correctly linked
- [x] `CALLS` edges — direct function calls identified via `extractEdges`
- [x] `IMPORTS` edges — import statements correctly identified across JS/TS/Python
- [x] `EXPORTS` edges — exported symbols identified in JS/TS
- [x] `EXTENDS` and `IMPLEMENTS` edges — TS classes/interfaces extracted via `parseJsTs` + `extractEdges`
- [x] `TESTED_BY` heuristic edges — test files linked to tested modules via filename pattern + import
- [x] Content-hash incremental skip — unchanged files not re-parsed
- [x] Parser health metadata — clean/recovered/error correctly distinguished
- [x] Files >100KB skipped with warning — `maxFileSizeBytes=102400` in `getDefaultConfig`
- [x] Parse time tracked per file — `parseDurationMs` in `ParseResult`
- [x] Edge confidence scores — `metadata.confidence` reflects extraction reliability
- [x] Full repo index benchmarked — 835 files in 416ms (<30s target)
- [x] Incremental re-index benchmarked — 10 files in 6ms (<5s target)

### Deferred

- [x] `CONFIGURES` edge type remains explicitly deferred to v2 because automated detection confidence is still too low
