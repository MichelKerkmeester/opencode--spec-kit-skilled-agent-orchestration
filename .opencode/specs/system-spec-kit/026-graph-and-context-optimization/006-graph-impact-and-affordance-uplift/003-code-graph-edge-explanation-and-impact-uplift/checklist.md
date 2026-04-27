---
title: "Checklist: 012/003"
description: "Verification items for edge explanation + impact uplift."
importance_tier: "important"
contextType: "implementation"
---
# Checklist: 012/003

<!-- SPECKIT_LEVEL: 2 -->

## P1 — Display & Schema Discipline
- [x] Edge metadata gains `reason` + `step` (JSON only, no SQLite migration) — `structural-indexer.ts` metadata helper updated; `code-graph-indexer.vitest.ts` asserts both fields.
- [x] Existing `confidence`/`detectorProvenance`/`evidenceClass` unchanged — fields remain in the same metadata object and existing test expectations were preserved.
- [x] `code_edges` table schema unchanged (verified by diff vs `code-graph-db.ts:92`) — no edit made to `code-graph-db.ts`; static diff confirms schema file unchanged.

## P1 — Output contracts
- [x] `computeBlastRadius` returns `{ depthGroups, riskLevel, ambiguityCandidates, failureFallback? }` — `query.ts` adds these fields alongside existing `nodes` and `affectedFiles`.
- [x] `minConfidence` parameter filters edges during traversal — `QueryArgs.minConfidence` and targeted query test cover `0.75` filtering.
- [x] Risk classification rules documented + tested — documented in `implementation-summary.md`; query tests cover low, medium and high.
- [x] Ambiguous target returns candidates — no silent default pick (pt-02 §12 RISK-07) — query test asserts candidates and no call to `resolveSubjectFilePath`.
- [x] Failures return structured `failureFallback`, not bare strings — unresolved blast-radius test now expects structured fallback.
- [x] Backward compat: old callers still get prior shape — existing `nodes`, `affectedFiles`, `sourceFiles`, `hotFileBreadcrumbs`, `unionMode` and `maxDepth` remain in payload.

## P2 — Documentation
- [x] feature_catalog entry in `06--analysis/` — `08-code-graph-edge-explanation-blast-radius-uplift.md`.
- [x] manual_testing_playbook entry in `06--analysis/` — `026-code-graph-edge-explanation-blast-radius-uplift.md`.
- [ ] sk-doc DQI ≥85 — OPERATOR-PENDING. The original `[x]` cited feature catalog DQI 87 and playbook DQI 89 via `extract_structure.py`, but those scores were captured outside the canonical Wave-3 channel and are not reproducible from the current rubric without re-running `python3 .opencode/skill/sk-doc/scripts/validate_document.py <doc> --json` for both entries. Marked R-007-20 — premature PASS until script-backed scoring is captured.

## Phase Hand-off
- [ ] `validate.sh --strict` passes — OPERATOR-PENDING-COSMETIC. Wave-3 canonical (010/007/T-B, 2026-04-25): FAILED on template-section conformance only (extra/non-canonical section headers from per-sub-phase scaffold). Cosmetic, NOT a contract violation: required Level-2 files present, anchors balanced, no `[TBD]` placeholders. Tracked as deferred P2 cleanup in 010/007. See `implementation-summary.md` §Verification Evidence for full canonical evidence.
- [x] code-graph vitest suite passes unchanged — Wave-3 canonical (010/007/T-B, 2026-04-25): `npx --no-install vitest run code_graph/tests/code-graph-context-handler.vitest.ts code_graph/tests/code-graph-indexer.vitest.ts code_graph/tests/code-graph-query-handler.vitest.ts ...` → 9 passed | 1 skipped (10) test files, 90 passed | 3 skipped (93) tests, 1.34s. The 003 surfaces (`code-graph-context-handler.vitest.ts`, `code-graph-indexer.vitest.ts`, `code-graph-query-handler.vitest.ts`) are inside the 9 PASSED files with all 003 cases passing. Skips are the documented trust-badges SQL-mock describe block (R-007-13 / T-E remediation), not 003's surface.
- [x] `implementation-summary.md` populated — Status, risk rules, build summary, and Wave-3 canonical verification evidence filled (Status updated to "Complete & verified" 010/007/T-B 2026-04-25).

## References
- spec.md §4 (requirements), §5 (verification)
- pt-02 §11 Packet 2, §12 RISK-07
