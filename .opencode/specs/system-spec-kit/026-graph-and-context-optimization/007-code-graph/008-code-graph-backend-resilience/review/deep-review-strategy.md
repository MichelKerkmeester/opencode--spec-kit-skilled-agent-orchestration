# Deep-Review Strategy: 008 Code-Graph Backend Resilience

## Review Target

The 008-code-graph-backend-resilience packet implementation: 5 backend streams (hash predicate, resolver upgrades, edge-weight + drift, self-heal observability, gold-battery verifier + `code_graph_verify` MCP tool) landed across 17+ files in `.opencode/skill/system-spec-kit/mcp_server/code_graph/` plus tests and tool-schema registration.

Recent commits to review against:
- `87bf42a3d` — T01-T03 metadata helpers + gold-query-verifier scaffold
- `14620bec9` — T04-T15 full backend implementation
- `56480a003` — Tasks/checklist closeout + tool-count + mtime test fixes

## Iteration Plan

10 iterations partitioned by review dimension and stream:

| Iter | Dimension | Focus | Files |
|------|-----------|-------|-------|
| 1 | Correctness | Hash predicate logic + edge cases | code-graph-db.ts isFileStale + ensureFreshFiles |
| 2 | Correctness | Hash predicate test coverage + scan handler propagation | crash-recovery.vitest.ts, code-graph-indexer.vitest.ts, scan.ts:208-217 |
| 3 | Correctness | Resolver capture + cross-file resolution | structural-indexer.ts, tree-sitter-parser.ts, indexer-types.ts |
| 4 | Correctness | Edge-weight config + drift detection math | edge-drift.ts (PSI/JSD), structural-indexer weight references |
| 5 | Correctness | Verifier library + handler + MCP wiring | gold-query-verifier.ts, handlers/verify.ts, tool-schemas + dispatch |
| 6 | Correctness | Self-heal observability + ReadyResult contract | ensure-ready.ts, detect_changes hard-block preservation |
| 7 | Security | Path traversal, sandbox respect, no network calls | resolver, verifier, scan handler |
| 8 | Traceability | Test coverage matches REQ-001..REQ-015; evidence trails to 007 iter 8-12 | All new tests, spec.md acceptance scenarios |
| 9 | Maintainability | Naming, comments, abstraction earned, no dead code, backwards-compat | All 17 modified files |
| 10 | Synthesis | Cross-cutting findings, verdict, remediation roadmap, finalize report | All prior iterations |

## Quality Guards

Per dimension a finding must include:
- Severity tag: P0 (blocker), P1 (required), P2 (suggestion)
- File:line citation pointing at the exact code
- Reason: what's wrong + why it matters
- Suggested fix: concrete, actionable

Adversarial self-check on every P0 finding:
- Is the file:line actually the problem, or is it called from somewhere else?
- Does the suggested fix introduce new risk?
- Is there a test that would catch a regression?

## Convergence Criteria

- newFindingsRatio < 0.10 across rolling 3-iteration window
- All 4 dimensions covered at least once
- No new P0 findings in last 2 iterations
- Final verdict produced in iteration 10 (synthesis)

## Out-of-Scope

- Pre-existing test failures unrelated to 008 (copilot-hook-wiring, codex-prompt-wrapper, etc.)
- Code outside the 17 files listed in implementation-summary.md
- Changes to 007 research outputs (read-only context)

## Known Context

- 007 iter 8-12 markdowns are the design source of truth
- impl-summary.md documents 5 known limitations as of 2026-04-25T23:30Z
- Build PASSED after every cli-codex task; final test pass is 99.8%
- 3 test failures from 008 are FIXED (tool-count, layer-definitions, mtime predicate)
