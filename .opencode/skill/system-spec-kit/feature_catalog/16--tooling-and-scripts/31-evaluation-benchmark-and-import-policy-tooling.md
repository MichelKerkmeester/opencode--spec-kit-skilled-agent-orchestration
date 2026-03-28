---
title: "Evaluation, benchmark, and import-policy tooling"
description: "Operator-facing eval runners and policy checks that measure retrieval quality, benchmark runtime behavior, and enforce architectural import boundaries for system-spec-kit scripts."
---

# Evaluation, benchmark, and import-policy tooling

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

`scripts/evals/` is the tooling surface for measuring retrieval quality, benchmarking memory-system latency, and enforcing script-side import and boundary policy.

The requested files split into two groups. `run-ablation.ts`, `run-bm25-baseline.ts`, `run-performance-benchmarks.ts`, and `map-ground-truth-ids.ts` are operator-facing eval runners and provenance helpers that execute against live or synthetic data and emit machine-readable artifacts. `check-architecture-boundaries.ts`, `check-handler-cycles-ast.ts`, and `import-policy-rules.ts` are guardrails that keep `shared/`, `mcp_server/`, and `scripts/` aligned with the documented architecture and import contract.

---

## 2. CURRENT REALITY

`run-ablation.ts` is the controlled channel-ablation CLI. It requires `SPECKIT_ABLATION=true`, opens the production `context-index.sqlite`, initializes hybrid search plus the eval database, converts disabled channels into `hybridSearchEnhanced()` flags, runs the ablation report through the public `../../mcp_server/api` surface, stores snapshot metrics in `speckit-eval.db`, prints a markdown report, and writes the full JSON payload to `/tmp/ablation-result.json`. Clean comparisons depend on provenance: the ground-truth JSON must match the same parent-memory DB, and token-budget truncation that collapses candidate sets below `recallK` should be treated as an invalid benchmark run.

`run-bm25-baseline.ts` is the BM25-only contingency benchmark. It opens the production database in read-only mode, verifies FTS5 availability, initializes the eval database, loads ground-truth rows, adapts `fts5Bm25Search()` to the baseline runner contract, records baseline metrics, prints both the metric summary and the contingency decision, includes bootstrap 95 percent confidence interval details when present, and writes `/tmp/bm25-baseline-result.json`.

`run-performance-benchmarks.ts` is the performance harness for the memory-system boost and extraction features. It must be run with `tsx`, requires a spec-folder path, creates an in-memory benchmark database with synthetic `memory_index`, `working_memory`, and `causal_edges` rows, temporarily enables the session-boost, causal-boost, extraction, and event-decay flags, measures p95 latency for session boost, causal traversal, extraction hooks, a 1000-request concurrent load test, and boosted-vs-baseline comparisons, then writes both `performance-benchmark-metrics.json` and `performance-benchmark-report.md` into the target spec folder's `scratch/` directory.

`map-ground-truth-ids.ts` is the read-only ground-truth provenance helper. It opens the production `context-index.sqlite` in read-only mode, scores candidate parent memories for each non-negative query, writes a preview artifact to `/tmp/ground-truth-id-mapping.json`, and gives operators a concrete way to confirm whether `ground-truth.json` still matches the live parent-memory ID space after DB rebuilds or imports.

`check-architecture-boundaries.ts` is the architecture-policy enforcer for two documented gaps. GAP A walks all source files under `shared/` and rejects imports that reach into `mcp_server/` or `scripts/`, whether by relative path, absolute path, or `@spec-kit/*` package prefix. GAP B scans top-level `mcp_server/scripts/*.ts` wrappers and fails anything that is too large, lacks `child_process` usage, or does not delegate to `scripts/dist/`, which keeps wrapper files thin and prevents business logic from drifting into the compatibility layer.

`check-handler-cycles-ast.ts` is the handler-cycle detector. It resolves the handlers root across source, compiled, and current-working-directory layouts, parses imports and re-exports with the TypeScript AST, builds a local dependency graph for `mcp_server/handlers`, and exits non-zero with a readable cycle chain if circular dependencies are detected.

`import-policy-rules.ts` is the shared import-policy predicate used by the import-boundary checks in this directory. It normalizes both relative and package-scoped import paths, collapses `..` traversal segments, and flags any path that reaches `@spec-kit/mcp-server/{lib,core,handlers}` or relative `../mcp_server/(lib|core|handlers)` internals. Together with `scripts/evals/README.md`, it encodes the current policy that eval scripts should prefer the public `api/` boundary and use narrow exceptions only through the allowlist workflow.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts` | Eval CLI | Runs channel ablation studies against the production hybrid-search stack and persists report artifacts |
| `.opencode/skill/system-spec-kit/scripts/evals/run-bm25-baseline.ts` | Eval CLI | Measures BM25-only retrieval quality, computes contingency output, and records eval snapshots |
| `.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts` | Benchmark CLI | Executes synthetic latency and concurrency benchmarks for session boost, causal boost, and extraction hooks |
| `.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts` | Provenance CLI | Audits or previews ground-truth parent-memory ID mappings against the production DB |
| `.opencode/skill/system-spec-kit/scripts/evals/check-architecture-boundaries.ts` | Policy checker | Enforces `shared/` neutrality and `mcp_server/scripts/` wrapper-only rules |
| `.opencode/skill/system-spec-kit/scripts/evals/check-handler-cycles-ast.ts` | Policy checker | Detects circular import and re-export dependencies inside `mcp_server/handlers` |
| `.opencode/skill/system-spec-kit/scripts/evals/import-policy-rules.ts` | Shared rule module | Normalizes candidate import paths and decides whether they violate the eval import policy |
| `.opencode/skill/system-spec-kit/scripts/evals/README.md` | Documentation | Documents script inventory, preferred import boundaries, and the allowlist-based exception process |

---

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Source feature title: Evaluation, benchmark, and import-policy tooling
- Source spec: Deep research remediation 2026-03-26
- Current reality source: direct audit of the `scripts/evals/` runners, boundary checks, and import-policy helper modules
