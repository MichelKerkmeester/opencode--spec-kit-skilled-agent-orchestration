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

- [x] CHK-000 [P0] Phase 3 `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are synchronized on PR-5 / PR-6 scope and the Phase 3 -> 4 handoff rule. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1158-1159] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:199-200] [EVIDENCE: Cross-reference verified across the phase spec, plan, tasks, and checklist: all four surfaces still anchor Phase 3 to PR-5 / PR-6, F-AC3 / F-AC2, degraded-payload coverage, and the parent `003-sanitization-precedence -> 004-heuristics-refactor-guardrails` handoff row.]

- [x] CHK-000A [P0] The empirical D3 contract and the D2 precedence-gate boundary are both frozen before implementation starts. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:31-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-013.md:47-48] [EVIDENCE: Phase 3 `spec.md` and `plan.md` both freeze the pre-implementation contract: D3 cites iteration-015's empirical sanitizer classes and zero-false-positive guardrail, while D2 cites iteration-013's precedence-only lexical gate boundary rather than a mode-wide shutdown.]
<!-- /ANCHOR:pre-impl -->

---

### P0 - Hard Blockers

- [x] CHK-001 [P0] F-AC3 is green for both saved `trigger_phrases` and rendered `Key Topics`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1158-1158] [EVIDENCE: `npx vitest run --config ../mcp_server/vitest.config.ts tests/trigger-phrase-sanitizer.vitest.ts tests/memory-quality-phase3-pr5.vitest.ts` exit `0`; `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json "<F-AC3-synthetic-bigrams payload>" .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/003-sanitization-precedence` saved frontmatter without `with phases`, `session for`, or `level spec` and rendered `Key Topics` without `tiers full` / `level spec`]

- [x] CHK-002 [P0] The sanitizer confirms zero observed false positives against the iteration-15 empirical filter contract. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:41-44] [EVIDENCE: `npx vitest run --config ../mcp_server/vitest.config.ts tests/trigger-phrase-sanitizer.vitest.ts tests/memory-quality-phase3-pr5.vitest.ts` exit `0`; `tests/trigger-phrase-sanitizer.vitest.ts` asserts zero false positives across the tuned category corpus and preserves allowlisted short names]

- [x] CHK-003 [P0] F-AC2 is green and no authored-decision fixture emits `observation decision N` or `user decision N`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1159-1159] [EVIDENCE: `npx vitest run tests/memory-quality-phase3-pr6.vitest.ts --config ../mcp_server/vitest.config.ts --root .` PASS; authored `generate-context.js` replay rendered `### Decision 1: Adopt strict TypeScript config` and `### Decision 2: Use Voyage-4 embeddings` with no placeholder titles]

- [x] CHK-004 [P0] The degraded-payload regression fixture is green and still renders meaningful decisions when authored arrays are absent. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1517-1517] [EVIDENCE: `npx vitest run tests/memory-quality-phase3-pr6.vitest.ts --config ../mcp_server/vitest.config.ts --root .` PASS; degraded `generate-context.js` replay rendered `### Decision 1: observation decision 1` and `### Decision 2: user decision 1`]

- [x] CHK-005 [P0] `validate.sh` exits 0 for `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/003-sanitization-precedence/`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:187-190] [EVIDENCE: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/003-sanitization-precedence --strict` -> exit `0`]
  Evidence: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/003-sanitization-precedence --strict` now exits `0`.

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P1] `ensureMinTriggerPhrases()` is still present and functional after PR-5. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:82-82] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:214-214] [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1320` still routes the sanitized trigger set through `ensureMinTriggerPhrases(...)`; `tests/memory-quality-phase3-pr5.vitest.ts` exercised the shared save path with sparse manual-trigger fixtures and passed]

- [x] CHK-011 [P1] F-AC1 smoke checks remain green so Phase 3 did not regress the earlier truncation fix contract. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1514-1518] [EVIDENCE: `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/memory-quality-phase1.vitest.ts` -> exit `0`, `1` file passed, `2` tests passed; the `F-AC1 — OVERVIEW truncation` describe block remains green, so Phase 3 did not regress the Phase 1 truncation contract.]

- [x] CHK-012 [P1] F-AC7 smoke checks remain green so Phase 3 did not regress the earlier anchor-template fix contract. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1514-1518] [EVIDENCE: `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/memory-quality-phase1.vitest.ts` -> exit `0`, `1` file passed, `2` tests passed; the `F-AC7 — OVERVIEW anchor consistency` describe block remains green, so Phase 3 did not regress the Phase 1 anchor-template contract.]

- [x] CHK-013 [P1] The D2 implementation remains precedence-only and did not become a mode-wide lexical shutdown. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1461-1463] [EVIDENCE: `decision-extractor.ts` now falls back lexically only when `decisionObservations.length === 0`, `processedManualDecisions.length === 0`, and `rawKeyDecisions.length === 0`; degraded fixture still passes]

- [x] CHK-014 [P1] The D3 implementation remains mode-agnostic across shared save paths. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1467-1469] [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1283-1320` and `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:289-320` add no JSON-only gating; the focused F-AC3 workflow replay passed through the shared save path]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-014A [P1] The P0 hard blockers above are backed by fixture evidence, not only manual inspection. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:230-237] [EVIDENCE: `tests/memory-quality-phase3-pr5.vitest.ts` replays five F-AC3 fixtures and `tests/trigger-phrase-sanitizer.vitest.ts` covers each empirical sanitizer category; both passed under the focused Vitest run]

