# Agent Brief — 012/003 Code Graph Edge Explanation + Impact Uplift

You are an autonomous implementation agent. **No conversation context.** This brief is everything you need.

## Your role

You add `reason`/`step` explanation fields to code-graph edge metadata and enrich `computeBlastRadius` output with risk levels, min-confidence filtering, ambiguity candidates, and structured failure-fallback. **No SQLite schema migration** — JSON metadata only.

## Read first (in this exact order)

1. **Sub-phase spec (your scope, READ FULLY):**
   `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/003-code-graph-edge-explanation-and-impact-uplift/spec.md`
2. **Sub-phase plan + tasks + checklist:**
   `.../003-code-graph-edge-explanation-and-impact-uplift/{plan.md,tasks.md,checklist.md}`
3. **Phase-root (read-only):**
   `.../010-graph-impact-and-affordance-uplift/{spec.md,decision-record.md}` (note ADR-012-002, ADR-012-003 route/tool deferred, ADR-012-004 mutating rename rejected)
4. **License clearance:**
   `.../012/001-clean-room-license-audit/implementation-summary.md` — must show APPROVED. If HALT, **STOP**.
5. **Sub-phase 002 status (you depend on it for structural-indexer.ts):**
   `.../012/002-code-graph-phase-runner-and-detect-changes/implementation-summary.md` — should be populated; you may need to **rebase your branch onto 002 before merge**
6. **Research basis:**
   `.../research/007-external-project-pt-02/research.md` §4 (Code Graph findings — Confidence edges, Explanation gap, Public blast radius rows), §11 Packet 2, §12 RISK-07
7. **Existing Public code (READ before EDIT):**
   - `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:80-100` (metadata writer at lines 85-94 per pt-02 verification)
   - `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts` (lines 862-909 for `computeBlastRadius`; 978-981 for relationship-query output)
   - `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-context.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:53-95` (schema reference — DO NOT modify)

## Worktree + branch

- Worktree: `../012-003` (`git worktree add ../012-003 -b feat/012/003-edge-uplift`)
- Branch: `feat/012/003-edge-uplift`
- ⚠️ **Rebase target:** before final merge, rebase onto `feat/012/002-phase-runner`. Sub-phase 002 modifies `structural-indexer.ts:~1369`; you modify lines 80-100. Different ranges → trivial conflict resolution if any.

## Files you may touch

| File | Action |
|------|--------|
| `mcp_server/code_graph/lib/structural-indexer.ts` | **MODIFY lines 80-100 only** — extend metadata writer with `reason`+`step` JSON fields. Do NOT touch line ~1369 (sub-phase 002 owns) |
| `mcp_server/code_graph/handlers/query.ts` | **MODIFY** lines 862-909 (extend `computeBlastRadius` output shape) and 978-981 (surface `reason`+`step` in relationship-query output) |
| `mcp_server/code_graph/lib/code-graph-context.ts` | **MODIFY** — propagate enriched fields through context payloads |
| `mcp_server/code_graph/tests/blast-radius.test.ts` (or extend existing) | **MODIFY** — add tests for risk levels, min-confidence filter, ambiguity candidates, failure fallback |
| `mcp_server/code_graph/tests/edge-metadata.test.ts` (or extend existing) | **MODIFY** — add tests for reason/step round-trip |
| `.opencode/skill/system-spec-kit/feature_catalog/06--analysis/<new-entry>.md` | **CREATE** via `/create:feature-catalog` |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/06--analysis/<new-entry>.md` | **CREATE** via `/create:testing-playbook` |
| `012/003/implementation-summary.md` | **MODIFY** — populate Status, Risk Classification Rules Decided, What Was Built, Verification Evidence |

## Files you may NOT touch

- 012 phase-root files
- Other sub-phase folders (001, 002, 004, 005, 006)
- `code_graph/lib/structural-indexer.ts` line ~1369 area (sub-phase 002 owns the `indexFiles()` wrap)
- `code_graph/handlers/index.ts` (sub-phase 002 owns)
- `code_graph/handlers/detect-changes.ts` (sub-phase 002 owns; if 002 hasn't merged yet, file may not exist on your branch)
- `code_graph/lib/phase-runner.ts` or `diff-parser.ts` (sub-phase 002 owns)
- `code_graph/lib/code-graph-db.ts` schema (NO migrations)
- `skill_advisor/`, `lib/storage/`, `lib/search/`, `formatters/` (other sub-phases)
- `external/` (read-only)

## Hard rules

1. **Clean-room only** (ADR-012-001).
2. **NO SQLite schema migration** — extend the existing `metadata` JSON column on `code_edges`. Just write more keys (`reason`, `step`) into the JSON blob.
3. **Existing `confidence`/`detectorProvenance`/`evidenceClass` fields unchanged** — additive only.
4. **Backward compat:** old callers that don't request new fields must still get the prior shape. Check via existing test suite.
5. **Risk classification rules** for `riskLevel`: HIGH if depth-1 count > 10 OR ambiguity present; MEDIUM if depth-1 ∈ [4,9]; LOW if ≤3. (You may refine these, but record final rules in `implementation-summary.md`.)
6. **Ambiguity surfacing** (pt-02 §12 RISK-07): when target symbol fq_name resolves to multiple `code_nodes`, return `ambiguityCandidates` array — NEVER silently pick one.
7. **Structured failure fallback** — return `{ failureFallback: { reason, partialResult? } }`, never bare error strings.
8. **Read whole file before edit.** Especially `structural-indexer.ts` — confirm your line ranges don't drift into 002's territory.

## Success criteria

- [ ] All 16 tasks in `012/003/tasks.md` complete (T-003-A1 through T-003-D4)
- [ ] All checklist items in `012/003/checklist.md` ticked with evidence
- [ ] `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .../012/003 --strict` passes
- [ ] `vitest run code_graph/tests/` for blast_radius + edge metadata green
- [ ] Existing `code_graph` test suite still green (no regression)
- [ ] `tsc --noEmit` clean
- [ ] Static check: `code_edges` table schema unchanged in `code-graph-db.ts:53-95`
- [ ] Risk classification rules documented in `implementation-summary.md`
- [ ] sk-doc DQI ≥85 on the 2 new feature_catalog/playbook entries
- [ ] On rebase onto 002, no merge conflicts in `structural-indexer.ts` (or trivially resolvable)

## Output contract

- Commit to `feat/012/003-edge-uplift` with conventional-commit messages
- Final commit suffix: `(012/003)`
- Do NOT merge — orchestrator handles merges
- On completion, print: `EXIT_STATUS=DONE` + risk-classification-rules + test summary + LOC delta + rebase status (if 002 already merged)

## References

- pt-02 §11 Packet 2 (edge metadata + impact uplift)
- pt-02 §12 RISK-07 (hidden default selection — ambiguity surfacing)
- ADR-012-002 (sub-phase decomposition), ADR-012-003 (route/tool/shape DEFERRED — do not add route/tool fields), ADR-012-004 (read-only impact only)
- Verified anchors: `structural-indexer.ts:85-94` (metadata writer), `query.ts:862-909` (`computeBlastRadius`), `query.ts:978-981` (query output)
