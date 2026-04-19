---
title: "Verification Checklist: Advisor Freshness + Source Cache"
description: "Level 2 verification for 020/003. Populate post-implementation."
trigger_phrases:
  - "020 003 checklist"
importance_tier: "critical"
contextType: "checklist"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/003-advisor-freshness-and-source-cache"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Checklist scaffolded"
    next_safe_action: "Populate post-implementation"
    blockers: []
    key_files: []

---
# Verification Checklist: Advisor Freshness + Source Cache

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Spec scope + 8 acceptance scenarios reviewed. [EVIDENCE: `spec.md` reviewed; `advisor-freshness.vitest.ts` covers AS1-AS10.]
- [x] CHK-002 [P0] Predecessor 002 (shared-payload advisor contract) merged. [EVIDENCE: `git log --oneline -3` shows `47b805f7b feat(020/002)` and `9c5fa135b docs(020/002)`.]
- [x] CHK-003 [P0] Authority list from research.md §Pattern Parallel Map confirmed. [EVIDENCE: wave-1 Pattern Parallel Map and wave-2 X7/X8 were read before implementation.]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `getAdvisorFreshness()` exported from `lib/skill-advisor/freshness.ts`. [EVIDENCE: exported function exists in `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts`.]
- [x] CHK-011 [P0] `AdvisorFreshnessResult` type matches spec shape. [EVIDENCE: type includes state, generation, source signature, per-skill map, fallback mode, probe time, and diagnostics.]
- [x] CHK-012 [P0] Source-cache LRU uses 15-min TTL. [EVIDENCE: `ADVISOR_SOURCE_CACHE_TTL_MS = 15 * 60 * 1_000` in `source-cache.ts`.]
- [x] CHK-013 [P0] Generation counter uses file-atomic (temp + rename) write. [EVIDENCE: `writeGenerationAtomic()` in `generation.ts` writes a temp file then calls `renameSync()`.]
- [x] CHK-014 [P0] Per-skill fingerprint map populated. [EVIDENCE: AS1 asserts populated `alpha` fingerprint in `advisor-freshness.vitest.ts`.]
- [x] CHK-015 [P0] JSON fallback flagged `stale`/`degraded`, never `live`. [EVIDENCE: AS6 asserts `state: stale` and `fallbackMode: json`.]
- [x] CHK-016 [P0] Rename/delete suppression verified. [EVIDENCE: AS5 deletes `beta` and verifies it is absent from returned fingerprints.]
- [x] CHK-017 [P0] `tsc --noEmit` clean. [EVIDENCE: `npx tsc --noEmit` exited 0.]
- [x] CHK-018 [P1] `diagnostics.reason` populated on every non-`live` state. [EVIDENCE: AS2-AS6, AS9, and AS10 assert diagnostic reasons.]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Acceptance Scenario 1: live state round-trip. [EVIDENCE: AS1 passed in `advisor-freshness.vitest.ts`.]
- [x] CHK-021 [P0] Acceptance Scenario 2: stale on source edit. [EVIDENCE: AS2 passed in `advisor-freshness.vitest.ts`.]
- [x] CHK-022 [P0] Acceptance Scenario 3: absent on missing artifact. [EVIDENCE: AS3 passed in `advisor-freshness.vitest.ts`.]
- [x] CHK-023 [P0] Acceptance Scenario 4: rename/delete suppression. [EVIDENCE: AS5 passed in `advisor-freshness.vitest.ts`.]
- [x] CHK-024 [P0] Acceptance Scenario 5: JSON fallback stale. [EVIDENCE: AS6 passed in `advisor-freshness.vitest.ts`.]
- [x] CHK-025 [P0] Acceptance Scenario 6: generation counter monotonicity. [EVIDENCE: AS7 passed in `advisor-freshness.vitest.ts`.]
- [x] CHK-026 [P0] Acceptance Scenario 7: source cache hit within TTL. [EVIDENCE: AS8 passed in `advisor-freshness.vitest.ts`.]
- [x] CHK-027 [P0] Acceptance Scenario 8: cache invalidation on signature change. [EVIDENCE: AS8 passed in `advisor-freshness.vitest.ts`.]
- [x] CHK-028 [P0] Cold probe p95 ≤ 200 ms recorded. [EVIDENCE: latest bench output reports cold p95 0.082 ms.]
- [x] CHK-029 [P0] Warm probe p95 ≤ 30 ms recorded. [EVIDENCE: latest bench output reports warm p95 0.090 ms.]
- [x] CHK-030 [P0] Existing `code-graph-freshness*.vitest.ts` green (no regression). [EVIDENCE: no literal file exists; `npx vitest run ensure-ready code-graph-siblings-readiness` passed 19 tests.]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] Generation counter file contains no user data. [EVIDENCE: generation payload stores only `generation` and `updatedAt`.]
- [x] CHK-041 [P0] Source-cache key never includes prompt content. [EVIDENCE: cache key is workspace root + source signature + generation.]
- [x] CHK-042 [P1] Probe is read-only except for cache + generation writes. [EVIDENCE: source walk uses stat/readdir; writes are limited to `.advisor-state/generation.json`.]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] spec/plan/tasks synchronized. [EVIDENCE: `tasks.md` marks T001-T020 complete with evidence and implementation summary records delivery.]
- [x] CHK-051 [P1] Bench results recorded in implementation-summary.md. [EVIDENCE: cold/warm p50/p95/p99 table added under Verification.]
- [x] CHK-052 [P2] Inline JSDoc on exported types. [EVIDENCE: exported freshness and generation interfaces include concise JSDoc.]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] `.opencode/skill/.advisor-state/` gitignored. [EVIDENCE: `.gitignore` includes `.opencode/skill/.advisor-state/`.]
- [x] CHK-061 [P1] No orphan files. [EVIDENCE: changed files match the locked implementation, test, gitignore, and packet-doc scope.]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Status: Complete

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 20 | 20/20 |
| P1 Items | 7 | 7/7 |
| P2 Items | 1 | 1/1 |
<!-- /ANCHOR:summary -->
