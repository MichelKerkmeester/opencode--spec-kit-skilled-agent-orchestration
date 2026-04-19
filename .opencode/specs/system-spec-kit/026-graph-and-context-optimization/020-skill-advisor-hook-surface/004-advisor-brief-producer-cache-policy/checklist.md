---
title: "Verification Checklist: Advisor Brief Producer + Cache Policy"
description: "Level 2 verification for 020/004. Populate post-implementation."
trigger_phrases:
  - "020 004 checklist"
importance_tier: "critical"
contextType: "checklist"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Checklist scaffolded"
    next_safe_action: "Populate post-implementation"
    blockers: []
    key_files: []

---
# Verification Checklist: Advisor Brief Producer + Cache Policy

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

- [ ] CHK-001 [P0] Spec scope + 10 acceptance scenarios reviewed
- [ ] CHK-002 [P0] Predecessors 002 + 003 merged
- [ ] CHK-003 [P0] Fail-open contract from research.md §Failure Modes confirmed
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `buildSkillAdvisorBrief()` exported
- [ ] CHK-011 [P0] `shouldFireAdvisor()` exported from `prompt-policy.ts`
- [ ] CHK-012 [P0] HMAC prompt cache uses session-scoped secret
- [ ] CHK-013 [P0] No similarity-only cache branch (research.md §Rejected)
- [ ] CHK-014 [P0] NFKC canonical fold applied before policy + cache
- [ ] CHK-015 [P0] Subprocess timeout 1000ms enforced
- [ ] CHK-016 [P0] SQLite-busy single retry (75-125ms, ≥500ms budget)
- [ ] CHK-017 [P0] Deleted-skill cache suppression
- [ ] CHK-018 [P0] Fail-open mapping for all error modes
- [ ] CHK-019 [P0] Envelope wrapping via 002's `createSharedPayloadEnvelope`
- [ ] CHK-020 [P0] Token caps 60/80/120 enforced at producer
- [ ] CHK-021 [P0] `tsc --noEmit` clean
- [ ] CHK-022 [P1] Metalinguistic suppression diagnostic recorded
- [ ] CHK-023 [P1] `AdvisorHookMetrics` populated
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-030 [P0] Acceptance Scenario 1: empty prompt skip
- [ ] CHK-031 [P0] Acceptance Scenario 2: work-intent prompt fires
- [ ] CHK-032 [P0] Acceptance Scenario 3: exact cache hit
- [ ] CHK-033 [P0] Acceptance Scenario 4: cache invalidation on signature change
- [ ] CHK-034 [P0] Acceptance Scenario 5: Python missing fail-open
- [ ] CHK-035 [P0] Acceptance Scenario 6: subprocess timeout fail-open
- [ ] CHK-036 [P0] Acceptance Scenario 7: SQLite busy retry
- [ ] CHK-037 [P0] Acceptance Scenario 8: deleted-skill suppression
- [ ] CHK-038 [P0] Acceptance Scenario 9: metalinguistic diagnostic
- [ ] CHK-039 [P0] Acceptance Scenario 10: raw prompt never persisted
- [ ] CHK-040 [P0] Warm-cache producer p95 ≤ 10 ms
- [ ] CHK-041 [P0] Cold producer p95 ≤ 1100 ms
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-050 [P0] Raw prompt never logged
- [ ] CHK-051 [P0] Raw prompt never in cache key cleartext
- [ ] CHK-052 [P0] Raw prompt never in envelope source refs
- [ ] CHK-053 [P0] Subprocess env never receives prompt fingerprint
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-060 [P1] spec/plan/tasks synchronized
- [ ] CHK-061 [P1] implementation-summary.md with bench results
- [ ] CHK-062 [P2] Inline JSDoc on exported types
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-070 [P1] 4 lib files under `mcp_server/lib/skill-advisor/`
- [ ] CHK-071 [P1] 4 test files under `mcp_server/tests/`
- [ ] CHK-072 [P1] No orphan files
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Status: Pending

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 26 | 0/26 |
| P1 Items | 7 | 0/7 |
| P2 Items | 1 | 0/1 |
<!-- /ANCHOR:summary -->
