---
title: "Implementation Plan: Post-Review Remediation"
description: "2-wave parallel agent delegation strategy to remediate 21 P0/P1 findings from 25-agent comprehensive review of the Spec Kit Memory MCP server."
trigger_phrases:
  - "remediation plan"
  - "wave 1 wave 2"
  - "agent delegation"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: Post-Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Spec Kit Memory MCP server) |
| **Framework** | MCP SDK, SQLite, Vitest |
| **Storage** | SQLite (better-sqlite3) |
| **Testing** | Vitest |

### Overview
Two-wave parallel agent strategy: Wave 1 (5 Opus agents) handles P0 blockers and complex P1 code logic fixes; Wave 2 (5 Sonnet agents) handles P1 standards, error handling, and documentation fixes. All agents run in isolation with summary-mode returns (max 30 lines).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (tsc, test, build)
- [x] Dependencies identified (none external)

### Definition of Done
- [ ] All P0 findings resolved
- [ ] All P1 findings resolved
- [ ] `tsc --noEmit` passes
- [ ] `npm test` passes
- [ ] `npm run build` passes
- [ ] MCP smoke test passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Wave 1: P0 + Complex P1 Code Fixes (5 Opus Agents, Parallel)

| Agent | Scope | Files | Findings | Est. TCB |
|-------|-------|-------|----------|----------|
| Opus-A | Schema & DB | `vector-index-impl.ts`, `reconsolidation.vitest.ts` | P0-1, P0-2, P1-10 | ~8 |
| Opus-B | Pipeline V2 | `memory-search.ts`, `mmr-reranker.ts`, `co-activation.ts` | P1-3, P1-4 | ~10 |
| Opus-C | Save Refactor | `memory-save.ts` | P1-5 | ~8 |
| Opus-D | Search Fixes | `query-expander.ts`, `graph-search-fn.ts`, `co-activation.ts` | P1-6, P1-8, P1-9 | ~10 |
| Opus-E | Eval Fix | `eval-metrics.ts` | P1-7 | ~6 |

### Wave 2: P1 Standards + Documentation (5 Sonnet Agents, Parallel)

| Agent | Scope | Files | Findings | Est. TCB |
|-------|-------|-------|----------|----------|
| Sonnet-A | Error Handling | 5 files + `stage3-rerank.ts` | P1-11, P1-12 | ~10 |
| Sonnet-B | Comment Standards | `save-quality-gate.ts` | P1-13, P1-16 | ~8 |
| Sonnet-C | Import/Format | `memory-context.ts`, `hybrid-search.ts`, `memory-save.ts` | P1-14, P1-15 | ~8 |
| Sonnet-D | Section Dividers | `composite-scoring.ts`, `tool-schemas.ts` | P1-17 | ~8 |
| Sonnet-E | Documentation | `summary_of_*.md` | P1-18, P1-20, P1-21 | ~8 |

### Phase 3: Verification
- [ ] `tsc --noEmit` passes
- [ ] `npm test` passes
- [ ] `npm run build` passes
- [ ] MCP smoke test passes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Type Check | Full compilation | `tsc --noEmit` |
| Unit/Integration | Full test suite | `vitest` |
| Build | Production build | `npm run build` |
| Smoke | MCP tools | `memory_health`, `memory_stats` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: tsc or test failures after changes
- **Procedure**: `git checkout -- .` on affected files
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Wave 1 (5 Opus, parallel) ──► Wave 2 (5 Sonnet, parallel) ──► Verification ──► Finalize
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Wave 1 | Spec folder created | Wave 2 |
| Wave 2 | Wave 1 complete | Verification |
| Verification | Wave 2 complete | Finalize |
| Finalize | Verification passes | None |
<!-- /ANCHOR:phase-deps -->
