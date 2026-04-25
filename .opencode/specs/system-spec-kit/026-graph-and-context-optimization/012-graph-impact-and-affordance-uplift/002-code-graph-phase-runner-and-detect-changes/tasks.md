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
| T-002-A1 | Define `Phase<I,O>` interface in `phase-runner.ts` | A | pending |
| T-002-A2 | Implement topological sort + cycle detection | A | pending |
| T-002-A3 | Implement duplicate-name rejection | A | pending |
| T-002-A4 | Implement dependency-only output passing | A | pending |
| T-002-A5 | Unit tests for runner rejection paths | A | pending |
| T-002-B1 | Decompose `indexFiles()` body into declared phases | B | pending |
| T-002-B2 | Replace inlined flow with `runPhases()` call | B | pending |
| T-002-B3 | Run existing test suite — confirm no regression | B | pending |
| T-002-C1 | Choose diff parsing library + record decision | C | pending |
| T-002-C2 | Implement `diff-parser.ts` (unified diff → hunks) | C | pending |
| T-002-C3 | Map hunks to symbols via line-range overlap | C | pending |
| T-002-D1 | Implement `detect-changes.ts` handler | D | pending |
| T-002-D2 | Hard rule: status=blocked on stale (never empty) | D | pending |
| T-002-D3 | Register in `handlers/index.ts` | D | pending |
| T-002-E1 | Run `/create:feature-catalog` for 03--discovery + 14--pipeline-architecture | E | pending |
| T-002-E2 | Run `/create:testing-playbook` for same categories | E | pending |
| T-002-E3 | sk-doc DQI scoring ≥85 | E | pending |
| T-002-F1 | `validate.sh --strict` on `012/002/` | F | pending |
| T-002-F2 | Run code-graph vitest suite | F | pending |
| T-002-F3 | Populate `implementation-summary.md` | F | pending |

## Blockers
- T-002-C1 (diff lib choice) is the open packet blocker — see implementation-summary.md when resolved

## Dependencies
- All tasks blocked on 012/001 license audit completion

## References
- spec.md, plan.md, checklist.md (this folder)