- [x] CHK-014B [P1] F-AC3, F-AC2, and degraded-payload verification are all exercised through `generate-context.js --json` before phase closeout. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:237-237] [EVIDENCE: `ls -la .opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC3*.json .opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC2*.json` -> exit `0` with `F-AC3-*.json`, `F-AC2-authored-decisions.json`, and `F-AC2-degraded-fallback.json` present; the phase replay suites `tests/memory-quality-phase3-pr5.vitest.ts` and `tests/memory-quality-phase3-pr6.vitest.ts` exercise those fixture families through the workflow helper's `generate-context.js --json` semantics. Degraded-payload replay remains separately evidenced under CHK-004.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-015 [P1] No new Phase 3 rule promotes untrusted junk phrases or placeholder decisions ahead of authored content. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:44-46] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1459-1469] [EVIDENCE: authored raw `keyDecisions` fixture with lexical cue prompts renders authored decision titles first and suppresses `observation decision N` / `user decision N` placeholders]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-020 [P2] `lib/trigger-phrase-sanitizer.ts` includes a header comment documenting the empirical blocklist categories and their corpus basis. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:31-39] [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:1-8` points directly to iteration-015 as the empirical authority for the frozen D3 blocklist / allowlist contract]

- [x] CHK-021 [P2] Phase 3 `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` all reference the same PR-5 / PR-6 owner map and handoff contract. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1158-1159] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:199-200] [EVIDENCE: `rg -n "PR-5|PR-6|F-AC2|F-AC3|003→004|003 -> 004" .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/003-sanitization-precedence/spec.md .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/003-sanitization-precedence/plan.md .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/003-sanitization-precedence/tasks.md .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/003-sanitization-precedence/checklist.md` -> exit `0`; the four Phase 3 docs all carry the same PR-5 / PR-6 owner map, F-AC2 / F-AC3 references, and the Phase 3 -> 4 handoff contract.]

- [x] CHK-022 [P2] Final verification evidence includes `generate-context.js --json` runs against the Phase 3 fixtures, not only unit tests. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:237-237] [EVIDENCE: replayed `F-AC3-synthetic-bigrams.json` through `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json "<payload>" .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/003-sanitization-precedence` and removed the generated memory file immediately afterward]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-023 [P1] Phase 3 edits are confined to PR-5 / PR-6 code and fixture files plus this child spec folder's documentation surfaces. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:179-183] [EVIDENCE: PR-5 execution touched only `scripts/lib/trigger-phrase-sanitizer.ts`, `scripts/core/workflow.ts`, `scripts/lib/semantic-signal-extractor.ts`, `tests/trigger-phrase-sanitizer.vitest.ts`, `tests/memory-quality-phase3-pr5.vitest.ts`, `tests/fixtures/memory-quality/F-AC3-*.json`, and this checklist]

- [x] CHK-024 [P1] Parent phase status is only updated after the child folder evidence is complete. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:199-200] [EVIDENCE: parent `spec.md:86` now reads `Phase-local complete, parent gates pending`; the qualified rollup text landed in RW-B parent rollup normalization commit `bc7754ef0`.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7 / 7 |
| P1 Items | 8 | 8 / 8 |
| P2 Items | 3 | 3 / 3 |

**Verification Date**: 2026-04-07 [SOURCE: .opencode/skill/system-spec-kit/templates/level_2/checklist.md:93-103]
<!-- /ANCHOR:summary -->

---

### Phase Handoff Readiness

- [x] Phase 3 satisfies the parent `003-sanitization-precedence -> 004-heuristics-refactor-guardrails` handoff row. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:199-200] [EVIDENCE: parent `spec.md:107` still defines the 003 -> 004 handoff as `F-AC2` + `F-AC3` green plus degraded-payload regression coverage, and parent `spec.md:92` records the qualified phase-local-complete rollup rule used until child evidence is attached.]

- [x] Parent phase-map status is ready to move from `Pending` to a completed state once the child folder evidence is attached. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:177-183] [EVIDENCE: parent `spec.md:86` already carries the qualified `Phase-local complete, parent gates pending` state for Phase 3, and parent `spec.md:98` preserves the rule that aggregate status updates happen only after child-folder evidence is attached.]

---

### Notes

- This checklist is Phase 3 only. D1, D4, D5, D7, PR-8, and PR-9 belong to other phases and should not be checked here. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:179-183] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/plan.md:39-73]
