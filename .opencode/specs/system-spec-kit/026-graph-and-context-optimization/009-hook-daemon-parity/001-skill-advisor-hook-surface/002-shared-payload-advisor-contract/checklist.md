---
title: "Verification Checklist: Shared-Payload Advisor Contract"
description: "Level 2 verification for 020/002. Populate with evidence after /spec_kit:implement :auto converges."
trigger_phrases:
  - "020 002 checklist"
importance_tier: "critical"
contextType: "checklist"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/002-shared-payload-advisor-contract"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Checklist scaffolded"
    next_safe_action: "Populate after implementation"
    blockers: []
    key_files: []

---
# Verification Checklist: Shared-Payload Advisor Contract

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

- [x] CHK-001 [P0] Spec scope + 6 acceptance scenarios reviewed [EVIDENCE:spec.md §3, §5]
- [x] CHK-002 [P0] Predecessor (001-initial-research) converged [EVIDENCE:plan.md Definition of Ready]
- [x] CHK-003 [P0] Research synthesis §Pattern Parallel Map + §X9 read [EVIDENCE:research.md:46; research-extended.md:74]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Producer enum extended with `"advisor"` [EVIDENCE:shared-payload.ts:255]
- [x] CHK-011 [P0] Source enum extended with advisor sources [EVIDENCE:shared-payload.ts:162]
- [x] CHK-012 [P0] `AdvisorEnvelopeMetadata` interface exported [EVIDENCE:shared-payload.ts:200]
- [x] CHK-013 [P0] `coerceSharedPayloadEnvelope()` validates advisor metadata whitelist [EVIDENCE:shared-payload.ts:506; shared-payload.ts:943]
- [x] CHK-014 [P0] Privacy validator rejects prompt-derived provenance [EVIDENCE:shared-payload.ts:544; shared-payload.ts:550]
- [x] CHK-015 [P0] `tsc --noEmit` clean [EVIDENCE:npx tsc --noEmit PASS]
- [x] CHK-016 [P1] JSDoc references research.md [EVIDENCE:shared-payload.ts:200]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Acceptance Scenario 1 passes: valid round-trip [EVIDENCE:shared-payload-advisor.vitest.ts:43]
- [x] CHK-021 [P0] Acceptance Scenario 2 passes: unknown producer rejected [EVIDENCE:shared-payload-advisor.vitest.ts:57]
- [x] CHK-022 [P0] Acceptance Scenario 3 passes: unknown metadata key rejected [EVIDENCE:shared-payload-advisor.vitest.ts:71]
- [x] CHK-023 [P0] Acceptance Scenario 4 passes: prompt-derived provenance rejected [EVIDENCE:shared-payload-advisor.vitest.ts:85]
- [x] CHK-024 [P0] Acceptance Scenario 5 passes: multi-line skillLabel rejected [EVIDENCE:shared-payload-advisor.vitest.ts:113]
- [x] CHK-025 [P0] Acceptance Scenario 6 passes: out-of-range confidence rejected [EVIDENCE:shared-payload-advisor.vitest.ts:127]
- [x] CHK-026 [P0] Existing `shared-payload*.vitest.ts` green (no regression) [EVIDENCE:npx vitest run shared-payload PASS]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Privacy validator rejects `kind: "user-prompt"` source refs [EVIDENCE:shared-payload-advisor.vitest.ts:85]
- [x] CHK-031 [P0] Privacy validator rejects unanchored `sha256:*` paths [EVIDENCE:shared-payload-advisor.vitest.ts:101]
- [x] CHK-032 [P0] Rejected payload content is not logged [EVIDENCE:shared-payload.ts:544]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md + plan.md + tasks.md synchronized [EVIDENCE:tasks.md T001-T014]
- [x] CHK-041 [P1] implementation-summary.md populated with Files Changed + Verification [EVIDENCE:implementation-summary.md §What Was Built; §Verification]
- [x] CHK-042 [P2] Inline JSDoc on new types [EVIDENCE:shared-payload.ts:200]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No orphan files created [EVIDENCE:implementation-summary.md Files Changed]
- [x] CHK-051 [P1] Test file under `mcp_server/tests/` [EVIDENCE:shared-payload-advisor.vitest.ts:1]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Status: Complete

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 19 | 19/19 |
| P1 Items | 5 | 5/5 |
| P2 Items | 1 | 1/1 |
<!-- /ANCHOR:summary -->
