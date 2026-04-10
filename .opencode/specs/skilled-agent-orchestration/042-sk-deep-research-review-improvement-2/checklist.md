---
title: "Verification Checklist: Deep Research and Deep Review Runtime Improvement Bundle [042]"
description: "Verification Date: 2026-04-10"
trigger_phrases:
  - "042"
  - "verification checklist"
  - "deep research"
  - "deep review"
importance_tier: "important"
contextType: "planning"
---
# Verification Checklist: Deep Research and Deep Review Runtime Improvement Bundle

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim runtime-truth completion until verified |
| **[P1]** | Required | Must complete or be explicitly deferred |
| **[P2]** | Optional | Not used in this planning packet |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] REQ-001 stop-reason taxonomy is documented consistently across both loop products [EVIDENCE: exact artifact paths and JSON field names for `stopReason`] [TESTS: `deep-research-contract-parity.vitest.ts`; `deep-review-contract-parity.vitest.ts`]
- [ ] CHK-002 [P0] REQ-002 legal done-gate behavior is defined for blocked-stop cases [EVIDENCE: workflow steps and fixture outputs showing blocked STOP rather than silent termination] [TESTS: `deep-research-behavioral.vitest.ts`; `deep-review-behavioral.vitest.ts`]
- [ ] CHK-003 [P0] REQ-003 resume/start-from-run semantics are defined in command, state, and workflow contracts [EVIDENCE: command/state excerpts naming `continuedFromRun` or equivalent cursor fields] [TESTS: `deep-research-contract-parity.vitest.ts`; `deep-review-contract-parity.vitest.ts`]
- [ ] CHK-004 [P1] Required Level 3 packet files exist and remain synchronized [EVIDENCE: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md`] [TESTS: strict validator]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] REQ-004 audit journals are packet-local and append-only in both loop contracts [EVIDENCE: journal path, append-only rules, and reducer/dashboard references] [TESTS: `deep-research-reducer.vitest.ts`; `deep-review-reducer-schema.vitest.ts`]
- [ ] CHK-011 [P0] REQ-005 claim-verification ledger is defined with `verified`, `contradicted`, and `unresolved` statuses [EVIDENCE: ledger schema/path and synthesis references] [TESTS: `deep-research-behavioral.vitest.ts`; `deep-research-reducer.vitest.ts`]
- [ ] CHK-012 [P1] REQ-013 parity alignment is enforced by contract tests and does not depend on manual memory of the change set [EVIDENCE: parity assertions referencing the new artifact paths and lifecycle fields] [TESTS: `deep-research-contract-parity.vitest.ts`; `deep-review-contract-parity.vitest.ts`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] REQ-006 behavior-first tests exist for deep research and deep review [EVIDENCE: new behavioral test file paths and scenario coverage] [TESTS: `deep-research-behavioral.vitest.ts`; `deep-review-behavioral.vitest.ts`]
- [ ] CHK-021 [P1] REQ-007 richer dashboard metrics are validated in reducer/schema coverage [EVIDENCE: dashboard sections and reducer-metric references] [TESTS: `deep-research-reducer.vitest.ts`; `deep-review-reducer-schema.vitest.ts`]
- [ ] CHK-022 [P1] REQ-010 council-style synthesis remains opt-in and does not alter default flows [EVIDENCE: command/profile docs and optional-mode fixture output] [TESTS: `deep-research-behavioral.vitest.ts`; `deep-research-contract-parity.vitest.ts`]
- [ ] CHK-023 [P1] REQ-011 coordination board remains packet-local and optional [EVIDENCE: board schema/strategy sections and fixture output] [TESTS: `deep-research-behavioral.vitest.ts`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] REQ-002 and REQ-014 keep STOP legality and state truth explicit enough to avoid hidden runtime state or non-auditable termination behavior [EVIDENCE: explicit stop-gate and packet-local artifact rules] [TESTS: behavior and parity suites]
- [ ] CHK-031 [P1] REQ-008 publication critique keeps weaker evidence classes visible instead of silently promoting them [EVIDENCE: evidence-class or critique fields in research contracts] [TESTS: `deep-research-behavioral.vitest.ts`]
- [ ] CHK-032 [P1] REQ-009 promotion checkpoints prevent low-evidence findings from being treated as adoption-ready [EVIDENCE: checkpoint threshold fields and synthesis references] [TESTS: `deep-research-behavioral.vitest.ts`; `deep-research-contract-parity.vitest.ts`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] REQ-012 keeps default command guidance compact while advanced modes remain discoverable [EVIDENCE: quick-reference and command examples] [TESTS: `deep-research-contract-parity.vitest.ts`; `deep-review-contract-parity.vitest.ts`]
- [ ] CHK-041 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` remain synchronized after implementation planning updates [EVIDENCE: manual doc cross-check] [TESTS: strict validator]
- [ ] CHK-042 [P1] `implementation-summary.md` remains a placeholder only until implementation finishes [EVIDENCE: placeholder-only content review] [TESTS: strict validator]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Planned runtime artifacts stay inside existing `research/` or `review/` packet boundaries unless the packet explicitly creates an optional advanced-mode artifact there [EVIDENCE: file-path review in spec/tasks] [TESTS: parity suites]
- [ ] CHK-051 [P1] New behavior-test files remain under `.opencode/skill/system-spec-kit/scripts/tests/` as planned [EVIDENCE: test file paths present in repo and referenced in docs] [TESTS: `rg --files` plus `pnpm vitest`]
- [ ] CHK-052 [P1] Strict packet validation passes after the documentation and implementation work are complete [EVIDENCE: validator PASS output] [TESTS: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2 --strict`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Planned |
|----------|-------|---------|
| P0 Items | 7 | 7 |
| P1 Items | 10 | 10 |

**Verification Date**: 2026-04-10
**Packet Status**: Planning only. Checklist items remain pending until implementation work begins.
<!-- /ANCHOR:summary -->
