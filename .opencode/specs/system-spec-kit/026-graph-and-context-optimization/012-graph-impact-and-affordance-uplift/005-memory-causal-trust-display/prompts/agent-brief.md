# Agent Brief — 012/005 Memory Causal Trust Display

You are an autonomous implementation agent. **No conversation context.** This brief is everything you need.

## Your role

You add display-only trust badges (`confidence`, `extractionAge`, `lastAccessAge`, `orphan`, `weightHistoryChanged`) to `MemoryResultEnvelope`. **NO schema change. NO new relation types. NO storage of code/process/tool facts.** Pure presentation layer using existing causal-edge columns.

## Read first (in this exact order)

1. **Sub-phase spec (your scope, READ FULLY):**
   `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/spec.md`
2. **Sub-phase plan + tasks + checklist:**
   `.../005-memory-causal-trust-display/{plan.md,tasks.md,checklist.md}`
3. **Phase-root (read-only):**
   `.../012-graph-impact-and-affordance-uplift/{spec.md,decision-record.md}` (note ADR-012-005: Memory display only; no causal vocabulary changes)
4. **License clearance:**
   `.../012/001-clean-room-license-audit/implementation-summary.md` — must show APPROVED. If HALT, **STOP**.
5. **Research basis:**
   `.../research/007-git-nexus-pt-02/research.md` §5 (Memory findings), §11 Packet 4, §12 RISK-06
6. **Existing Public code (READ before EDIT):**
   - `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` (lines 82-94 schema — DO NOT modify; columns: `strength`, `evidence`, `source_anchor`, `target_anchor`, `extracted_at`, `created_by`, `last_accessed`)
   - `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts` (lines 327-338 `computeTraversalFreshnessFactor` decay logic — DO NOT modify)
   - `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts` (target — add `trustBadges` to envelope)
   - `.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts` (target — propagate badges)

## Worktree + branch

- Worktree: `../012-005` (`git worktree add ../012-005 -b feat/012/005-memory-display`)
- Branch: `feat/012/005-memory-display`
- ✅ **Fully isolated** — no file overlap with 002, 003, 004, 006. No rebase needed.

## Files you may touch

| File | Action |
|------|--------|
| `mcp_server/formatters/search-results.ts` | **MODIFY** — add `trustBadges: { confidence, extractionAge, lastAccessAge, orphan, weightHistoryChanged }` to `MemoryResultEnvelope` (additive) |
| `mcp_server/lib/response/profile-formatters.ts` | **MODIFY** — propagate badges into search results |
| `mcp_server/tests/memory/trust-badges.test.ts` (or similar) | **CREATE** — badge population, age calculation, orphan detection, weight-history rendering |
| `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/<new-entry>.md` | **CREATE** via `/create:feature-catalog` |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/<new-entry>.md` | **CREATE** via `/create:testing-playbook` |
| `012/005/implementation-summary.md` | **MODIFY** — populate Display Placement Decision, What Was Built, Static Check Results |

## Files you may NOT touch

- 012 phase-root files
- Other sub-phase folders (001, 002, 003, 004, 006)
- `lib/storage/causal-edges.ts` (NO schema change)
- `lib/search/causal-boost.ts` (NO modification to decay logic)
- `code_graph/`, `skill_advisor/` (other sub-phases)
- Any file that would introduce code/process/tool facts into Memory storage
- `external/` (read-only)

## Hard rules (pt-02 §12 RISK-06)

1. **Clean-room only** (ADR-012-001).
2. **NO schema change** — `causal_edges` table columns must be unchanged. Verify by diff against current `causal-edges.ts:82-94`.
3. **NO new relation types** — the six existing relations stay: `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`.
4. **NO Code Graph structural facts** stored in Memory. Memory remains causal artifact lineage only.
5. **NO modification** to `causal-boost.ts:327-338` `computeTraversalFreshnessFactor` decay logic. You read its existing output, you do not change it.
6. **Compute badges from existing columns:**
   - `confidence` ← from `strength`
   - `extractionAge` ← derived from `extracted_at` vs `now()`
   - `lastAccessAge` ← derived from `last_accessed` vs `now()`
   - `orphan` ← derivable (no incoming edges)
   - `weightHistoryChanged` ← derivable from existing edge mutation log if present; if not present, decide whether to defer (record decision in `implementation-summary.md`)
7. **Display placement** — record your decision (memory_search results vs context envelope vs status panel) in `implementation-summary.md` under "Display Placement Decision".
8. **Backward compat** — `MemoryResultEnvelope` shape stays additive. Existing callers parse unchanged.
9. **Read whole file before edit.**

## Success criteria

- [ ] All 16 tasks in `012/005/tasks.md` complete (T-005-A1 through T-005-D5)
- [ ] All checklist items in `012/005/checklist.md` ticked with evidence
- [ ] `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .../012/005 --strict` passes
- [ ] `vitest run` for memory tests green
- [ ] Existing memory test suite still green (no regression)
- [ ] `tsc --noEmit` clean
- [ ] Static check: `causal_edges` schema bytes-equal between this branch and main (`git diff main -- mcp_server/lib/storage/causal-edges.ts` shows no schema changes)
- [ ] Static check: 6 relation types unchanged
- [ ] Display placement decision recorded
- [ ] sk-doc DQI ≥85 on the 2 new feature_catalog/playbook entries

## Output contract

- Commit to `feat/012/005-memory-display` with conventional-commit messages
- Final commit suffix: `(012/005)`
- Do NOT merge — orchestrator handles merges
- On completion, print: `EXIT_STATUS=DONE` + display placement choice + test summary + LOC delta + static-check results

## References

- pt-02 §11 Packet 4 (Memory trust display)
- pt-02 §12 RISK-06 (Memory duplicate code index)
- ADR-012-005 (Memory display only; no causal vocabulary changes)
- Verified anchors: `causal-edges.ts:82-94` (schema), `causal-boost.ts:327-338` (`computeTraversalFreshnessFactor`)
