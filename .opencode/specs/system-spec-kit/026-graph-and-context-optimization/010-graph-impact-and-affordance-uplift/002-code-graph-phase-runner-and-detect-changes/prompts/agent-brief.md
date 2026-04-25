# Agent Brief — 012/002 Code Graph Phase Runner + detect_changes Preflight

You are an autonomous implementation agent. **No conversation context.** This brief is everything you need.

## Your role

You own the Code Graph foundation sub-phase. You wrap the existing scan flow in a typed phase-DAG runner and add a read-only `detect_changes` MCP handler that maps git diff hunks to affected symbols, refusing to answer when the graph is stale.

## Read first (in this exact order)

1. **Sub-phase spec (your scope, READ FULLY):**
   `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/002-code-graph-phase-runner-and-detect-changes/spec.md`
2. **Sub-phase plan + tasks + checklist:**
   `.../002-code-graph-phase-runner-and-detect-changes/{plan.md,tasks.md,checklist.md}`
3. **Phase-root (read-only context):**
   `.../010-graph-impact-and-affordance-uplift/{spec.md,decision-record.md}` (note ADR-012-001 clean-room, ADR-012-002 sub-phase split, ADR-012-003 route/tool deferred, ADR-012-004 mutating rename rejected)
4. **License clearance:**
   `.../012/001-clean-room-license-audit/implementation-summary.md` — must show APPROVED before you write any code. If HALT, **STOP**.
5. **Research basis:**
   `.../research/007-external-project-pt-02/research.md` §4 (Code Graph findings), §11 Packet 1, §12 RISK-03
6. **Existing Public code (READ before EDIT):**
   - `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts` (target: line ~1369 `indexFiles` body)
   - `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts` (schema reference, do NOT modify)
   - `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/index.ts` (add new handler registration)
   - All existing `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/` (understand existing test patterns)

## Worktree + branch

- Worktree: `../012-002` (`git worktree add ../012-002 -b feat/012/002-phase-runner`)
- Branch: `feat/012/002-phase-runner`

## Files you may touch

| File | Action |
|------|--------|
| `mcp_server/code_graph/lib/phase-runner.ts` | **CREATE** — `Phase<I,O>` interface, topo-sort, cycle/duplicate-name rejection |
| `mcp_server/code_graph/lib/diff-parser.ts` | **CREATE** — git diff hunk parser (you choose the library; record decision in your `implementation-summary.md`) |
| `mcp_server/code_graph/handlers/detect-changes.ts` | **CREATE** — read-only preflight handler |
| `mcp_server/code_graph/lib/structural-indexer.ts` | **MODIFY** line ~1369 only — wrap `indexFiles()` body in phase runner. Do NOT touch lines 80-100 (reserved for sub-phase 003) |
| `mcp_server/code_graph/handlers/index.ts` | **MODIFY** — register new `detect_changes` handler |
| `mcp_server/code_graph/tests/phase-runner.test.ts` | **CREATE** — unit tests for runner |
| `mcp_server/code_graph/tests/detect-changes.test.ts` | **CREATE** — handler tests |
| `.opencode/skill/system-spec-kit/feature_catalog/03--discovery/<new-entry>.md` | **CREATE** via `/create:feature-catalog` |
| `.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/<new-entry>.md` | **CREATE** via `/create:feature-catalog` |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/03--discovery/<new-entry>.md` | **CREATE** via `/create:testing-playbook` |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/<new-entry>.md` | **CREATE** via `/create:testing-playbook` |
| `012/002/implementation-summary.md` | **MODIFY** — populate Status, Diff Library Choice, What Was Built, Verification Evidence |

## Files you may NOT touch

- 012 phase-root files (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`)
- Other sub-phase folders (001, 003, 004, 005, 006)
- `code_graph/lib/structural-indexer.ts` lines **80-100** (reserved for sub-phase 003 metadata writer)
- `code_graph/handlers/query.ts` (sub-phase 003 owns this)
- `code_graph/lib/code-graph-context.ts` (sub-phase 003 owns this)
- Any `skill_advisor/`, `lib/storage/`, `lib/search/`, `formatters/` files (other sub-phases)
- SQLite schema in `code-graph-db.ts` (NO migrations)
- `external/` (read-only)

## Hard rules

1. **Clean-room only** (ADR-012-001) — read External Project as architectural reference; do NOT copy source/schema text/implementation logic. Cite patterns with `[SOURCE: external/...]` if helpful, but write Public code from scratch.
2. **`detect_changes` MUST return `status: "blocked"` when graph readiness requires full scan.** NEVER `"no affected symbols"` on stale state. This is the P1 safety invariant.
3. **NO SQLite schema migration.** Reuse existing `code_files`, `code_nodes`, `code_edges` tables.
4. **Phase runner contract:** rejects duplicate phase names, missing dependencies, cycles. Phases see only their declared dependency outputs.
5. **Backward compat:** existing `indexFiles()` exports preserved; existing `code_graph` tests pass unchanged.
6. **Read whole file before edit.** When modifying `structural-indexer.ts`, read the full file first; confirm line ranges before applying any Edit.
7. **Per-packet docs MUST land** in feature_catalog `03--discovery/` (detect_changes) and `14--pipeline-architecture/` (phase-DAG).

## Success criteria

- [ ] All 19 tasks in `012/002/tasks.md` complete (T-002-A1 through T-002-F3)
- [ ] All checklist items in `012/002/checklist.md` ticked with evidence
- [ ] `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .../012/002 --strict` passes
- [ ] `vitest run code_graph/tests/phase-runner.test.ts` green
- [ ] `vitest run code_graph/tests/detect-changes.test.ts` green
- [ ] Existing `code_graph` test suite still green (no regression)
- [ ] `tsc --noEmit` clean
- [ ] sk-doc DQI ≥85 on the 4 new feature_catalog/playbook entries
- [ ] `implementation-summary.md` populated with diff-lib decision + what-was-built + verification evidence

## Output contract

- Commit to `feat/012/002-phase-runner` with conventional-commit messages per logical chunk
- Final commit suffix: `(012/002)`
- Do NOT merge — orchestrator handles merges
- On completion, print: `EXIT_STATUS=DONE` + diff-lib choice + test summary + LOC delta

## References

- pt-02 §11 Packet 1 (Code Graph foundation)
- pt-02 §12 RISK-03 (false-safe changed-symbol impact)
- ADR-012-002 (sub-phase decomposition rationale)
- Verified anchors: `structural-indexer.ts:~1369` (indexFiles entry, currently inlined per pt-02 verification)
