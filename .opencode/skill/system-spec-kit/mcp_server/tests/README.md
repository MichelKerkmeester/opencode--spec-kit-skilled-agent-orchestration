---
title: "MCP Server Test Suite"
description: "Vitest-based unit, integration, handler, eval, and regression coverage for the MCP server."
trigger_phrases:
  - "test suite"
  - "vitest"
  - "regression tests"
---

# MCP Server Test Suite

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. STRUCTURE](#3--structure)
- [4. NOTABLE COVERAGE](#4--notable-coverage)
- [5. TROUBLESHOOTING](#5--troubleshooting)
- [6. RUNNING VERIFICATION](#6--running-verification)
- [7. RELATED](#7--related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `tests/` directory is the Vitest suite for the MCP server. As of this audit, the root inventory contains 329 `.vitest.ts` files plus the `fixtures/` support directory.

What this suite covers:

- Core cognitive behavior such as attention decay, working memory, co-activation, and tier handling.
- Search, scoring, graph, and retrieval-pipeline behavior.
- MCP handler dispatch, response envelopes, validation, and runtime startup behavior.
- Save/index regressions including content-hash dedup, quality-loop behavior, and incremental-index edge cases.
- Eval, shared-memory, governance, lineage, and public-API surfaces.

Use the current file inventory and Vitest output as the source of truth:

```bash
rg --files tests -g '*.vitest.ts' | wc -l
npx vitest run
```

<!-- /ANCHOR:overview -->
<!-- ANCHOR:quick-start -->
## 2. QUICK START

```bash
cd .opencode/skill/system-spec-kit/mcp_server

# Full suite
npx vitest run

# Single file
npx vitest run tests/attention-decay.vitest.ts

# Pattern
npx vitest run tests/handler-*.vitest.ts
```

Representative focused runs:

```bash
# Docs/config parity and public API
npx vitest run tests/feature-flag-reference-docs.vitest.ts tests/api-public-surfaces.vitest.ts

# Save/index regressions
npx vitest run tests/content-hash-dedup.vitest.ts tests/handler-memory-index-cooldown.vitest.ts tests/memory-save-pipeline-enforcement.vitest.ts

# Shared-memory surface
npx vitest run tests/shared-memory-handlers.vitest.ts tests/shared-spaces.vitest.ts
```

<!-- /ANCHOR:quick-start -->
<!-- ANCHOR:structure -->
## 3. STRUCTURE

This directory is too large for a byte-for-byte README listing, so treat the groups below as a live category map and rely on `rg --files` for the full inventory.

| Category | Representative Files | Notes |
|---|---|---|
| Cognitive and memory state | `attention-decay.vitest.ts`, `working-memory.vitest.ts`, `co-activation.vitest.ts`, `tier-classifier.vitest.ts`, `temporal-contiguity.vitest.ts` | Human-memory-inspired retrieval behavior |
| Search and ranking | `hybrid-search.vitest.ts`, `bm25-index.vitest.ts`, `query-router.vitest.ts`, `dynamic-token-budget.vitest.ts`, `result-confidence-scoring.vitest.ts` | Retrieval, ranking, and profile/trace behavior |
| Handler and protocol surface | `handler-memory-search.vitest.ts`, `handler-memory-save.vitest.ts`, `mcp-input-validation.vitest.ts`, `mcp-response-envelope.vitest.ts`, `startup-checks.vitest.ts` | MCP entrypoints and server-facing responses |
| Save/index regressions | `content-hash-dedup.vitest.ts`, `memory-save-dedup-order.vitest.ts`, `handler-memory-index-cooldown.vitest.ts`, `chunking-orchestrator-swap.vitest.ts`, `memory-save-ux-regressions.vitest.ts` | Refinement work covered by this audit family |
| Eval and reporting | `ablation-framework.vitest.ts`, `bm25-baseline.vitest.ts`, `reporting-dashboard.vitest.ts`, `eval-logger.vitest.ts`, `memory-state-baseline.vitest.ts` | Baselines, ablations, dashboard, and telemetry |
| Shared memory and governance | `shared-memory-handlers.vitest.ts`, `shared-spaces.vitest.ts`, `governance-e2e.vitest.ts`, `memory-governance.vitest.ts` | Scope enforcement, actor auth, and collab lifecycle |
| Public API and docs parity | `api-public-surfaces.vitest.ts`, `feature-flag-reference-docs.vitest.ts`, `hydra-spec-pack-consistency.vitest.ts` | Public imports and documentation alignment |
| Infrastructure and utilities | `batch-processor.vitest.ts`, `tool-input-schema.vitest.ts`, `transaction-manager.vitest.ts`, `retry-manager-health.vitest.ts`, `vector-index-store-remediation.vitest.ts` | Shared helpers and runtime hardening |

Support assets:

- `fixtures/` - sample documents and fixture data used by targeted suites.

<!-- /ANCHOR:structure -->
<!-- ANCHOR:notable-coverage -->
## 4. NOTABLE COVERAGE

Recent/high-signal suites relevant to the memory database refinement work:

- `content-hash-dedup.vitest.ts` - same-path and cross-path content-hash dedup behavior.
- `interference.vitest.ts` - interference scoring and retrieval penalty behavior.
- `batch-processor.vitest.ts` - retry-aware batch helper semantics used by ingestion/index flows.
- `quality-loop.vitest.ts` - verify-fix-verify scoring and rejection behavior.
- `handler-memory-index-cooldown.vitest.ts` - scan cooldown, stale-delete behavior, and partial-failure handling.
- `shared-memory-handlers.vitest.ts` and `shared-spaces.vitest.ts` - shared-memory auth, lifecycle, and rollout behavior.
- `api-public-surfaces.vitest.ts` - public `api/` export contract.
- `context-server-error-envelope.vitest.ts`, `envelope.vitest.ts`, and `response-profile-formatters.vitest.ts` - serialized response and profile behavior.

<!-- /ANCHOR:notable-coverage -->
<!-- ANCHOR:troubleshooting -->
## 5. TROUBLESHOOTING

Common checks:

```bash
# Current test inventory
rg --files tests -g '*.vitest.ts' | wc -l

# Verify Vitest is available
npx vitest --version

# macOS temp-dir workaround used elsewhere in this repo
TMPDIR=.tmp/vitest-tmp npx vitest run
```

Typical issues:

- DB path problems: set `MEMORY_DB_PATH` to a writable location.
- Provider-dependent tests: export the needed embedding API key or run targeted suites that mock providers.
- Large-suite flakiness: prefer targeted file/pattern runs first, then full-suite verification.

<!-- /ANCHOR:troubleshooting -->
<!-- ANCHOR:verification -->
## 6. RUNNING VERIFICATION

Recommended documentation-adjacent verification for this README audit:

```bash
cd .opencode/skill/system-spec-kit/mcp_server

npx vitest run tests/api-public-surfaces.vitest.ts
npx vitest run tests/feature-flag-reference-docs.vitest.ts
```

Broader confidence runs:

```bash
npx vitest run tests/shared-memory-handlers.vitest.ts tests/shared-spaces.vitest.ts
npx vitest run tests/content-hash-dedup.vitest.ts tests/quality-loop.vitest.ts tests/batch-processor.vitest.ts
```

<!-- /ANCHOR:verification -->
<!-- ANCHOR:related -->
## 7. RELATED

- `../README.md`
- `../handlers/README.md`
- `../api/README.md`
- `../lib/README.md`

<!-- /ANCHOR:related -->
