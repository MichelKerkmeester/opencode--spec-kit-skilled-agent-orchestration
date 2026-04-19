---
title: "Implementation Plan: Advisor Freshness + Source Cache"
description: "Three new lib files under mcp_server/lib/skill-advisor/: freshness.ts, source-cache.ts, generation.ts. Mirrors lib/code-graph/freshness.ts shape; extends with per-skill fingerprints and generation tagging."
trigger_phrases:
  - "020 003 plan"
  - "advisor freshness plan"
importance_tier: "critical"
contextType: "plan"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/003-advisor-freshness-and-source-cache"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Plan scaffolded"
    next_safe_action: "Dispatch /spec_kit:implement :auto after 002 converges"
    blockers: []
    key_files: []

---
# Implementation Plan: Advisor Freshness + Source Cache

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (strict, ESM) |
| **New Module** | `mcp_server/lib/skill-advisor/` (3 files) |
| **Testing** | vitest |
| **Pattern Reference** | `lib/code-graph/freshness.ts` (direct shape analog) |

### Overview

Ship `getAdvisorFreshness(workspaceRoot)` analogous to `getGraphFreshness()`. Extends the code-graph authority pattern with per-skill fingerprints (for rename/delete suppression) and a workspace-scoped generation counter (for concurrency safety). Backs a 15-min source-cache LRU so the producer in 004 does not repeat full walks.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Child 002 (shared-payload advisor contract) shipped — provides trust-state enum alignment
- [x] 001-initial-research converged
- [x] Authority list captured in research.md §Pattern Parallel Map

### Definition of Done
- [ ] 8 acceptance scenarios green (`advisor-freshness.vitest.ts`)
- [ ] Probe latency benchmarks recorded (implementation-summary.md)
- [ ] `tsc --noEmit` clean
- [ ] Existing code-graph-freshness tests unaffected
- [ ] All P0 checklist items `[x]` with evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Mirror `lib/code-graph/freshness.ts` with extended fingerprint map + generation tagging. Pure functions — no global singletons beyond the workspace-scoped cache.

### Key Components

```
mcp_server/
  lib/skill-advisor/                       NEW directory
    freshness.ts                           getAdvisorFreshness(workspaceRoot)
    source-cache.ts                        15-min LRU keyed by workspace + source signature
    generation.ts                          monotonic counter with file-atomic write
  tests/
    advisor-freshness.vitest.ts            NEW — 8 scenarios
.opencode/skill/
  .advisor-state/                          NEW (gitignored)
    generation.json                        per-workspace counter
```

### Data Flow

```
getAdvisorFreshness(workspaceRoot)
  ├─ sourceCache.get(workspaceRoot) → hit? revalidate stat only
  │                                   miss? full walk
  ├─ walk authorities: SKILL.md × N, graph-metadata.json × N,
  │   skill_advisor.py, skill_advisor_runtime.py,
  │   skill_graph_compiler.py, skill-graph.sqlite, skill-graph.json
  ├─ compute sourceSignature = hash(paths + mtimes + sizes)
  ├─ compute skillFingerprints per SKILL.md + its graph-metadata.json
  ├─ read generation counter; if cache signature diverges → generation++
  ├─ derive state:
  │   ├─ SQLite missing + no JSON → "absent"
  │   ├─ SQLite exists + all sources <= SQLite mtime → "live"
  │   ├─ SQLite exists + any source newer → "stale"
  │   ├─ only JSON fallback → "stale" (never live)
  │   └─ corrupt / unreadable → "unavailable"
  ├─ sourceCache.set(workspaceRoot, result, ttl=15min)
  └─ return AdvisorFreshnessResult
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Skeleton + types
- [ ] Create `mcp_server/lib/skill-advisor/` directory
- [ ] Define `AdvisorFreshnessResult` type (matches spec.md §3 shape)
- [ ] Create stub `freshness.ts`, `source-cache.ts`, `generation.ts`

### Phase 2: Core probe
- [ ] Implement source walk + hash (authorities per spec.md §3)
- [ ] Implement state mapping (live/stale/absent/unavailable)
- [ ] Implement per-skill fingerprint map

### Phase 3: Cache + generation
- [ ] Implement 15-min LRU in `source-cache.ts`
- [ ] Implement generation counter with temp+rename atomic write
- [ ] Wire cache + generation into `getAdvisorFreshness()`
- [ ] Add `.opencode/skill/.advisor-state/` to `.gitignore`

### Phase 4: Tests
- [ ] `advisor-freshness.vitest.ts` — 8 acceptance scenarios
- [ ] Bench lanes: cold / warm / concurrent

### Phase 5: Verification
- [ ] All tests green
- [ ] `tsc --noEmit` clean
- [ ] Record p50/p95/p99 in implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | State mapping, fingerprint computation | vitest |
| Unit | Source-cache LRU + TTL + signature invalidation | vitest |
| Unit | Generation counter atomicity | vitest |
| Integration | Full probe against fixture workspace | vitest |
| Bench | Cold vs warm probe p50/p95/p99 | vitest bench |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| Child 002 (shared-payload contract) | Predecessor | Blocked until 002 merges |
| `fs/promises` + `node:crypto` | Node stdlib | Live |
| vitest | Dev | Live |
| `code-graph/freshness.ts` | Pattern reference | Live |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

**Trigger**: `getAdvisorFreshness()` throws under any tested condition OR probe latency p95 > 500 ms.

**Procedure**: revert the commit. Child 004 is not yet built; no upstream callers depend on this module.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Skeleton) ──► Phase 2 (Core probe) ──► Phase 3 (Cache + gen) ──► Phase 4 (Tests) ──► Phase 5 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Skeleton | 002 merged | Core |
| Core | Skeleton | Cache |
| Cache + gen | Core | Tests |
| Tests | Cache | Verify |
| Verify | Tests | Child 004 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Skeleton + types | Low | 1 hour |
| Core probe | Med | 2-3 hours |
| Cache + generation | Med | 2-3 hours |
| Tests | Med | 2-3 hours |
| Verification | Low | 1 hour |
| **Total** | | **8-11 hours (0.75-1.25 days)** |
<!-- /ANCHOR:effort -->
