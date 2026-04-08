---
title: "Verification Checklist: Phase 6 — Memory Duplication Reduction"
description: "Verification checklist scaffold for the Phase 6 research wave, future dedupe implementation, and downstream handoff."
trigger_phrases:
  - "phase 6 checklist"
  - "memory duplication checklist"
importance_tier: important
contextType: "planning"
---
# Verification Checklist: Phase 6 — Memory Duplication Reduction

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + phase-child + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Phase cannot close until complete |
| **P1** | Required | Must complete or be explicitly deferred |
| **P2** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

> **Placeholder state:** Phase 6 implementation has not started yet. Any preview evidence preserved below is draft carry-forward context only and must not be read as Phase 6 execution evidence.

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] **CHK-601 [P0]** All five Phase 6 iteration outputs exist and `research/findings-registry.json` covers every iteration.
- [ ] **CHK-602 [P0]** `research/research.md` exists with all 7 required sections and a remediation matrix that matches the synthesized HIGH/MEDIUM findings.
- [ ] **CHK-603 [P1]** Post-Phase-6 deferrals (`F002.3`, `F002.4`, `F003.2`, `F004.3`, `F005.3`, `F005.4`) are documented before implementation starts.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] **CHK-610 [P0]** `PR-12` freezes and lands the approved structural fixes for `F005.1` and `F005.2` without breaking anchor parsing, reviewer expectations, or metadata interpretation. Evidence: `cd .opencode/skill/system-spec-kit/scripts && npm run build` exited 0; `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase6-template.test.ts` passed (5 tests); `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/memory-quality-phase1.vitest.ts tests/memory-quality-phase2-pr3.test.ts tests/memory-quality-phase2-pr4.test.ts tests/memory-quality-phase3-pr5.vitest.ts tests/memory-quality-phase3-pr6.vitest.ts tests/memory-quality-phase4-pr7.test.ts tests/memory-quality-phase4-pr9.test.ts` passed (33 tests). (PREVIEW — execution not yet run under this packet)
- [ ] **F005.1 [P1]** Section identity now uses markdown headers plus `&lt;!-- ANCHOR:... --&gt;` comments as the structural source of truth, with legacy `<a id="...">` scaffolding removed from the template and parser/test contracts updated accordingly. Evidence: `cd .opencode/skill/system-spec-kit/scripts && npm run build` exited 0; `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase6-template.test.ts` passed (5 tests), including anchor extraction and template-contract assertions; `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/memory-quality-phase1.vitest.ts tests/memory-quality-phase2-pr3.test.ts tests/memory-quality-phase2-pr4.test.ts tests/memory-quality-phase3-pr5.vitest.ts tests/memory-quality-phase3-pr6.vitest.ts tests/memory-quality-phase4-pr7.test.ts tests/memory-quality-phase4-pr9.test.ts` passed (33 tests). (PREVIEW — execution not yet run under this packet)
- [ ] **F005.2 [P0]** Frontmatter remains the canonical source for `contextType` and `trigger_phrases`, the MEMORY METADATA block now mirrors those resolved values, and reviewer drift detection raises `CHECK-DUP5` when either surface diverges. Evidence: `cd .opencode/skill/system-spec-kit/scripts && npm run build` exited 0; `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase6-template.test.ts` passed (5 tests), including managed-frontmatter sync and synthetic drift coverage for `CHECK-DUP5`; `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/memory-quality-phase1.vitest.ts tests/memory-quality-phase2-pr3.test.ts tests/memory-quality-phase2-pr4.test.ts tests/memory-quality-phase3-pr5.vitest.ts tests/memory-quality-phase3-pr6.vitest.ts tests/memory-quality-phase4-pr7.test.ts tests/memory-quality-phase4-pr9.test.ts` passed (33 tests). (PREVIEW — execution not yet run under this packet)
- [ ] **CHK-611 [P0]** `PR-12` removes the live duplication targeted by `F001.1`, `F001.3`, `F002.1`, and `F002.2` without erasing unique decisions, observations, or discovery anchors.
- [ ] **F001.1 [P0]** Guarded cluster-anchor replay keeps `claude optimization settings` and `graphify research` while removing packet scaffold noise such as `graph and context optimization`, `kit/026`, and `optimization/001`. Evidence: `cd .opencode/skill/system-spec-kit/scripts && npm run build`; `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase6-trigger.test.ts`. (PREVIEW — execution not yet run under this packet)
- [ ] **F001.3 [P1]** Canonical trigger replay keeps one surviving form for `codex-cli-compact`, `tree-sitter`, and `implementation-summary` while preserving `api`, `cli`, and `mcp`. Evidence: `cd .opencode/skill/system-spec-kit/scripts && npm run build`; `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase6-trigger.test.ts`; `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/memory-quality-phase1.vitest.ts tests/memory-quality-phase2-pr3.test.ts tests/memory-quality-phase2-pr4.test.ts tests/memory-quality-phase3-pr5.vitest.ts tests/memory-quality-phase3-pr6.vitest.ts tests/memory-quality-phase4-pr7.test.ts tests/memory-quality-phase4-pr9.test.ts`. (PREVIEW — execution not yet run under this packet)
- [ ] **F002.1 [P0]** Blank, whitespace-only, and generic non-decision observation titles no longer render duplicate placeholder headings, while substantive observation titles still render normally. Evidence: `cd .opencode/skill/system-spec-kit/scripts && npm run build` exited 0; `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase6-extractors.test.ts` passed (4 tests); `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/memory-quality-phase1.vitest.ts tests/memory-quality-phase2-pr3.test.ts tests/memory-quality-phase2-pr4.test.ts tests/memory-quality-phase3-pr5.vitest.ts tests/memory-quality-phase3-pr6.vitest.ts tests/memory-quality-phase4-pr7.test.ts tests/memory-quality-phase4-pr9.test.ts` passed (33 tests). (PREVIEW — execution not yet run under this packet)
- [ ] **F002.2 [P1]** Key Outcomes now suppress exact proposition duplicates already carried by decision titles, and fallback rationale no longer restates the same proposition when no authored rationale exists. Evidence: `cd .opencode/skill/system-spec-kit/scripts && npm run build` exited 0; `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase6-extractors.test.ts` passed (4 tests), including authored-rationale preservation; `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/memory-quality-phase1.vitest.ts tests/memory-quality-phase2-pr3.test.ts tests/memory-quality-phase2-pr4.test.ts tests/memory-quality-phase3-pr5.vitest.ts tests/memory-quality-phase3-pr6.vitest.ts tests/memory-quality-phase4-pr7.test.ts tests/memory-quality-phase4-pr9.test.ts` passed (33 tests). (PREVIEW — execution not yet run under this packet)
- [ ] **CHK-612 [P1]** `PR-12` reduces the `F003.1`, `F004.1`, and `F004.2` narrative/FILES duplication classes while preserving completed-session recovery cues and provenance summaries. Evidence: `cd .opencode/skill/system-spec-kit/scripts && npm run build` exited 0; `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase6-template.test.ts` passed (5 tests) for completed-session closure collapse and residual-duplication review checks; `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/memory-quality-phase1.vitest.ts tests/memory-quality-phase2-pr3.test.ts tests/memory-quality-phase2-pr4.test.ts tests/memory-quality-phase3-pr5.vitest.ts tests/memory-quality-phase3-pr6.vitest.ts tests/memory-quality-phase4-pr7.test.ts tests/memory-quality-phase4-pr9.test.ts` passed (33 tests). (PREVIEW — execution not yet run under this packet)
- [ ] **F003.1 [P1]** Tree-thinning carrier rows keep one FILES row per canonical path, move verbose merged provenance into audit metadata, and retain merged source traceability via `merged_sources` / `MERGED_PROVENANCE`. Evidence: `cd .opencode/skill/system-spec-kit/scripts && npm run build` exited 0; `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase6-extractors.test.ts` passed (4 tests); `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/memory-quality-phase1.vitest.ts tests/memory-quality-phase2-pr3.test.ts tests/memory-quality-phase2-pr4.test.ts tests/memory-quality-phase3-pr5.vitest.ts tests/memory-quality-phase3-pr6.vitest.ts tests/memory-quality-phase4-pr7.test.ts tests/memory-quality-phase4-pr9.test.ts` passed (33 tests). (PREVIEW — execution not yet run under this packet)
- [ ] **F004.1 [P1]** Completed-session memories now keep the closeout instruction on the canonical `Next Action` surface only, while in-progress memories still render `Pending Work`, `Quick Resume`, and `Next Action`. Evidence: `cd .opencode/skill/system-spec-kit/scripts && npm run build` exited 0; `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase6-template.test.ts` passed (5 tests), including completed vs in-progress rendering assertions; `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/memory-quality-phase1.vitest.ts tests/memory-quality-phase2-pr3.test.ts tests/memory-quality-phase2-pr4.test.ts tests/memory-quality-phase3-pr5.vitest.ts tests/memory-quality-phase3-pr6.vitest.ts tests/memory-quality-phase4-pr7.test.ts tests/memory-quality-phase4-pr9.test.ts` passed (33 tests). (PREVIEW — execution not yet run under this packet)
- [ ] **F004.2 [P1]** `Last:` resume context now trims on a word boundary with the shared truncation helper and suppresses low-information fragments instead of clipping mid-word. Evidence: `cd .opencode/skill/system-spec-kit/scripts && npm run build` exited 0; `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase6-extractors.test.ts` passed (4 tests); `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/memory-quality-phase1.vitest.ts tests/memory-quality-phase2-pr3.test.ts tests/memory-quality-phase2-pr4.test.ts tests/memory-quality-phase3-pr5.vitest.ts tests/memory-quality-phase3-pr6.vitest.ts tests/memory-quality-phase4-pr7.test.ts tests/memory-quality-phase4-pr9.test.ts` passed (33 tests). (PREVIEW — execution not yet run under this packet)
- [ ] **CHK-613 [P1]** Optional `PR-13` either runs a bounded `F001.2` cleanup with evidence or is explicitly deferred with rationale. [EVIDENCE: `npm run build` exited 0 in `.opencode/skill/system-spec-kit/scripts`; `npx vitest run tests/memory-quality-phase6-migration.test.ts --config ../mcp_server/vitest.config.ts --root .` passed (1 test); `node .opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js --dry-run --report .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction/scratch/pr13-dry-run-sample.json` exited 0 and produced a bounded report (`scanned=116`, `changed=87`, `removed=425`, `useful_preserved=2`) with stale junk removals for `and`, `graph`, `kit/026`, and `optimization/001`, while the focused migration fixture preserved `api`, `cli`, and `mcp`.] (PREVIEW — execution not yet run under this packet)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] **CHK-620 [P0]** Replay or fixture coverage is defined for every remediation-matrix row that ships.
- [ ] **CHK-621 [P0]** Existing `CHECK-D1..D8` coverage is supplemented with Phase 6 residual-duplication assertions where `CHECK-D3` / `CHECK-D6` are insufficient. Evidence: `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase6-template.test.ts` passed (5 tests), covering `CHECK-DUP1` through `CHECK-DUP7` plus a clean baseline with zero false positives; `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/memory-quality-phase1.vitest.ts tests/memory-quality-phase2-pr3.test.ts tests/memory-quality-phase2-pr4.test.ts tests/memory-quality-phase3-pr5.vitest.ts tests/memory-quality-phase3-pr6.vitest.ts tests/memory-quality-phase4-pr7.test.ts tests/memory-quality-phase4-pr9.test.ts` passed (33 tests). (PREVIEW — execution not yet run under this packet)
- [ ] **CHECK-DUP1 [P1]** Reviewer coverage now flags repeated blank observation placeholders and stays silent for clean rendered memories. Evidence: `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase6-template.test.ts` passed (5 tests), including DUP trigger and clean-baseline assertions. (PREVIEW — execution not yet run under this packet)
- [ ] **CHECK-DUP2 [P1]** Reviewer coverage now flags propositions repeated across Key Outcomes, decision titles, and rationale fallback text and stays silent for distinct authored decisions. Evidence: `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase6-template.test.ts` passed (5 tests), including DUP trigger and clean-baseline assertions. (PREVIEW — execution not yet run under this packet)
- [ ] **CHECK-DUP3 [P1]** Reviewer coverage now flags completed-session closure triplication while allowing in-progress continuation guidance to remain intact. Evidence: `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase6-template.test.ts` passed (5 tests), including DUP trigger and clean-baseline assertions. (PREVIEW — execution not yet run under this packet)
- [ ] **CHECK-DUP4 [P1]** Reviewer coverage now flags clipped `Last:` fragments that end mid-clause without punctuation or an ellipsis. Evidence: `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase6-template.test.ts` passed (5 tests), including DUP trigger and clean-baseline assertions. (PREVIEW — execution not yet run under this packet)
- [ ] **CHECK-DUP5 [P0]** Reviewer coverage now flags frontmatter-versus-metadata drift for `contextType` and `trigger_phrases`, with HIGH severity reserved for trigger drift. Evidence: `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase6-template.test.ts` passed (5 tests), including synthetic mirror-drift assertions and a clean baseline. (PREVIEW — execution not yet run under this packet)
- [ ] **CHECK-DUP6 [P1]** Reviewer coverage now flags redundant section-identity scaffolding whenever legacy HTML ids survive alongside ANCHOR comments after the template/parser cleanup. Evidence: `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase6-template.test.ts` passed (5 tests), including DUP trigger and clean-baseline assertions. (PREVIEW — execution not yet run under this packet)
- [ ] **CHECK-DUP7 [P1]** Reviewer coverage now flags FILES descriptions inflated by repeated `Merged from` clauses while leaving concise provenance summaries untouched. Evidence: `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase6-template.test.ts` passed (5 tests), including DUP trigger and clean-baseline assertions. (PREVIEW — execution not yet run under this packet)
- [ ] **CHK-622 [P0]** `validate.sh --strict` exits cleanly for this phase folder.
- [ ] **CHK-623 [P1]** The final changed-surface summary is clear enough for the Phase 7 downstream audit and contains no scaffold/template filler language.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] **CHK-630 [P0]** No secrets or private-only data are introduced, and edits stay limited to the approved Phase 6 owner files and packet docs.
- [ ] **CHK-631 [P1]** Optional migration, if used, remains bounded to the approved stale-trigger cleanup surface.
- [ ] **CHK-632 [P1]** High-risk or low-value duplication classes stay explicitly deferred when the safe edit boundary is unclear.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] **CHK-640 [P1]** `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `research/research.md` stay synchronized on the 10 actionable HIGH/MEDIUM findings and the `PR-12` / `PR-13` split.
- [ ] **CHK-641 [P1]** `implementation-summary.md` records the final post-dedupe state, shipped findings, deferred findings, and Phase 7 handoff.
- [ ] **CHK-642 [P2]** Phase-local scratch artifacts explain any migration decision or deferral reasoning clearly enough for resume work.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] **CHK-650 [P1]** Iteration outputs stay under `research/iterations/`, and the canonical synthesis/registry live under `research/`.
- [ ] **CHK-651 [P1]** Temporary corpus tallies and comparison notes stay in `scratch/`.
- [ ] **CHK-652 [P2]** Saved findings or handoff context are written only to `memory/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 10 | 0/10 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-04-08
<!-- /ANCHOR:summary -->
