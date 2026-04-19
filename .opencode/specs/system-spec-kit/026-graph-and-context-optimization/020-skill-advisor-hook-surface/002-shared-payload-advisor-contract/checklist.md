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
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/002-shared-payload-advisor-contract"
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

- [ ] CHK-001 [P0] Spec scope + 6 acceptance scenarios reviewed
- [ ] CHK-002 [P0] Predecessor (001-initial-research) converged
- [ ] CHK-003 [P0] Research synthesis §Pattern Parallel Map + §X9 read
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Producer enum extended with `"advisor"`
- [ ] CHK-011 [P0] Source enum extended with advisor sources
- [ ] CHK-012 [P0] `AdvisorEnvelopeMetadata` interface exported
- [ ] CHK-013 [P0] `coerceSharedPayloadEnvelope()` validates advisor metadata whitelist
- [ ] CHK-014 [P0] Privacy validator rejects prompt-derived provenance
- [ ] CHK-015 [P0] `tsc --noEmit` clean
- [ ] CHK-016 [P1] JSDoc references research.md
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Acceptance Scenario 1 passes: valid round-trip
- [ ] CHK-021 [P0] Acceptance Scenario 2 passes: unknown producer rejected
- [ ] CHK-022 [P0] Acceptance Scenario 3 passes: unknown metadata key rejected
- [ ] CHK-023 [P0] Acceptance Scenario 4 passes: prompt-derived provenance rejected
- [ ] CHK-024 [P0] Acceptance Scenario 5 passes: multi-line skillLabel rejected
- [ ] CHK-025 [P0] Acceptance Scenario 6 passes: out-of-range confidence rejected
- [ ] CHK-026 [P0] Existing `shared-payload*.vitest.ts` green (no regression)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Privacy validator rejects `kind: "user-prompt"` source refs
- [ ] CHK-031 [P0] Privacy validator rejects unanchored `sha256:*` paths
- [ ] CHK-032 [P0] Rejected payload content is not logged
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md + plan.md + tasks.md synchronized
- [ ] CHK-041 [P1] implementation-summary.md populated with Files Changed + Verification
- [ ] CHK-042 [P2] Inline JSDoc on new types
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No orphan files created
- [ ] CHK-051 [P1] Test file under `mcp_server/tests/`
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Status: Pending (populated post-implementation)

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 0/17 |
| P1 Items | 5 | 0/5 |
| P2 Items | 1 | 0/1 |
<!-- /ANCHOR:summary -->
