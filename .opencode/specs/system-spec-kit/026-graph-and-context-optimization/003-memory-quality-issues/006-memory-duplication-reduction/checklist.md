---
title: "Verification Checklist: Phase 6 — Memory Duplication Reduction"
description: "Re-validation checklist for the shipped Phase 6 memory-duplication-reduction runtime and packet closeout evidence."
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

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] **CHK-601 [P0]** All five Phase 6 iteration outputs exist and `research/findings-registry.json` covers every iteration. [EVIDENCE: `find .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction/research/iterations -maxdepth 1 -type f | sort` listed the five numbered iteration artifacts under the iterations folder; `sed -n '1,220p' research/findings-registry.json` shows iterations `1-5` with the full Phase 6 finding set, including the 10 actionable HIGH/MEDIUM rows.]
- [x] **CHK-602 [P0]** `research/research.md` exists with all 7 required sections and a remediation matrix that matches the synthesized HIGH/MEDIUM findings. [EVIDENCE: `rg -n '^## ' research/research.md` returned 7 top-level sections; `research/research.md` Sections 3-4 enumerate `F001.1`, `F001.2`, `F001.3`, `F002.1`, `F002.2`, `F003.1`, `F004.1`, `F004.2`, `F005.1`, and `F005.2` with the `PR-12` / `PR-13` split.]
- [x] **CHK-603 [P1]** Post-Phase-6 deferrals (`F002.3`, `F002.4`, `F003.2`, `F004.3`, `F005.3`, `F005.4`) are documented before implementation starts. [EVIDENCE: `rg -n "F002\\.3|F002\\.4|F003\\.2|F004\\.3|F005\\.3|F005\\.4" spec.md plan.md tasks.md research/research.md` returned the deferred set in the phase spec, plan, and synthesis docs.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] **CHK-610 [P0]** `PR-12` freezes and lands the approved structural fixes for `F005.1` and `F005.2` without breaking anchor parsing, reviewer expectations, or metadata interpretation. [EVIDENCE: Re-validated on 2026-04-08 under this packet: `cd .opencode/skill/system-spec-kit/scripts && npm run build` -> exit `0`; focused Phase 6 suite (`memory-quality-phase6-template`, `...extractors`, `...trigger`, `...migration`) -> exit `0` / `4` files / `3` tests passed / `9` skipped; `memory-quality-phase6-template.test.ts` still carries the structural-reviewer fixtures for `F005.1` and `F005.2`; phase 1-4 regression smoke -> exit `0` / `7` files / `32` tests passed / `1` skipped.]
- [x] **F005.1 [P1]** Section identity now uses markdown headers plus anchor comments as the structural source of truth, with legacy `<a id="...">` scaffolding removed from the template and parser/test contracts updated accordingly. [EVIDENCE: Re-validated on 2026-04-08 under this packet: focused Phase 6 suite -> exit `0` / `3` passed / `9` skipped with the `F005.1` fixture still parked behind `TODO(003-006)` in `memory-quality-phase6-template.test.ts`; direct source read confirmed `extractAnchorIds()` ignores HTML ids in `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts` and the contract still requires anchor comments in `.opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts`; regression smoke -> exit `0` / `32` passed / `1` skipped.]
- [x] **F005.2 [P0]** Frontmatter remains the canonical source for `contextType` and `trigger_phrases`, the MEMORY METADATA block now mirrors those resolved values, and reviewer drift detection raises `CHECK-DUP5` when either surface diverges. [EVIDENCE: Re-validated on 2026-04-08 under this packet: focused Phase 6 suite -> exit `0` / `3` passed / `9` skipped; `memory-quality-phase6-template.test.ts` still contains the `F005.2` rewrite-and-review fixture; direct source read confirmed the rewrite path in `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts` and reviewer drift checks in `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts`; regression smoke -> exit `0` / `32` passed / `1` skipped.]
- [x] **CHK-611 [P0]** `PR-12` removes the live duplication targeted by `F001.1`, `F001.3`, `F002.1`, and `F002.2` without erasing unique decisions, observations, or discovery anchors. [EVIDENCE: Re-validated on 2026-04-08 under this packet: `npm run build` -> exit `0`; `memory-quality-phase6-trigger.test.ts` -> exit `0` / `2` tests passed for `F001.1` and `F001.3`; `memory-quality-phase6-extractors.test.ts` remains present with the `F002.1` and `F002.2` fixtures behind `TODO(003-006)` for compact-wrapper migration; direct source read confirmed the shipped extractor and decision-dedupe surfaces still live in `.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts`, `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts`, and `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts`; regression smoke -> exit `0` / `32` passed / `1` skipped.]
- [x] **F001.1 [P0]** Guarded cluster-anchor replay keeps `claude optimization settings` and `graphify research` while removing packet scaffold noise such as `graph and context optimization`, `kit/026`, and `optimization/001`. [EVIDENCE: Re-validated on 2026-04-08 under this packet: `npm run build` -> exit `0`; `npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/memory-quality-phase6-trigger.test.ts` -> exit `0` / `1` file / `2` tests passed; regression smoke -> exit `0` / `32` passed / `1` skipped.]
- [x] **F001.3 [P1]** Canonical trigger replay keeps one surviving form for `codex-cli-compact`, `tree-sitter`, and `implementation-summary` while preserving `api`, `cli`, and `mcp`. [EVIDENCE: Re-validated on 2026-04-08 under this packet: `npm run build` -> exit `0`; `memory-quality-phase6-trigger.test.ts` -> exit `0` / `2` tests passed; direct source read confirmed canonicalization and short-anchor preservation in `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`, `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts`, and `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts`; regression smoke -> exit `0` / `32` passed / `1` skipped.]
- [x] **F002.1 [P0]** Blank, whitespace-only, and generic non-decision observation titles no longer render duplicate placeholder headings, while substantive observation titles still render normally. [EVIDENCE: Re-validated on 2026-04-08 under this packet: `npm run build` -> exit `0`; focused Phase 6 suite -> exit `0` / `3` passed / `9` skipped; `memory-quality-phase6-extractors.test.ts` still carries the `F002.1` fixture but keeps it skipped under `TODO(003-006)` while the compact-wrapper assertions are migrated; direct source read confirmed the shipped title filtering path in `.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts`; regression smoke -> exit `0` / `32` passed / `1` skipped.]
- [x] **F002.2 [P1]** Key Outcomes now suppress exact proposition duplicates already carried by decision titles, and fallback rationale no longer restates the same proposition when no authored rationale exists. [EVIDENCE: Re-validated on 2026-04-08 under this packet: `npm run build` -> exit `0`; focused Phase 6 suite -> exit `0` / `3` passed / `9` skipped; `memory-quality-phase6-extractors.test.ts` still carries the authored-rationale fixture for `F002.2` behind `TODO(003-006)`; direct source read confirmed the shipped proposition-normalization path in `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` and `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts`; regression smoke -> exit `0` / `32` passed / `1` skipped.]
- [x] **CHK-612 [P1]** `PR-12` reduces the `F003.1`, `F004.1`, and `F004.2` narrative/FILES duplication classes while preserving completed-session recovery cues and provenance summaries. [EVIDENCE: Re-validated on 2026-04-08 under this packet: `npm run build` -> exit `0`; focused Phase 6 suite -> exit `0` / `3` passed / `9` skipped; `memory-quality-phase6-extractors.test.ts` still carries `F003.1` and `F004.2`, and `memory-quality-phase6-template.test.ts` still carries `F004.1`, with the old packet-body assertions paused for compact-wrapper migration; direct source read confirmed the shipped runtime in `.opencode/skill/system-spec-kit/scripts/core/alignment-validator.ts`, `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts`, and `.opencode/skill/system-spec-kit/templates/context_template.md`; regression smoke -> exit `0` / `32` passed / `1` skipped.]
- [x] **F003.1 [P1]** Tree-thinning carrier rows keep one FILES row per canonical path, move verbose merged provenance into audit metadata, and retain merged source traceability via `merged_sources` / `MERGED_PROVENANCE`. [EVIDENCE: Re-validated on 2026-04-08 under this packet: focused Phase 6 suite -> exit `0` / `3` passed / `9` skipped with the carrier-row fixture still present but skipped in `memory-quality-phase6-extractors.test.ts`; direct source read confirmed carrier-row thinning in `.opencode/skill/system-spec-kit/scripts/core/alignment-validator.ts`; regression smoke -> exit `0` / `32` passed / `1` skipped.]
- [x] **F004.1 [P1]** Completed-session memories now keep the closeout instruction on the canonical `Next Action` surface only, while in-progress memories still render `Pending Work`, `Quick Resume`, and `Next Action`. [EVIDENCE: Re-validated on 2026-04-08 under this packet: focused Phase 6 suite -> exit `0` / `3` passed / `9` skipped with the completed-vs-in-progress fixture still present but skipped in `memory-quality-phase6-template.test.ts`; direct source read confirmed the compact-wrapper continue-session surface in `.opencode/skill/system-spec-kit/templates/context_template.md`; regression smoke -> exit `0` / `32` passed / `1` skipped.]
- [x] **F004.2 [P1]** `Last:` resume context now trims on a word boundary with the shared truncation helper and suppresses low-information fragments instead of clipping mid-word. [EVIDENCE: Re-validated on 2026-04-08 under this packet: focused Phase 6 suite -> exit `0` / `3` tests passed / `9` skipped; `memory-quality-phase6-extractors.test.ts` still exercises `F004.2` directly, and direct source read confirmed the shared word-boundary trimming path in `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts`; regression smoke -> exit `0` / `32` passed / `1` skipped.]
- [x] **CHK-613 [P1]** Optional `PR-13` either runs a bounded `F001.2` cleanup with evidence or is explicitly deferred with rationale. [EVIDENCE: Re-validated on 2026-04-08 under this packet: `npm run build` -> exit `0`; `npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/memory-quality-phase6-migration.test.ts` -> exit `0` / `1` file / `1` test passed; `node .opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js --dry-run --report .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction/scratch/pr13-dry-run-sample.json` -> exit `0` with `scanned=117`, `changed=87`, `removed=425`, `useful_preserved=2`; the bounded report stayed under `scratch/` and preserved `api`, `cli`, and `mcp`.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] **CHK-620 [P0]** Replay or fixture coverage is defined for every remediation-matrix row that ships. [EVIDENCE: `rg -n "F001\\.1|F001\\.3|F002\\.1|F002\\.2|F003\\.1|F004\\.1|F004\\.2|F005\\.1|F005\\.2|CHECK-DUP" .opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-*.test.ts` maps every shipped `PR-12` row plus `PR-13` to the Phase 6 test files; the focused Phase 6 suite exited `0` with the trigger and migration fixtures active and the template/extractor fixtures still present behind `TODO(003-006)`.]
- [x] **CHK-621 [P0]** Existing `CHECK-D1..D8` coverage is supplemented with Phase 6 residual-duplication assertions where `CHECK-D3` / `CHECK-D6` are insufficient. [EVIDENCE: `memory-quality-phase6-template.test.ts` still defines `CHECK-DUP1` through `CHECK-DUP7`; focused Phase 6 suite -> exit `0` / `3` passed / `9` skipped; phase 1-4 regression smoke -> exit `0` / `7` files / `32` tests passed / `1` skipped.]
- [x] **CHECK-DUP1 [P1]** Reviewer coverage now flags repeated blank observation placeholders and stays silent for clean rendered memories. [EVIDENCE: `memory-quality-phase6-template.test.ts` contains the `F-CHECK-DUP1-trigger.json` fixture and the DUP clean baseline; focused Phase 6 suite -> exit `0` / `3` passed / `9` skipped; direct source read confirmed `DUP1` remains implemented in `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts`.]
- [x] **CHECK-DUP2 [P1]** Reviewer coverage now flags propositions repeated across Key Outcomes, decision titles, and rationale fallback text and stays silent for distinct authored decisions. [EVIDENCE: `memory-quality-phase6-template.test.ts` contains the `F-CHECK-DUP2-trigger.json` fixture; focused Phase 6 suite -> exit `0` / `3` passed / `9` skipped; direct source read confirmed `DUP2` remains implemented in `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts`.]
- [x] **CHECK-DUP3 [P1]** Reviewer coverage now flags completed-session closure triplication while allowing in-progress continuation guidance to remain intact. [EVIDENCE: `memory-quality-phase6-template.test.ts` contains the `F-CHECK-DUP3-trigger.json` fixture and the explicit `F004.1` completed/in-progress scenario; focused Phase 6 suite -> exit `0` / `3` passed / `9` skipped; direct source read confirmed `DUP3` remains implemented in `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts`.]
- [x] **CHECK-DUP4 [P1]** Reviewer coverage now flags clipped `Last:` fragments that end mid-clause without punctuation or an ellipsis. [EVIDENCE: `memory-quality-phase6-template.test.ts` contains the `F-CHECK-DUP4-trigger.json` fixture, and `memory-quality-phase6-extractors.test.ts` still checks the `F004.2` word-boundary trim; focused Phase 6 suite -> exit `0` / `3` passed / `9` skipped; direct source read confirmed `DUP4` remains implemented in `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts`.]
- [x] **CHECK-DUP5 [P0]** Reviewer coverage now flags frontmatter-versus-metadata drift for `contextType` and `trigger_phrases`, with HIGH severity reserved for trigger drift. [EVIDENCE: `memory-quality-phase6-template.test.ts` contains both the `F005.2` mirror-drift fixture and `F-CHECK-DUP5-trigger.json`; focused Phase 6 suite -> exit `0` / `3` passed / `9` skipped; direct source read confirmed `DUP5` remains implemented in `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts`.]
- [x] **CHECK-DUP6 [P1]** Reviewer coverage now flags redundant section-identity scaffolding whenever legacy HTML ids survive alongside ANCHOR comments after the template/parser cleanup. [EVIDENCE: `memory-quality-phase6-template.test.ts` contains `F-CHECK-DUP6-trigger.json` plus the `F005.1` anchor-scaffolding fixture; focused Phase 6 suite -> exit `0` / `3` passed / `9` skipped; direct source read confirmed `DUP6` remains implemented in `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts`.]
- [x] **CHECK-DUP7 [P1]** Reviewer coverage now flags FILES descriptions inflated by repeated `Merged from` clauses while leaving concise provenance summaries untouched. [EVIDENCE: `memory-quality-phase6-template.test.ts` contains `F-CHECK-DUP7-trigger.json`, and `memory-quality-phase6-extractors.test.ts` keeps the carrier-row fixture for `F003.1`; focused Phase 6 suite -> exit `0` / `3` passed / `9` skipped; direct source read confirmed `DUP7` remains implemented in `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts`.]
- [x] **CHK-622 [P0]** `validate.sh --strict` exits cleanly for this phase folder. [EVIDENCE: Re-validated on 2026-04-08 under this packet: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction --strict` -> exit `0` with no `SPEC_DOC_INTEGRITY` errors.]
- [x] **CHK-623 [P1]** The final changed-surface summary is clear enough for the Phase 7 downstream audit and contains no scaffold/template filler language. [EVIDENCE: `implementation-summary.md` now records the shipped runtime, fresh verification results, bounded `PR-13` dry-run evidence, and the remaining compact-wrapper test-migration limitation instead of the placeholder scaffold.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] **CHK-630 [P0]** No secrets or private-only data are introduced, and edits stay limited to the approved Phase 6 owner files and packet docs. [EVIDENCE: this pass edited only `006-memory-duplication-reduction/{checklist.md,implementation-summary.md,spec.md}`, the packet-local dry-run report in `scratch/pr13-dry-run-sample.json`, and the single Phase 6 status cell in the parent packet spec; no files under `.opencode/skill/system-spec-kit/scripts/` were modified.]
- [x] **CHK-631 [P1]** Optional migration, if used, remains bounded to the approved stale-trigger cleanup surface. [EVIDENCE: the dry-run invocation exited `0` and wrote only `.opencode/specs/.../006-memory-duplication-reduction/scratch/pr13-dry-run-sample.json`; direct source read confirmed `.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts` still limits scan roots to `.opencode/specs`, the approved global auto-memory root, or temp directories.]
- [x] **CHK-632 [P1]** High-risk or low-value duplication classes stay explicitly deferred when the safe edit boundary is unclear. [EVIDENCE: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `research/research.md` all continue to defer `F002.3`, `F002.4`, `F003.2`, `F004.3`, `F005.3`, and `F005.4`.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] **CHK-640 [P1]** `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `research/research.md` stay synchronized on the 10 actionable HIGH/MEDIUM findings and the `PR-12` / `PR-13` split. [EVIDENCE: `rg -n "F001\\.1|F001\\.2|F001\\.3|F002\\.1|F002\\.2|F003\\.1|F004\\.1|F004\\.2|F005\\.1|F005\\.2|PR-12|PR-13|10 actionable|nine code-side H/M items|bounded stale-trigger" spec.md plan.md tasks.md checklist.md research/research.md` returned aligned references across all five packet docs.]
- [x] **CHK-641 [P1]** `implementation-summary.md` records the final post-dedupe state, shipped findings, deferred findings, and Phase 7 handoff. [EVIDENCE: `implementation-summary.md` now records the shipped compact-wrapper runtime, Phase 6 source/test surfaces, the 2026-04-08 build and test evidence, the bounded `PR-13` dry-run, explicit deferrals, and the remaining compact-wrapper fixture-migration limit for downstream audit context.]
- [x] **CHK-642 [P2]** Phase-local scratch artifacts explain any migration decision or deferral reasoning clearly enough for resume work. [EVIDENCE: `scratch/pr13-dry-run-sample.json` now contains the 2026-04-08 dry-run report with `scanned=117`, `changed=87`, `removed=425`, and `useful_preserved=2`, which is enough to justify keeping `PR-13` bounded and dry-run-only in this re-validation pass.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] **CHK-650 [P1]** Iteration outputs stay under `research/iterations/`, and the canonical synthesis/registry live under `research/`. [EVIDENCE: `find .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction -maxdepth 3 -type f | sort` shows only the five numbered iteration artifacts under `research/iterations/` and keeps `research/research.md` plus `research/findings-registry.json` at the research root.]
- [x] **CHK-651 [P1]** Temporary corpus tallies and comparison notes stay in `scratch/`. [EVIDENCE: the same `find ... -maxdepth 3 -type f | sort` output shows the only non-doc artifact created by this pass at `scratch/pr13-dry-run-sample.json`.]
- [x] **CHK-652 [P2]** Saved findings or handoff context are written only to `memory/`. [EVIDENCE: packet-local filesystem review shows `memory/` contains only `.gitkeep`, and this pass did not write any saved context outside the `memory/` folder.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 22 | 22/22 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-04-08
<!-- /ANCHOR:summary -->
