---
title: "Architecture: system-spec-kit"
description: "Current package architecture for scripts, MCP runtime, shared modules, and canonical continuity flows."
trigger_phrases:
  - "system spec kit architecture"
  - "canonical continuity architecture"
  - "resume ladder"
  - "content router"
---

# Architecture: system-spec-kit

> Current-reality architecture for the `system-spec-kit` package: authored code lives in `scripts/`, `mcp_server/`, and `shared/`, while packet continuity is rebuilt through `/spec_kit:resume` and canonical spec documents.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. PACKAGE TOPOLOGY](#2--package-topology)
- [3. CANONICAL CONTINUITY FLOWS](#3--canonical-continuity-flows)
- [4. RUNTIME SUBSYSTEMS](#4--runtime-subsystems)
- [5. ENFORCEMENT AND VERIFICATION](#5--enforcement-and-verification)
- [6. RELATED](#6--related)

<!-- /ANCHOR:table-of-contents -->

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`system-spec-kit` is split into three authored zones plus generated build output:

| Zone | Purpose | Source of Truth |
|---|---|---|
| `scripts/` | CLI generation, validation, indexing, evals, and packet tooling | TypeScript and shell under `scripts/` |
| `mcp_server/` | Runtime MCP server, handlers, storage, search, hooks, and routing | TypeScript under `mcp_server/` |
| `shared/` | Neutral modules imported by both scripts and runtime | TypeScript under `shared/` |
| `dist/` | Built JavaScript entrypoints | Generated output only |

The package no longer treats generated memory notes as the primary continuity artifact. The operator-facing recovery surface is `/spec_kit:resume`, and the recovery chain is:

1. `handover.md`
2. `_memory.continuity`
3. canonical spec docs such as `implementation-summary.md`, `tasks.md`, `plan.md`, and `spec.md`

Generated memory artifacts are supporting context only.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:topology -->
## 2. PACKAGE TOPOLOGY

```text
system-spec-kit/
├── scripts/                    # CLI generation, validation, eval, and packet tooling
├── mcp_server/                 # MCP runtime
│   ├── handlers/               # Tool handlers and save orchestration
│   ├── hooks/                  # Claude, Gemini, Copilot lifecycle hooks
│   ├── lib/                    # Runtime subsystems
│   │   ├── continuity/         # _memory.continuity contract helpers
│   │   ├── resume/             # Resume ladder resolution
│   │   ├── routing/            # Content router for canonical saves
│   │   ├── merge/              # Anchor-scoped spec-doc merge operations
│   │   ├── search/             # Hybrid search pipeline
│   │   ├── graph/              # Causal graph signals
│   │   ├── coverage-graph/     # Deep-loop research/review coverage graphs
│   │   ├── feedback/           # Implicit feedback and shadow evaluation
│   │   └── ...                 # storage, validation, governance, response, etc.
│   ├── api/                    # Stable import boundary for non-runtime callers
│   ├── tests/                  # Vitest suites and fixtures
│   └── scripts/                # Compatibility wrappers only
├── shared/                     # Neutral cross-package modules
└── specs/ / .opencode/specs/   # Packet docs and continuity artifacts
```

### Dependency direction

| From | To | Status |
|---|---|---|
| `scripts/` | `shared/` | Allowed |
| `scripts/` | `mcp_server/api/*` | Allowed and preferred |
| `scripts/` | `mcp_server/lib/*` | Disallowed unless explicitly allowlisted |
| `mcp_server/` | `shared/` | Allowed |
| `mcp_server/lib/*` | `mcp_server/api/*` | Disallowed |

This keeps the runtime internals private while still exposing a stable boundary for tooling.

<!-- /ANCHOR:topology -->

<!-- ANCHOR:continuity-flows -->
## 3. CANONICAL CONTINUITY FLOWS

### Read / resume path

The runtime rebuilds continuity through `lib/resume/resume-ladder.ts`.

```text
/spec_kit:resume
  -> session-bootstrap / session-resume handlers
  -> lib/resume/resume-ladder.ts
  -> handover.md
  -> _memory.continuity
  -> canonical spec docs
  -> supporting search and graph evidence
```

Key runtime modules:

- `mcp_server/lib/resume/resume-ladder.ts`
- `mcp_server/lib/continuity/thin-continuity-record.ts`
- `mcp_server/handlers/session-resume.ts`
- `mcp_server/handlers/session-bootstrap.ts`
- `mcp_server/handlers/memory-context.ts`

### Write / save path

Canonical save routing is no longer "always write a generated memory file first." The runtime classifies content, chooses a canonical target, and only then performs a bounded merge or supporting artifact write.

```text
memory_save
  -> handlers/memory-save.ts
  -> handlers/save/*
  -> lib/routing/content-router.ts
  -> lib/merge/anchor-merge-operation.ts
  -> spec doc or continuity target
  -> index / metadata update
```

Key runtime modules:

- `mcp_server/handlers/memory-save.ts`
- `mcp_server/lib/routing/content-router.ts`
- `mcp_server/lib/merge/anchor-merge-operation.ts`
- `mcp_server/lib/continuity/thin-continuity-record.ts`

The live canonical writer uses an 8-category router: `narrative_progress`, `narrative_delivery`, `decision`, `handover_state`, `research_finding`, `task_update`, `metadata_only`, and `drop`. Tier 1 handles structured and heuristic matches, Tier 2 compares against routing prototypes, and Tier 3 is now wired into the save handler by default and the configured LLM endpoint is available. Delivery routing now keys off sequencing, gating, rollout, and verification cues instead of generic implementation verbs, while the handover/drop boundary separates hard transcript or telemetry wrappers from softer operational language like `git diff`. `routeAs` can force a category for operator-directed saves, and the router context derives `packet_kind` from spec metadata first (`type`, `title`, `description`) with parent-phase fallback only when metadata is silent.

### Supporting artifacts

Generated memory files still matter for search, traceability, and evidence capture, but they are supporting artifacts rather than the canonical operator-facing session state.

<!-- /ANCHOR:continuity-flows -->

<!-- ANCHOR:runtime-subsystems -->
## 4. RUNTIME SUBSYSTEMS

### Search and retrieval

`mcp_server/lib/search/` remains the hybrid retrieval subsystem. It provides vector, BM25, FTS5, graph, and structural graph channels, then fuses them in a staged ranking pipeline. Retrieval is subordinate to the resume ladder for packet recovery.

The adaptive fusion profile for continuity-oriented retrieval now lives with the other runtime weight profiles in `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts`, using `semantic 0.52`, `keyword 0.18`, `recency 0.07`, and `graph 0.23`. Stage 3 keeps the complementary continuity-specific MMR lambda in `mcp_server/lib/search/intent-classifier.ts` at `0.65`, so resume-style searches stay semantic-first while still preserving graph support.

Reranking behavior is owned by `mcp_server/lib/search/pipeline/stage3-rerank.ts` and `mcp_server/lib/search/cross-encoder.ts`: the pipeline now waits for at least 4 candidates before invoking the reranker, the legacy `applyLengthPenalty` option is retained as a compatibility no-op (`1.0` multiplier for every document), and `getRerankerStatus()` reports latency plus cache hits, misses, stale hits, and evictions for the shared reranker cache.

### Graph systems

Two graph systems now coexist:

| Graph | Purpose | Primary Modules |
|---|---|---|
| Causal memory graph | Search boosts, causal lineage, community signals | `lib/graph/`, `lib/search/graph-search-fn.ts` |
| Coverage graph | Deep research/review convergence and gap tracking | `lib/coverage-graph/`, `handlers/coverage-graph/` |

### Feedback and evaluation

`mcp_server/lib/feedback/` stores feedback events and shadow-scoring helpers. `lib/eval/` and `scripts/evals/` provide reporting, ablations, and boundary checks.

### Hooks and startup context

`mcp_server/hooks/` contains lifecycle integrations for Claude, Gemini, and Copilot. These hooks surface startup or compaction context, but they still point operators back to the canonical resume chain instead of inventing an alternate source of truth.

<!-- /ANCHOR:runtime-subsystems -->

<!-- ANCHOR:enforcement -->
## 5. ENFORCEMENT AND VERIFICATION

The architecture is enforced by code, tests, and scripts, not by docs alone.

Key checks:

- `scripts/evals/check-no-mcp-lib-imports.ts`
- `scripts/evals/check-no-mcp-lib-imports-ast.ts`
- `scripts/evals/check-handler-cycles-ast.ts`
- `scripts/evals/check-architecture-boundaries.ts`
- workspace typechecks for `@spec-kit/mcp-server` and `@spec-kit/scripts`
- targeted Vitest suites for save, resume, routing, public API, and docs parity

### Practical rule set

- Edit authored `.ts`, `.md`, and shell sources, not `dist/`.
- Use `mcp_server/api/` as the import boundary from `scripts/`.
- Keep packet recovery anchored on `/spec_kit:resume`.
- Treat `handover.md`, `_memory.continuity`, and spec docs as the continuity backbone.

<!-- /ANCHOR:enforcement -->

<!-- ANCHOR:related -->
## 6. RELATED

- `mcp_server/README.md`
- `mcp_server/lib/README.md`
- `mcp_server/handlers/README.md`
- `mcp_server/hooks/README.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/resource-map.md`

<!-- /ANCHOR:related -->
