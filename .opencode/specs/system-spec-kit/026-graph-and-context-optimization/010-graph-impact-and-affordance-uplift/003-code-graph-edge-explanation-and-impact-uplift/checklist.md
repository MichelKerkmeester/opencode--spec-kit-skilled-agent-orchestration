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
- [x] sk-doc DQI ≥85 — feature catalog DQI 87; playbook DQI 89 via `extract_structure.py`.

## Phase Hand-off
- [ ] `validate.sh --strict` passes — blocked: validator reports scaffold/template deviations in existing spec docs and missing local `tsx` runtime.
- [ ] code-graph vitest suite passes unchanged — blocked: local Vitest binary absent and `npx` cannot fetch from npm under restricted network.
- [x] `implementation-summary.md` populated — Status, risk rules, build summary and verification evidence filled.

## References
- spec.md §4 (requirements), §5 (verification)
- pt-02 §11 Packet 2, §12 RISK-07
