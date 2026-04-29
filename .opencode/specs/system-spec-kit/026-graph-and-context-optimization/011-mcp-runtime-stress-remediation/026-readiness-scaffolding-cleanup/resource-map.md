---
title: "Resource Map: 026 Readiness Scaffolding Cleanup"
description: "Path ledger for vestigial readiness scaffolding removal across 8 production files + 18 test files + packet docs."
trigger_phrases:
  - "026-readiness-scaffolding-cleanup resource map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/026-readiness-scaffolding-cleanup"
    last_updated_at: "2026-04-29T10:15:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored lean resource-map for today batch"
    next_safe_action: "Reference for blast-radius audit; refresh on next material change"
    blockers: []
    completion_pct: 100
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 32
- **By category**: Scripts=8, Tests=18, Specs=5, Meta=1
- **Missing on disk**: 0
- **Scope**: Files modified during packet `026/011/026-readiness-scaffolding-cleanup` (commit `733ce07c3`). Pure cleanup — no new code added; ~30 net LOC removed.
- **Generated**: 2026-04-29T10:10:00+02:00

> **Production runtime equivalence preserved.** Removed scaffolding was no-op post T016-T019 lazy-loading migration.

---

## 1. Scripts (production)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts` | Updated | OK | Removed `embeddingModelReady` flag + `isEmbeddingModelReady` + `setEmbeddingModelReady` + `waitForEmbeddingModel` |
| `.opencode/skill/system-spec-kit/mcp_server/core/index.ts` | Updated | OK | Removed re-exports of all 3 readiness functions |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | Updated | OK | Removed import + `startupScan` no-op wait + bootstrap `setEmbeddingModelReady(true)` + T016-T019 comments |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts` | Updated | OK | Removed re-exports |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts` | Updated | OK | Removed re-exports |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Updated | OK | Removed dead readiness-flag dependency for hint generation |
| `.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts` | Updated | OK | Removed warmup readiness marker |
| `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts` | Updated | OK | Removed scheduler readiness wait |

---

## 2. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts` | Updated | OK | Removed mock vi.fn |
| `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts` | Updated | OK | Removed mock list entries |
| `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-benchmark-memory-search.vitest.ts` | Updated | OK | Removed mock vi.fn |
| `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-4-stage-search-pipeline.vitest.ts` | Updated | OK | Removed mock (preflight grep find) |
| `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-constitutional-memory.vitest.ts` | Updated | OK | Removed mock (preflight grep find) |
| `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-embedding-semantic-search.vitest.ts` | Updated | OK | Removed mock (preflight grep find) |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts` | Updated | OK | Removed mock vi.fn |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts` | Updated | OK | Removed mock (preflight find) |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts` | Updated | OK | Removed T519-H2 + T519-H2b test cases + mock list entry |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts` | Updated | OK | Removed mock |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.resume-gate-d.vitest.ts` | Updated | OK | Removed 2 mock blocks |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts` | Updated | OK | Removed mock |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts` | Updated | OK | Removed mock |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts` | Updated | OK | Removed 2 mock blocks |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts` | Updated | OK | Removed mock |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts` | Updated | OK | Removed mock |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts` | Updated | OK | Removed mock |
| `.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts` | Updated | OK | Removed mock |
| `.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts` | Updated | OK | Removed mock |

---

## 3. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `spec.md` | Created | OK | Level 1 charter |
| `plan.md` | Created | OK | Plan |
| `tasks.md` | Created | OK | Task ledger |
| `implementation-summary.md` | Created | OK | Disposition |
| `.../026/description.json` | Created | OK | Continuity index |

---

## 4. Meta

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.../026/graph-metadata.json` | Created | OK | Graph rollout metadata |
