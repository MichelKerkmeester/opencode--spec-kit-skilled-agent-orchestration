---
title: "Eval Scripts"
description: "Evaluation and benchmarking runners for spec-kit memory system quality, performance, and correctness."
trigger_phrases:
  - "eval scripts"
  - "run benchmarks"
  - "import policy"
  - "architecture boundaries"
---


# Eval Scripts

> Evaluation and benchmarking runners for spec-kit memory system.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. IMPORT POLICY](#2--import-policy)
- [3. SCRIPT INVENTORY](#3--script-inventory)
- [4. REFERENCE](#4--reference)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

Scripts in this directory evaluate memory system quality, performance, and correctness. They run as CLI tools via `npx tsx`.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:import-policy -->
## 2. IMPORT POLICY

| Source | Status | Notes |
|--------|--------|-------|
| `../../mcp_server/api` | **Preferred** | Public boundary surface |
| `../../mcp_server/api/*` | **Preferred** | Narrow public modules for specific workflows |
| `../../shared/` | **Allowed** | Shared utilities |
| `@spec-kit/mcp-server/{lib,core,handlers}*` | **Prohibited** | Internal runtime imports -- use api/ instead |

### Exception Process

If a script requires direct internal runtime access:
1. Add an entry to `import-policy-allowlist.json` in this directory
2. Include: file path, import, owner, reason, removeWhen, createdAt, lastReviewedAt, and expiresAt (required for wildcards)
3. The import-policy checkers validate `lib`, `core`, `handlers`, and relative `../../mcp_server/*` runtime paths

### Current Exceptions

- `run-performance-benchmarks.ts` — allowlisted internal runtime imports for benchmark-specific metrics

<!-- /ANCHOR:import-policy -->
<!-- ANCHOR:script-inventory -->
## 3. SCRIPT INVENTORY

| Script | Purpose |
|--------|---------|
| `check-allowlist-expiry.ts` | Warn on near-expiry and fail on expired allowlist exceptions |
| `check-architecture-boundaries.ts` | Enforce shared/ neutrality and mcp_server/scripts/ wrapper-only rules |
| `check-handler-cycles-ast.ts` | Detect circular import/re-export dependencies in mcp_server/handlers via AST |
| `check-no-mcp-lib-imports.ts` | Scan scripts/ for prohibited internal runtime imports against allowlist |
| `check-no-mcp-lib-imports-ast.ts` | AST-based enforcement for prohibited internal runtime imports with transitive re-export traversal |
| `collect-redaction-calibration-inputs.ts` | Collect input data for redaction calibration tuning |
| `import-policy-rules.ts` | Shared detection rules for prohibited scripts-to-internal-runtime imports |
| `map-ground-truth-ids.ts` | Map ground truth identifiers for evaluation datasets; rerun after DB rebuilds or eval DB swaps before comparing baselines or ablation deltas |
| `run-ablation.ts` | Run channel ablation studies (disable channels to measure impact), warn on missing `groundTruthQueryIds`, and surface truncated investigation-only runs when token budget overflow prevents a reliable Recall@K result |
| `run-bm25-baseline.ts` | Run BM25 baseline benchmarks for search comparison |
| `run-performance-benchmarks.ts` | Run performance benchmarks across memory operations |
| `run-phase2-closure-metrics.mjs` | Collect Phase 2 closure metrics for evaluation reporting |
| `run-redaction-calibration.ts` | Calibrate redaction thresholds for sensitive content filtering |

**Supporting data:**

- `import-policy-allowlist.json` — Exception allowlist for prohibited import policy

<!-- /ANCHOR:script-inventory -->
<!-- ANCHOR:reference -->
## 4. REFERENCE

- [Architecture Boundaries](../../ARCHITECTURE.md)
- [Import Policy Allowlist](./import-policy-allowlist.json)
<!-- /ANCHOR:reference -->
