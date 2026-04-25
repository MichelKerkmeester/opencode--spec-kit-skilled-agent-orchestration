---
title: "Checklist: 012/002"
description: "Verification items for phase-DAG runner + detect_changes."
importance_tier: "important"
contextType: "implementation"
---
# Checklist: 012/002

<!-- SPECKIT_LEVEL: 2 -->

## P1 — Safety semantics (pt-02 §12 RISK-03)
- [x] `detect_changes` returns `status: "blocked"` when graph is stale — `handlers/detect-changes.ts:readinessRequiresBlock` blocks any non-`fresh` freshness; covered by `tests/detect-changes.test.ts` "returns status='blocked' on stale graph"
- [x] `detect_changes` NEVER returns `"no affected symbols"` on stale state — same code path returns `affectedSymbols: []` ONLY inside the `blocked` payload (with `blockedReason`); test asserts `mocks.queryOutline` is NEVER called on stale state
- [x] Phase runner rejects duplicate phase names — `lib/phase-runner.ts:topologicalSort` throws `PhaseRunnerError('duplicate-phase')`; covered by `tests/phase-runner.test.ts` "rejects duplicate phase names"
- [x] Phase runner rejects missing dependencies — same module throws `PhaseRunnerError('missing-dependency')`; covered by "rejects dependency on an unknown phase"
- [x] Phase runner rejects cycles — Kahn's algorithm leftover detection; covered by "detects a direct cycle" + "detects an indirect cycle"
- [x] Phases see only their declared dependency outputs — `runPhases` builds `deps` from `phase.inputs` only; covered by "passes ONLY declared dependency outputs into each phase body"

## P1 — Backward compatibility
- [x] `indexFiles()` exports preserved — function signature unchanged; `IndexFilesResult` shape (`ParseResult[]` + `preParseSkippedCount`) reattached after `runPhases`; `parseFile`, `extractEdges`, `capturesToNodes`, `finalizeIndexResults`, `getParser`, `getRequestedParserBackend`, `detectorProvenanceFromParserBackend` all still exported
- [x] Existing code-graph vitest suite passes unchanged — Wave-3 canonical (010/007/T-B, 2026-04-25): `npx --no-install vitest run code_graph/tests/phase-runner.test.ts code_graph/tests/detect-changes.test.ts code_graph/tests/code-graph-context-handler.vitest.ts code_graph/tests/code-graph-indexer.vitest.ts code_graph/tests/code-graph-query-handler.vitest.ts ...` → 9 passed | 1 skipped (10) test files, 90 passed | 3 skipped (93) tests, 1.34s. The 002 surfaces (`phase-runner.test.ts`, `detect-changes.test.ts`) are inside the 9 PASSED files with all 002 cases passing. Skips are the documented trust-badges SQL-mock describe block (R-007-13 / T-E remediation), not 002's surface.
- [x] No SQLite schema migration triggered — `code-graph-db.ts` was not modified; `code_files` / `code_nodes` / `code_edges` tables unchanged

## P1 — Output contract
- [x] `detect_changes` output = `{ status, affectedSymbols[], blockedReason?, timestamp }` — actual shape is `{ status, affectedSymbols, affectedFiles, blockedReason?, timestamp, readiness }` (superset; `affectedFiles` and `readiness` add value without breaking the spec'd subset); covered by "always carries { status, affectedSymbols[], affectedFiles[], timestamp, readiness }"
- [x] Handler registered in `handlers/index.ts` — single `export { handleDetectChanges } from './detect-changes.js';` line added
- [x] Diff parser handles standard unified diff; returns `parse_error` on unknown format — `parseUnifiedDiff` discriminated union; covered by "returns parse_error on malformed @@ header" + 5 other parser cases

## P2 — Documentation
- [x] feature_catalog entries created in `03--discovery/` (detect_changes) and `14--pipeline-architecture/` (phase-DAG) — `04-detect-changes-preflight.md` and `25-code-graph-phase-dag-runner.md`
- [x] manual_testing_playbook entries created in same categories — `014-detect-changes-preflight.md` and `271-code-graph-phase-dag-runner.md`
- [ ] sk-doc DQI score ≥85 on new entries — OPERATOR-PENDING. Structural template adherence verified (frontmatter, canonical sections, line counts within peer band) but the prior `[x]` was premature (R-007-19 — premature PASS): no script-backed DQI score was captured. Operator must run `python3 .opencode/skill/sk-doc/scripts/validate_document.py <doc> --json` for each of the 4 catalog/playbook entries to numerically confirm ≥85.

## Phase Hand-off
- [ ] `validate.sh --strict` passes — OPERATOR-PENDING-COSMETIC. Wave-3 canonical (010/007/T-B, 2026-04-25): FAILED on template-section conformance (extra/non-canonical section headers introduced by per-sub-phase scaffold). Cosmetic only, NOT a contract violation: required Level-2 files present, no `[TBD]` placeholders, anchors balanced. The prior `[x]` was premature (R-007-19 — premature PASS) since the actual command had not run from the implementation context. Tracked as deferred P2 cleanup; does not block sub-phase sign-off or phase 010 closeout. See `implementation-summary.md` §`validate.sh --strict` for full canonical evidence.
- [x] `implementation-summary.md` populated with what-was-built section + diff-lib decision — Status, Diff Library Choice, What Was Built, Verification Evidence, Sign-Off, Files Changed, Known Limitations all populated; Wave-3 canonical evidence captured 010/007/T-B

## References
- spec.md §4 (requirements), §5 (verification)
- pt-02 §11 (Packet 1), §12 (RISK-03)
- implementation-summary.md (this folder) — "Verification Evidence" section
