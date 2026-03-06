# Eval Scripts

> Evaluation and benchmarking runners for spec-kit memory system.

## Purpose

Scripts in this directory evaluate memory system quality, performance, and correctness. They run as CLI tools via `npx tsx`.

## Import Policy

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
- `run-chk210-quality-backfill.ts` — allowlisted internal runtime import for quality backfill parsing

## Script Inventory

| Script | Purpose |
|--------|---------|
| `collect-redaction-calibration-inputs.ts` | Collect input data for redaction calibration tuning |
| `map-ground-truth-ids.ts` | Map ground truth identifiers for evaluation datasets |
| `run-ablation.ts` | Run channel ablation studies (disable channels to measure impact) |
| `run-bm25-baseline.ts` | Run BM25 baseline benchmarks for search comparison |
| `run-chk210-quality-backfill.ts` | Backfill CHK-210 quality scores for existing memories |
| `run-performance-benchmarks.ts` | Run performance benchmarks across memory operations |
| `run-phase1-5-shadow-eval.ts` | Run Phase 1.5 shadow evaluation pipeline |
| `run-phase2-closure-metrics.mjs` | Collect Phase 2 closure metrics for evaluation reporting |
| `run-phase3-telemetry-dashboard.ts` | Generate Phase 3 telemetry dashboard data |
| `run-quality-legacy-remediation.ts` | Remediate legacy quality issues in memory entries |
| `run-redaction-calibration.ts` | Calibrate redaction thresholds for sensitive content filtering |
| `check-architecture-boundaries.ts` | Enforce shared/ neutrality and mcp_server/scripts/ wrapper-only rules |

## Reference

- [Architecture Boundaries](../../ARCHITECTURE_BOUNDARIES.md)
- [Import Policy Allowlist](./import-policy-allowlist.json)
