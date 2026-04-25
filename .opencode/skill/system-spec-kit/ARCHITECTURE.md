---
title: "Architecture: system-spec-kit"
description: "Current package architecture for scripts, MCP runtime, shared modules, self-contained skill-advisor + code-graph subsystems, hook integration matrix, and canonical continuity flows."
trigger_phrases:
  - "system spec kit architecture"
  - "canonical continuity architecture"
  - "resume ladder"
  - "content router"
  - "skill-advisor architecture"
  - "code-graph architecture"
  - "5-lane fusion"
  - "advisor daemon"
---

# Architecture: system-spec-kit

> Current-reality architecture for the `system-spec-kit` package: authored code lives in `scripts/`, `mcp_server/`, and `shared/`; the `mcp_server/` tree now hosts two self-contained consumed subsystems (`skill-advisor/`, `code-graph/`); packet continuity is rebuilt through `/spec_kit:resume` and canonical spec documents.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. PACKAGE TOPOLOGY](#2-package-topology)
- [3. CANONICAL CONTINUITY FLOWS](#3-canonical-continuity-flows)
- [4. RUNTIME SUBSYSTEMS](#4-runtime-subsystems)
- [5. SKILL-ADVISOR SUBSYSTEM](#5-skill-advisor-subsystem)
- [6. CODE-GRAPH SUBSYSTEM](#6-code-graph-subsystem)
- [7. HOOK AND PLUGIN INTEGRATION](#7-hook-and-plugin-integration)
- [8. ENFORCEMENT AND VERIFICATION](#8-enforcement-and-verification)
- [9. DECISION RECORDS](#9-decision-records)
- [10. RELATED](#10-related)

<!-- /ANCHOR:table-of-contents -->

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`system-spec-kit` is split into three authored zones plus generated build output:

| Zone | Purpose | Source of Truth |
|---|---|---|
| `scripts/` | CLI generation, validation, indexing, evals, and packet tooling | TypeScript and shell under `scripts/` |
| `mcp_server/` | Runtime MCP server, handlers, storage, search, hooks, routing, and consumed subsystems | TypeScript under `mcp_server/` |
| `shared/` | Neutral modules imported by both scripts and runtime | TypeScript under `shared/` |
| `dist/` | Built JavaScript entrypoints | Generated output only |

Two consumed subsystems live as first-class self-contained packages under `mcp_server/`:

- `mcp_server/skill-advisor/` — Native skill routing advisor (Phase 027). Houses its own `lib/`, `handlers/`, `tools/`, `tests/`, `scripts/`, `bench/`, `compat/`, `schemas/`, operator docs (`README.md`, `INSTALL_GUIDE.md`, `SET-UP_GUIDE.md`), plus `feature_catalog/` and `manual_testing_playbook/` packages.
- `mcp_server/code-graph/` — Structural code graph + coco-index facade (Phase 028). Houses its own `lib/`, `handlers/`, `tools/`, `tests/`.

Neither subsystem ships a `SKILL.md`. They are consumed subsystems of `system-spec-kit`, not standalone skills. All operator-facing routing goes through `system-spec-kit` entry points.

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
├── scripts/                        # CLI generation, validation, eval, and packet tooling
├── mcp_server/                     # MCP runtime
│   ├── handlers/                   # Tool handlers and save orchestration
│   ├── hooks/                      # Claude, Gemini, Copilot, Codex lifecycle hooks
│   ├── lib/                        # Runtime subsystems
│   │   ├── continuity/             # _memory.continuity contract helpers
│   │   ├── resume/                 # Resume ladder resolution
│   │   ├── routing/                # Content router for canonical saves
│   │   ├── merge/                  # Anchor-scoped spec-doc merge operations
│   │   ├── search/                 # Hybrid search pipeline
│   │   ├── graph/                  # Causal graph signals
│   │   ├── coverage-graph/         # Deep-loop research/review coverage graphs
│   │   ├── feedback/               # Implicit feedback and shadow evaluation
│   │   └── ...                     # storage, validation, governance, response, etc.
│   ├── api/                        # Stable import boundary for non-runtime callers
│   ├── tests/                      # Runtime Vitest suites and fixtures
│   ├── scripts/                    # Compatibility wrappers only
│   ├── skill-advisor/              # Self-contained advisor package (see §5)
│   │   ├── lib/                    # scorer (fusion + lanes), daemon, freshness, lifecycle, compat, ...
│   │   ├── handlers/               # advisor-recommend | advisor-status | advisor-validate
│   │   ├── tools/                  # MCP tool registrations
│   │   ├── schemas/                # Zod schemas for tools and derived metadata
│   │   ├── compat/                 # Stable public API entrypoint for plugin bridge
│   │   ├── tests/                  # Vitest suites (scorer, parity, handlers, compat, legacy, python)
│   │   ├── bench/                  # latency / scorer / watcher benches
│   │   ├── scripts/                # Python compat shim, runtime, regression, bench, compiler
│   │   ├── feature_catalog/        # Feature catalog package
│   │   ├── manual_testing_playbook/ # Manual testing playbook package
│   │   ├── README.md / INSTALL_GUIDE.md / SET-UP_GUIDE.md
│   │   └── graph-metadata.json
│   └── code-graph/                 # Self-contained code-graph package (see §6)
│       ├── lib/                    # indexer, readiness contract, seed resolver, coco-index integration
│       ├── handlers/               # code_graph_* + ccc_* (coco-index facade)
│       ├── tools/                  # MCP tool registrations
│       └── tests/                  # 7 files / 52 tests
├── shared/                         # Neutral cross-package modules
└── specs/ / .opencode/specs/       # Packet docs and continuity artifacts
```

### Dependency direction

| From | To | Status |
|---|---|---|
| `scripts/` | `shared/` | Allowed |
| `scripts/` | `mcp_server/api/*` | Allowed and preferred |
| `scripts/` | `mcp_server/lib/*` | Disallowed unless explicitly allowlisted |
| `mcp_server/` | `shared/` | Allowed |
| `mcp_server/lib/*` | `mcp_server/api/*` | Disallowed |
| External plugin | `mcp_server/skill-advisor/compat/index.ts` | Allowed (stable public API) |
| External plugin | `mcp_server/skill-advisor/lib/*` | Disallowed (private internals) |

This keeps the runtime internals private while still exposing a stable boundary for tooling and external plugins.

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

The live canonical writer uses an 8-category router: `narrative_progress`, `narrative_delivery`, `decision`, `handover_state`, `research_finding`, `task_update`, `metadata_only`, and `drop`. Tier 1 handles structured and heuristic matches, Tier 2 compares against routing prototypes, and Tier 3 is wired into the save handler by default (the configured LLM endpoint is available). Delivery routing keys off sequencing, gating, rollout, and verification cues instead of generic implementation verbs; the handover/drop boundary separates hard transcript or telemetry wrappers from softer operational language like `git diff`. `routeAs` can force a category for operator-directed saves, and the router context derives `packet_kind` from spec metadata first (`type`, `title`, `description`) with parent-phase fallback only when metadata is silent.

### Supporting artifacts

Generated memory files still matter for search, traceability, and evidence capture, but they are supporting artifacts rather than the canonical operator-facing session state.

<!-- /ANCHOR:continuity-flows -->

<!-- ANCHOR:runtime-subsystems -->
## 4. RUNTIME SUBSYSTEMS

### Search and retrieval

`mcp_server/lib/search/` is the hybrid retrieval subsystem. It provides vector, BM25, FTS5, graph, and structural graph channels, then fuses them in a staged ranking pipeline. Retrieval is subordinate to the resume ladder for packet recovery.

The adaptive fusion profile for continuity-oriented retrieval lives with the other runtime weight profiles in `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts`, using `semantic 0.52`, `keyword 0.18`, `recency 0.07`, and `graph 0.23`. Stage 3 keeps the complementary continuity-specific MMR lambda in `mcp_server/lib/search/intent-classifier.ts` at `0.65`, so resume-style searches stay semantic-first while preserving graph support.

Reranking behavior is owned by `mcp_server/lib/search/pipeline/stage3-rerank.ts` and `mcp_server/lib/search/cross-encoder.ts`: the pipeline waits for at least 4 candidates before invoking the reranker, the legacy `applyLengthPenalty` option is retained as a compatibility no-op (`1.0` multiplier for every document), and `getRerankerStatus()` reports latency plus cache hits, misses, stale hits, and evictions for the shared reranker cache.

### Graph systems

Three graph systems now coexist:

| Graph | Purpose | Primary Modules |
|---|---|---|
| Causal memory graph | Search boosts, causal lineage, community signals | `lib/graph/`, `lib/search/graph-search-fn.ts` |
| Coverage graph | Deep research/review convergence and gap tracking | `lib/coverage-graph/`, `handlers/coverage-graph/` |
| Code graph | Structural code parsing + coco-index facade | `mcp_server/code-graph/` (see §6) |

### Feedback and evaluation

`mcp_server/lib/feedback/` stores feedback events and shadow-scoring helpers. `lib/eval/` and `scripts/evals/` provide reporting, ablations, and boundary checks.

### Skill advisor

The skill advisor is a self-contained subsystem at `mcp_server/skill-advisor/`; see §5 for package internals, §7 for hook integration.

<!-- /ANCHOR:runtime-subsystems -->

<!-- ANCHOR:skill-advisor -->
## 5. SKILL-ADVISOR SUBSYSTEM

Introduced in its current self-contained form by Phase 027. Produces the compact skill recommendation brief that Gate 2 (skill routing) consumes.

### Package layout

`mcp_server/skill-advisor/` is a first-class self-contained package. Its `lib/` tree contains:

| Subfolder | Purpose |
|---|---|
| `lib/scorer/` | 5-lane fusion engine (see weights below) |
| `lib/scorer/lanes/` | Per-lane scorers: `explicit.ts`, `lexical.ts`, `graph-causal.ts`, `derived.ts`, `semantic-shadow.ts` |
| `lib/daemon/` | Long-running writer: `lease.ts`, `lifecycle.ts`, `watcher.ts` |
| `lib/freshness/` | `trust-state.ts`, `cache-invalidation.ts`, `generation.ts`, `rebuild-from-source.ts` |
| `lib/derived/` | Auto-derived keyword + trigger generation |
| `lib/lifecycle/` | Lifecycle state machine |
| `lib/compat/` | Python parity shims |
| `lib/corpus/` | Golden corpus + holdout fixtures |

### 5-lane analytical fusion

Defined in `mcp_server/skill-advisor/lib/scorer/weights-config.ts:8-19` and exercised through `mcp_server/skill-advisor/lib/scorer/fusion.ts`:

| Lane | Weight | Role |
|---|---|---|
| `explicit_author` | `0.45` | Author-declared keywords / manifest triggers |
| `lexical` | `0.30` | BM25-style lexical overlap |
| `graph_causal` | `0.15` | Causal graph lineage signal |
| `derived_generated` | `0.10` | Auto-derived keyword lane (bounded) |
| `semantic_shadow` | `0.00` | Shadow-only channel; scored but inert |

`semantic_shadow` is locked at `0.00` live weight (ADR-006). The semantic lane is scored shadow-only and inert until a future weight rebalance is justified by measured live-corpus evidence; no automated promotion subsystem is wired today.

### Daemon + freshness + trust states

- **Daemon**: Chokidar-based watcher with narrow scope; idle budget ≤1% CPU / <20MB RSS (verified via `bench/watcher-benchmark.ts`).
- **Trust states** (`lib/freshness/trust-state.ts:5`): `live` | `stale` | `absent` | `unavailable`. Consumers treat `live` and `stale` as queryable; `absent` and `unavailable` trigger rebuild-from-source or graceful degradation.
- **Track H hardening**: reindex-storm back-pressure, malformed SKILL.md quarantine, partial-write resilience.

### MCP tools

Three tools, registered under `mcp_server/skill-advisor/tools/`:

| Tool | Handler | Purpose |
|---|---|---|
| `advisor_recommend` | `handlers/advisor-recommend.ts` | Produce ranked skill brief for a prompt |
| `advisor_status` | `handlers/advisor-status.ts` | Daemon / freshness / trust-state readout |
| `advisor_validate` | `handlers/advisor-validate.ts` | Validate skill manifest + derived metadata |

### Compatibility surfaces

- **Python compat shim**: `mcp_server/skill-advisor/scripts/skill_advisor.py` with daemon-probe → native fallback → local fallback.
- **Stable public API**: `mcp_server/skill-advisor/compat/index.ts`. Plugin bridges import from here, never from `lib/*`.
- **Gate 2 fallback path**: `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`.

### Accuracy benchmarks

| Metric | Value |
|---|---|
| Full corpus accuracy | 80.5% |
| Holdout accuracy | 77.5% |
| UNKNOWN rate (abstentions) | ≤10 |
| Python-correct regressions | 0 (ADR-007 regression-protection parity) |

Regression suite: `mcp_server/skill-advisor/scripts/skill_advisor_regression.py` — 52/52 P0 cases pass.

### Test surfaces

`mcp_server/skill-advisor/tests/` — Vitest suites across `scorer/`, `handlers/`, `parity/`, `compat/`, `legacy/` (11 advisor-*.vitest.ts files relocated from `mcp_server/tests/`), and `python/`.

<!-- /ANCHOR:skill-advisor -->

<!-- ANCHOR:code-graph -->
## 6. CODE-GRAPH SUBSYSTEM

Migrated into a self-contained package by Phase 028 — previously scattered across four separate locations in the runtime tree (lib, handlers, tools, and test suites), now consolidated under `mcp_server/code-graph/`.

### Package layout

| Subfolder | Purpose |
|---|---|
| `lib/` | Indexer, readiness contract, seed resolver, budget allocator, runtime detection, tree-sitter parser, coco-index integration |
| `handlers/` | MCP tool handlers (7 tools total; see below) |
| `tools/` | MCP tool registrations (`code-graph-tools.ts`, `index.ts`) |
| `tests/` | 7 files / 52 tests |

### MCP tools

Seven tools, unchanged across the Phase 028 migration:

| Tool | Kind | Handler |
|---|---|---|
| `code_graph_scan` | Structural graph | `handlers/scan.ts` |
| `code_graph_query` | Structural graph | `handlers/query.ts` |
| `code_graph_context` | Structural graph | `handlers/context.ts` |
| `code_graph_status` | Structural graph | `handlers/status.ts` |
| `ccc_reindex` | coco-index facade | `handlers/ccc-reindex.ts` |
| `ccc_status` | coco-index facade | `handlers/ccc-status.ts` |
| `ccc_feedback` | coco-index facade | `handlers/ccc-feedback.ts` |

### coco-index facade pattern

The `ccc_*` handlers are TypeScript facades that spawn the coco-index CLI binary from `.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc`. This isolates the Python-based semantic index behind a uniform MCP interface without pulling it into the TypeScript process boundary.

### Readiness contract

Defined in `mcp_server/code-graph/lib/readiness-contract.ts`. Trust values align with the skill-advisor trust vocabulary (§5):

- `live` — fresh index, queryable
- `stale` — indexed but needs rebuild
- `absent` — not yet indexed
- `unavailable` — subsystem offline (binary missing, daemon down, etc.)

The contract normalizes `ensure-ready` freshness (`fresh|stale|empty`) onto the shared-payload trust axis (`live|stale|absent`) and exposes `unavailable` for full-subsystem failures. See `readiness-contract.ts:5` for the canonical `SkillGraphTrustState` export.

<!-- /ANCHOR:code-graph -->

<!-- ANCHOR:hook-integration -->
## 7. HOOK AND PLUGIN INTEGRATION

### Hook integration matrix

`mcp_server/hooks/` contains per-runtime lifecycle integrations. Each runtime has its own subfolder with prompt-submit, session-prime or session-start, and (where applicable) compact-inject / compact-cache / session-stop entry points.

| Runtime | Hook folder | Prompt-submit | Session-prime | Compact handling | Other |
|---|---|---|---|---|---|
| Claude Code | `hooks/claude/` | `user-prompt-submit.ts` | `session-prime.ts` | `compact-inject.ts` | `claude-transcript.ts`, `session-stop.ts` |
| Gemini CLI | `hooks/gemini/` | `user-prompt-submit.ts` | `session-prime.ts` | `compact-inject.ts`, `compact-cache.ts` | `session-stop.ts` |
| Copilot CLI | `hooks/copilot/` | `user-prompt-submit.ts` refreshes `$HOME/.copilot/copilot-instructions.md` via `custom-instructions.ts` | `session-prime.ts` refreshes startup context in the same managed custom-instructions file | `compact-cache.ts` | `custom-instructions.ts` |
| Codex CLI | `hooks/codex/` | `user-prompt-submit.ts` | `session-start.ts` | — | `pre-tool-use.ts`, `prompt-wrapper.ts` |

Shared infrastructure: `hooks/index.ts`, `hooks/memory-surface.ts`, `hooks/mutation-feedback.ts`, `hooks/response-hints.ts`, `hooks/shared-provenance.ts`.

All hooks surface startup or compaction context, but they point operators back to the canonical resume chain instead of inventing an alternate source of truth. Copilot is the exception in transport shape only: `user-prompt-submit.ts` and `session-prime.ts` call `custom-instructions.ts` to refresh a managed block in `$HOME/.copilot/copilot-instructions.md`, and the hook responses remain informational or empty rather than acting as a prompt-mutation channel.

### OpenCode plugin bridge

For runtimes without native hook support, the plugin bridge provides native-first delegation:

- **Bridge entry**: `.opencode/plugins/spec-kit-skill-advisor.js` (OpenCode plugin ESM entrypoint with a default-export factory)
- **Bridge runtime**: `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs` (delegation logic)
- **Import target**: `mcp_server/skill-advisor/compat/index.ts` (stable public API — never `lib/*`)

Delegation order:

1. Daemon probe → if live, return brief from daemon state.
2. Native fallback → invoke `compat/index.ts` inline.
3. Python shim fallback → spawn `mcp_server/skill-advisor/scripts/skill_advisor.py`.

The bridge keeps runtime state inside each plugin instance, dedups concurrent identical in-flight requests before spawning a second bridge call, caps prompt stdin / rendered brief / cache entry sizes, and evicts the oldest cached entry when the configured cache cap is exceeded.

A companion bridge `spec-kit-compact-code-graph-bridge.mjs` + `spec-kit-compact-code-graph.js` wires the code-graph compaction surface.

<!-- /ANCHOR:hook-integration -->

<!-- ANCHOR:enforcement -->
## 8. ENFORCEMENT AND VERIFICATION

The architecture is enforced by code, tests, and scripts, not by docs alone.

Key checks:

- `scripts/evals/check-no-mcp-lib-imports.ts`
- `scripts/evals/check-no-mcp-lib-imports-ast.ts`
- `scripts/evals/check-handler-cycles-ast.ts`
- `scripts/evals/check-architecture-boundaries.ts`
- workspace typechecks for `@spec-kit/mcp-server` and `@spec-kit/scripts`
- targeted Vitest suites for save, resume, routing, public API, and docs parity
- skill-advisor test surface: `mcp_server/skill-advisor/tests/` — 23 files / 167 tests
- code-graph test surface: `mcp_server/code-graph/tests/` — 7 files / 52 tests
- Python regression: `mcp_server/skill-advisor/scripts/skill_advisor_regression.py` — 52/52 P0 cases

### Practical rule set

- Edit authored `.ts`, `.md`, and shell sources, not `dist/`.
- Use `mcp_server/api/` as the import boundary from `scripts/`.
- External plugins import only from `mcp_server/skill-advisor/compat/index.ts`, never from `lib/*`.
- Keep packet recovery anchored on `/spec_kit:resume`.
- Treat `handover.md`, `_memory.continuity`, and spec docs as the continuity backbone.
- Skill-advisor and code-graph are consumed subsystems of `system-spec-kit`; neither ships a `SKILL.md`.

<!-- /ANCHOR:enforcement -->

<!-- ANCHOR:decision-records -->
## 9. DECISION RECORDS

Architectural decisions for the skill-advisor + code-graph subsystems are captured in the Phase 027 decision record:

`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/decision-record.md`

| ADR | Subject |
|---|---|
| ADR-001 | Chokidar + hash-aware SQLite indexer as daemon substrate |
| ADR-002 | Self-contained `mcp_server/skill-advisor/` package layout |
| ADR-003 | 5-lane analytical fusion weights (`0.45 / 0.30 / 0.15 / 0.10 / 0.00`) |
| ADR-004 | Daemon lease model (long-running writer) |
| ADR-005 | Migration from split `lib/` + `scripts/` layout to self-contained package |
| ADR-006 | Semantic live weight stays `0.00` through first promotion wave; bounded learned/adaptive live influence eligible first |
| ADR-007 | Python parity means regression protection, not byte-for-byte behavioral freeze |

Cross-ADR flow: ADR-001 → ADR-004 (lease needs a long-running writer); ADR-002 is applied by ADR-003 / ADR-005 / ADR-006; ADR-003 is the load-bearing decision ADR-006 protects; ADR-007 clarifies that ADR-006 gates preserve Python-correct behavior while allowing measured native improvements.

<!-- /ANCHOR:decision-records -->

<!-- ANCHOR:related -->
## 10. RELATED

- `mcp_server/README.md`
- `mcp_server/lib/README.md`
- `mcp_server/handlers/README.md`
- `mcp_server/hooks/README.md`
- `mcp_server/skill-advisor/README.md`
- `mcp_server/skill-advisor/INSTALL_GUIDE.md`
- `mcp_server/skill-advisor/SET-UP_GUIDE.md`
- `mcp_server/code-graph/lib/README.md`
- `mcp_server/code-graph/handlers/README.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/decision-record.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/028-code-graph-self-contained-package/implementation-summary.md`

<!-- /ANCHOR:related -->
