---
title: "Resource Map: 025 memory_search degradedReadiness Wiring (Option C)"
description: "Path ledger for the new graph-readiness-mapper helper, handler wiring, PP-1 TC-3 flip, and W10 refactor."
trigger_phrases:
  - "025-memory-search-degraded-readiness-wiring resource map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/025-memory-search-degraded-readiness-wiring"
    last_updated_at: "2026-04-29T10:15:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored lean resource-map for today batch"
    next_safe_action: "Reference for blast-radius audit; refresh on next material change"
    blockers: []
    completion_pct: 100
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v2.2 -->

---

## Summary

- **Total references**: 13
- **By category**: Scripts=2, Tests=3, Specs=5, Scripts-cited=2, Meta=1
- **Missing on disk**: 0
- **Scope**: Files created or updated during packet `026/011/025-memory-search-degraded-readiness-wiring` (commit `bd0de4b6b`) plus cited type contracts.
- **Generated**: 2026-04-29T10:10:00+02:00

---

## 1. Scripts

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-readiness-mapper.ts` | Created | OK | Shared `mapGraphReadinessToTelemetry()` helper consumed by handler + W10 |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | Updated | OK | Threaded `degradedReadiness` into `buildSearchDecisionEnvelope` (~line 1166); imports `getGraphReadinessSnapshot` + mapper |

---

## 2. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-readiness-mapper.vitest.ts` | Created | OK | Unit tests: 4 freshness states (fresh/stale/empty/error) → `degraded` derivation |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search-live-envelope.vitest.ts` | Updated | OK | TC-3 expected_fail removed; mocks `getGraphReadinessSnapshot`, asserts envelope's `degradedReadiness.freshness` |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts` | Updated | OK | Snapshot path uses shared helper; richer `handleCodeGraphQuery` payload path stays inline |

---

## 3. Cited Contracts

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts` | Cited | OK | `getGraphReadinessSnapshot()` + `GraphReadinessSnapshot` type — non-mutating reader |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-decision-envelope.ts` | Cited | OK | `DegradedReadinessTelemetry` interface (lines 31-42) consumed by mapper |

---

## 4. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `spec.md` | Created | OK | Level 1 charter with Option-A→C architectural correction |
| `plan.md` | Created | OK | Plan |
| `tasks.md` | Created | OK | Task ledger |
| `implementation-summary.md` | Created | OK | Disposition + tsc-race incident note |
| `.../025/description.json` | Created | OK | Continuity index |

---

## 5. Meta

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.../025/graph-metadata.json` | Created | OK | Graph rollout metadata; depends_on 023 (PP-1) |
