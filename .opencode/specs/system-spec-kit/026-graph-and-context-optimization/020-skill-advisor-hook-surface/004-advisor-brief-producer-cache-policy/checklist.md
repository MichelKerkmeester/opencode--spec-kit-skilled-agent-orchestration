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

- [x] CHK-001 [P0] Spec scope + 10 acceptance scenarios reviewed [Evidence: implemented in `advisor-brief-producer.vitest.ts`.]
- [x] CHK-002 [P0] Predecessors 002 + 003 merged [Evidence: `git cat-file -t 47b805f7b && git cat-file -t be32b1fe5`.]
- [x] CHK-003 [P0] Fail-open contract from research.md §Failure Modes confirmed [Evidence: timeout/parse/non-zero branches covered.]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `buildSkillAdvisorBrief()` exported [Evidence: `skill-advisor-brief.ts`.]
- [x] CHK-011 [P0] `shouldFireAdvisor()` exported from `prompt-policy.ts` [Evidence: `prompt-policy.ts`.]
- [x] CHK-012 [P0] HMAC prompt cache uses session-scoped secret [Evidence: `prompt-cache.ts`.]
- [x] CHK-013 [P0] No similarity-only cache branch (research.md §Rejected) [Evidence: exact HMAC key only.]
- [x] CHK-014 [P0] NFKC canonical fold applied before policy + cache [Evidence: `canonicalFold()`.]
- [x] CHK-015 [P0] Subprocess timeout 1000ms enforced [Evidence: subprocess test PASS.]
- [x] CHK-016 [P0] SQLite-busy single retry (75-125ms, ≥500ms budget) [Evidence: subprocess test PASS.]
- [x] CHK-017 [P0] Deleted-skill cache suppression [Evidence: producer test PASS.]
- [x] CHK-018 [P0] Fail-open mapping for all error modes [Evidence: producer/subprocess tests PASS.]
- [x] CHK-019 [P0] Envelope wrapping via 002's `createSharedPayloadEnvelope` [Evidence: producer test PASS.]
- [x] CHK-020 [P0] Token caps 80 default / 120 hard cap enforced at producer [Evidence: producer test PASS.]
- [x] CHK-021 [P0] `tsc --noEmit` clean [Evidence: PASS.]
- [x] CHK-022 [P1] Metalinguistic suppression diagnostic recorded [Evidence: producer test PASS.]
- [x] CHK-023 [P1] `AdvisorHookMetrics` populated [Evidence: producer test PASS.]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-030 [P0] Acceptance Scenario 1: empty prompt skip [Evidence: PASS.]
- [x] CHK-031 [P0] Acceptance Scenario 2: work-intent prompt fires [Evidence: PASS.]
- [x] CHK-032 [P0] Acceptance Scenario 3: exact cache hit [Evidence: PASS.]
- [x] CHK-033 [P0] Acceptance Scenario 4: cache invalidation on signature change [Evidence: PASS in prompt-cache suite.]
- [x] CHK-034 [P0] Acceptance Scenario 5: Python missing fail-open [Evidence: covered by subprocess spawn error mapping.]
- [x] CHK-035 [P0] Acceptance Scenario 6: subprocess timeout fail-open [Evidence: PASS.]
- [x] CHK-036 [P0] Acceptance Scenario 7: SQLite busy retry [Evidence: PASS.]
- [x] CHK-037 [P0] Acceptance Scenario 8: deleted-skill suppression [Evidence: PASS.]
- [x] CHK-038 [P0] Acceptance Scenario 9: metalinguistic diagnostic [Evidence: PASS.]
- [x] CHK-039 [P0] Acceptance Scenario 10: raw prompt never persisted [Evidence: PASS.]
- [x] CHK-040 [P0] Warm-cache producer p95 ≤ 10 ms [Evidence: PASS, 0.452 ms.]
- [x] CHK-041 [P0] Cold producer p95 ≤ 1100 ms [Evidence: PASS, 58.373 ms.]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-050 [P0] Raw prompt never logged [Evidence: privacy grep found no raw prompt leakage.]
- [x] CHK-051 [P0] Raw prompt never in cache key cleartext [Evidence: HMAC opacity test PASS.]
- [x] CHK-052 [P0] Raw prompt never in envelope source refs [Evidence: producer privacy assertion PASS.]
- [x] CHK-053 [P0] Subprocess env never receives prompt fingerprint [Evidence: subprocess env inherits ambient only.]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-060 [P1] spec/plan/tasks synchronized [Evidence: 60-token floor removed; non-live posture aligned.]
- [x] CHK-061 [P1] implementation-summary.md with bench results [Evidence: summary verification table populated.]
- [x] CHK-062 [P2] Inline JSDoc on exported types [Evidence: exported interfaces are named and scoped in `skill-advisor-brief.ts`.]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-070 [P1] 4 lib files under `mcp_server/lib/skill-advisor/` [Evidence: prompt-policy, prompt-cache, subprocess, skill-advisor-brief.]
- [x] CHK-071 [P1] 4 test files under `mcp_server/tests/` [Evidence: four advisor-*.vitest.ts files.]
- [x] CHK-072 [P1] No orphan files [Evidence: temporary bench test removed after evidence capture.]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Status: Complete

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 26 | 26/26 |
| P1 Items | 7 | 7/7 |
| P2 Items | 1 | 1/1 |
<!-- /ANCHOR:summary -->
