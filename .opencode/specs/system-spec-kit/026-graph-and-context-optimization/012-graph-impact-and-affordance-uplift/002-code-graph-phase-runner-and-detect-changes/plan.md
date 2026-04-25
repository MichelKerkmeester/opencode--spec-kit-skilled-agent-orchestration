---
title: "Plan: Code Graph Phase Runner + detect_changes (012/002)"
description: "Implementation steps for phase-DAG runner and detect_changes preflight handler."
importance_tier: "important"
contextType: "implementation"
---
# Plan: Code Graph Phase Runner + detect_changes (012/002)

<!-- SPECKIT_LEVEL: 2 -->

## Steps

### A. Phase runner foundation
1. Define `Phase<I, O>` interface in `phase-runner.ts` with `name`, `inputs`, `outputs`, `run(deps): Promise<O>`
2. Implement topological sort with cycle detection
3. Implement duplicate-name rejection
4. Implement dependency-only output passing (deps not declared = not visible)
5. Unit tests for all rejection paths

### B. Wrap structural-indexer
6. Read `structural-indexer.ts:1369` `indexFiles()` body
7. Decompose into declared phases (e.g., `find-files`, `parse`, `extract-edges`, `persist`, `readiness-check`)
8. Replace inlined flow with `runPhases([...])` call
9. Run existing test suite to confirm no regression
10. Preserve all current exports

### C. Diff parser
11. Choose diff parsing library (P1-03 blocker — research: `diff`, `parse-diff`, custom). Record decision in implementation-summary.md
12. Implement `diff-parser.ts` to convert unified diff → `[{ file, hunks: [{ oldStart, oldLines, newStart, newLines, lines }] }]`
13. Map hunks to symbols via existing `code_nodes` `start_line`/`end_line` (line-range overlap)

### D. detect_changes handler
14. Implement `detect-changes.ts` with input schema `{ diff: string, repo?: string }`
15. Output: `{ status, affectedSymbols[], blockedReason?, timestamp }`
16. Hard rule: check readiness FIRST. If stale or full-scan-required, return `status: "blocked"` immediately
17. Register handler in `handlers/index.ts`

### E. Per-packet docs
18. Use `/create:feature-catalog` to add entries in `03--discovery/` (detect_changes) and `14--pipeline-architecture/` (phase-DAG)
19. Use `/create:testing-playbook` for same categories
20. Run sk-doc DQI scoring; remediate to ≥85

### F. Verification
21. `validate.sh --strict` on `012/002/`
22. Run code-graph vitest suite
23. Update `implementation-summary.md` with what was built

## Dependencies
- 012/001 license audit must be `complete` (P0 gate)

## Effort
L (8-12h)

## References
- spec.md (this folder), tasks.md, checklist.md
