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

- [ ] CHK-001 [P0] Spec scope + 8 acceptance scenarios reviewed
- [ ] CHK-002 [P0] Predecessor 002 (shared-payload advisor contract) merged
- [ ] CHK-003 [P0] Authority list from research.md §Pattern Parallel Map confirmed
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `getAdvisorFreshness()` exported from `lib/skill-advisor/freshness.ts`
- [ ] CHK-011 [P0] `AdvisorFreshnessResult` type matches spec shape
- [ ] CHK-012 [P0] Source-cache LRU uses 15-min TTL
- [ ] CHK-013 [P0] Generation counter uses file-atomic (temp + rename) write
- [ ] CHK-014 [P0] Per-skill fingerprint map populated
- [ ] CHK-015 [P0] JSON fallback flagged `stale`/`degraded`, never `live`
- [ ] CHK-016 [P0] Rename/delete suppression verified
- [ ] CHK-017 [P0] `tsc --noEmit` clean
- [ ] CHK-018 [P1] `diagnostics.reason` populated on every non-`live` state
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Acceptance Scenario 1: live state round-trip
- [ ] CHK-021 [P0] Acceptance Scenario 2: stale on source edit
- [ ] CHK-022 [P0] Acceptance Scenario 3: absent on missing artifact
- [ ] CHK-023 [P0] Acceptance Scenario 4: rename/delete suppression
- [ ] CHK-024 [P0] Acceptance Scenario 5: JSON fallback stale
- [ ] CHK-025 [P0] Acceptance Scenario 6: generation counter monotonicity
- [ ] CHK-026 [P0] Acceptance Scenario 7: source cache hit within TTL
- [ ] CHK-027 [P0] Acceptance Scenario 8: cache invalidation on signature change
- [ ] CHK-028 [P0] Cold probe p95 ≤ 200 ms recorded
- [ ] CHK-029 [P0] Warm probe p95 ≤ 30 ms recorded
- [ ] CHK-030 [P0] Existing `code-graph-freshness*.vitest.ts` green (no regression)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] Generation counter file contains no user data
- [ ] CHK-041 [P0] Source-cache key never includes prompt content
- [ ] CHK-042 [P1] Probe is read-only except for cache + generation writes
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] spec/plan/tasks synchronized
- [ ] CHK-051 [P1] Bench results recorded in implementation-summary.md
- [ ] CHK-052 [P2] Inline JSDoc on exported types
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] `.opencode/skill/.advisor-state/` gitignored
- [ ] CHK-061 [P1] No orphan files
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Status: Pending

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 20 | 0/20 |
| P1 Items | 7 | 0/7 |
| P2 Items | 1 | 0/1 |
<!-- /ANCHOR:summary -->
