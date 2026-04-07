---
title: "Verification Checklist: Phase 3 — Sanitization & Decision Precedence"
description: "Phase 3 verification checklist for PR-5 and PR-6, including F-AC3, F-AC2, degraded-payload safety, and packet handoff readiness."
trigger_phrases:
  - "phase 3 checklist"
  - "f-ac3 checklist"
  - "f-ac2 checklist"
  - "degraded payload checklist"
importance_tier: important
contextType: "planning"
---

# Verification Checklist: Phase 3 — Sanitization & Decision Precedence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| P0 | Hard blocker | Phase 3 cannot hand off to Phase 4 until complete. |
| P1 | Required regression guard | Must complete or receive explicit deferral approval. |
| P2 | Documentation / evidence quality | Can defer only with written rationale. |

[SOURCE: .opencode/skill/system-spec-kit/templates/level_2/checklist.md:19-27]
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-000 [P0] Phase 3 `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are synchronized on PR-5 / PR-6 scope and the Phase 3 -> 4 handoff rule. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1158-1159] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:199-200]

- [ ] CHK-000A [P0] The empirical D3 contract and the D2 precedence-gate boundary are both frozen before implementation starts. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:31-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-013.md:47-48]
<!-- /ANCHOR:pre-impl -->

---

## P0 - Hard Blockers

- [ ] CHK-001 [P0] F-AC3 is green for both saved `trigger_phrases` and rendered `Key Topics`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1158-1158]

- [ ] CHK-002 [P0] The sanitizer confirms zero observed false positives against the iteration-15 empirical filter contract. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:41-44]

- [ ] CHK-003 [P0] F-AC2 is green and no authored-decision fixture emits `observation decision N` or `user decision N`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1159-1159]

- [ ] CHK-004 [P0] The degraded-payload regression fixture is green and still renders meaningful decisions when authored arrays are absent. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1517-1517]

- [ ] CHK-005 [P0] `validate.sh` exits 0 for `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/003-sanitization-precedence/`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:187-190]

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P1] `ensureMinTriggerPhrases()` is still present and functional after PR-5. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:82-82] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:214-214]

- [ ] CHK-011 [P1] F-AC1 smoke checks remain green so Phase 3 did not regress the earlier truncation fix contract. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1514-1518]

- [ ] CHK-012 [P1] F-AC7 smoke checks remain green so Phase 3 did not regress the earlier anchor-template fix contract. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1514-1518]

- [ ] CHK-013 [P1] The D2 implementation remains precedence-only and did not become a mode-wide lexical shutdown. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1461-1463]

- [ ] CHK-014 [P1] The D3 implementation remains mode-agnostic across shared save paths. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1467-1469]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-014A [P1] The P0 hard blockers above are backed by fixture evidence, not only manual inspection. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:230-237]

- [ ] CHK-014B [P1] F-AC3, F-AC2, and degraded-payload verification are all exercised through `generate-context.js --json` before phase closeout. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:237-237]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-015 [P1] No new Phase 3 rule promotes untrusted junk phrases or placeholder decisions ahead of authored content. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:44-46] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1459-1469]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-020 [P2] `lib/trigger-phrase-sanitizer.ts` includes a header comment documenting the empirical blocklist categories and their corpus basis. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:31-39]

- [ ] CHK-021 [P2] Phase 3 `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` all reference the same PR-5 / PR-6 owner map and handoff contract. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1158-1159] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:199-200]

- [ ] CHK-022 [P2] Final verification evidence includes `generate-context.js --json` runs against the Phase 3 fixtures, not only unit tests. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:237-237]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-023 [P1] Phase 3 edits are confined to PR-5 / PR-6 code and fixture files plus this child spec folder's documentation surfaces. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:179-183]

- [ ] CHK-024 [P1] Parent phase status is only updated after the child folder evidence is complete. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:199-200]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 0 / 5 |
| P1 Items | 8 | 0 / 8 |
| P2 Items | 3 | 0 / 3 |

**Verification Date**: 2026-04-07 [SOURCE: .opencode/skill/system-spec-kit/templates/level_2/checklist.md:93-103]
<!-- /ANCHOR:summary -->

---

## Phase Handoff Readiness

- [ ] Phase 3 satisfies the parent `003-sanitization-precedence -> 004-heuristics-refactor-guardrails` handoff row. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:199-200]

- [ ] Parent phase-map status is ready to move from `Pending` to a completed state once the child folder evidence is attached. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:177-183]

---

## Notes

- This checklist is Phase 3 only. D1, D4, D5, D7, PR-8, and PR-9 belong to other phases and should not be checked here. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:179-183] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/plan.md:39-73]
