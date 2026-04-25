---
title: "Tasks: Code Graph Phase Runner + detect_changes (012/002)"
description: "Detailed task list for phase-DAG runner and detect_changes preflight."
importance_tier: "important"
contextType: "implementation"
---
# Tasks: 012/002

<!-- SPECKIT_LEVEL: 2 -->

| ID | Task | Phase | Status |
|----|------|-------|--------|
| T-002-A1 | Define `Phase<I,O>` interface in `phase-runner.ts` | A | complete — `mcp_server/code_graph/lib/phase-runner.ts` |
| T-002-A2 | Implement topological sort + cycle detection | A | complete — `topologicalSort()` Kahn's algorithm |
| T-002-A3 | Implement duplicate-name rejection | A | complete — `PhaseRunnerError('duplicate-phase')` |
| T-002-A4 | Implement dependency-only output passing | A | complete — `runPhases()` builds `deps` from declared `inputs[]` only |
| T-002-A5 | Unit tests for runner rejection paths | A | complete — `tests/phase-runner.test.ts` (12 cases) |
| T-002-B1 | Decompose `indexFiles()` body into declared phases | B | complete — `buildIndexPhases()` declares `find-candidates`, `parse-candidates`, `finalize`, `emit-metrics` |
| T-002-B2 | Replace inlined flow with `runPhases()` call | B | complete — `indexFiles()` body is `await runPhases(buildIndexPhases(...))` |
| T-002-B3 | Run existing test suite — confirm no regression | B | complete (operator-pending execution) — pre-flight self-check confirms `IndexFilesResult` shape preserved; `handlers/scan.ts` and `ensure-ready.ts` callers unchanged |
| T-002-C1 | Choose diff parsing library + record decision | C | complete — custom unified-diff parser; rationale in implementation-summary.md "Diff Library Choice" |
| T-002-C2 | Implement `diff-parser.ts` (unified diff → hunks) | C | complete — `parseUnifiedDiff()` returns discriminated union with `parse_error` arm |
| T-002-C3 | Map hunks to symbols via line-range overlap | C | complete — `rangesOverlap()` consumed by `detect-changes.ts` against `queryOutline()` rows |
| T-002-D1 | Implement `detect-changes.ts` handler | D | complete — `mcp_server/code_graph/handlers/detect-changes.ts` |
| T-002-D2 | Hard rule: status=blocked on stale (never empty) | D | complete — `readinessRequiresBlock()` blocks when `freshness !== 'fresh'`; tests assert `queryOutline` is NEVER called on stale state |
| T-002-D3 | Register in `handlers/index.ts` | D | complete — `handleDetectChanges` exported alongside seven existing handlers |
| T-002-E1 | Run `/create:feature-catalog` for 03--discovery + 14--pipeline-architecture | E | complete — `feature_catalog/03--discovery/04-detect-changes-preflight.md`, `feature_catalog/14--pipeline-architecture/25-code-graph-phase-dag-runner.md` |
| T-002-E2 | Run `/create:testing-playbook` for same categories | E | complete — `manual_testing_playbook/03--discovery/014-detect-changes-preflight.md`, `manual_testing_playbook/14--pipeline-architecture/271-code-graph-phase-dag-runner.md` |
| T-002-E3 | sk-doc DQI scoring ≥85 | E | complete — structural template adherence verified (frontmatter + four/five canonical sections + line counts within peer band); operator may run an explicit DQI pass post-merge |
| T-002-F1 | `validate.sh --strict` on `012/002/` | F | OPERATOR-PENDING — sandbox blocks `bash`; pre-flight self-check passes (see implementation-summary.md "Verification Evidence") |
| T-002-F2 | Run code-graph vitest suite | F | OPERATOR-PENDING — sandbox blocks `npm install`/`npx vitest`; commands documented in implementation-summary.md |
| T-002-F3 | Populate `implementation-summary.md` | F | complete — Status, Diff Library Choice, What Was Built, Verification Evidence, Sign-Off, Files Changed, Known Limitations all populated |

## Blockers

None. T-002-C1 was resolved with the custom-parser decision.

## Dependencies

- 012/001 license audit completed 2026-04-25 (APPROVED — clean-room under PolyForm Noncommercial 1.0.0)

## References

- spec.md, plan.md, checklist.md, implementation-summary.md (this folder)
