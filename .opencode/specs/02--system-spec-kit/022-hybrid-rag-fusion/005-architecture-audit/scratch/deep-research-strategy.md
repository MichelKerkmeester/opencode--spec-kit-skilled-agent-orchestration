# Research Strategy — COMPLETED

## Topic
System-Spec-Kit full architecture audit: logic improvements, structural optimizations, automation opportunities, UX friction, bugs, and misalignments with sk-code--opencode and sk-doc standards.

## Key Questions — ALL ANSWERED
- [x] Q1: What logic in scripts/ modules can be simplified, consolidated, or made more robust?
  → 37+ findings across scripts/core, lib, extractors, memory, utils. Major: workflow.ts god function, subfolder-utils duplication, content-filter O(n²).
- [x] Q2: Where are automation opportunities — manual workflows that could be scripted or made self-healing?
  → Eval scripts share CLI/artifact patterns needing shared helper. Index maintenance, cache invalidation partially automated. File watcher and job queue exist but gaps remain.
- [x] Q3: What UX friction exists in commands, prompts, error messages, and developer workflow?
  → Inconsistent MCP error contracts, raw errors reaching clients, confusing startup failures, missing recovery hints.
- [x] Q4: What bugs, edge cases, or error handling gaps exist in extractors, memory scripts, or MCP handlers?
  → 48+ HIGH bugs found. Top: save pipeline atomicity, score normalization, checkpoint incompleteness, embedding dimension mismatches, session dedup for id-less memories.
- [x] Q5: Where do system-spec-kit patterns misalign with sk-code--opencode or sk-doc standards?
  → Mixed logging (console vs structuredLog), silent error suppression in capture adapters, no common failure contract across extractors, export * barrel hygiene issues.

## What Worked
- 3-agent parallel dispatch: copilot primary + copilot standards + codex bug hunter — very productive, distinct findings per agent
- Codex bug hunter: exceptionally effective at line-level edge case detection (path bugs, NaN, race conditions)
- Copilot standards auditor: strong at cross-file pattern analysis and contract consistency checks
- Copilot primary investigator: deep pipeline architecture analysis, found Stage 1 wrapping legacy mini-pipeline
- Parallel iteration dispatch (6 agents at once): significant time savings
- GPT-5.4 high reasoning: consistent quality across all 30 agent runs

## What Failed
- No agent failures across all 30 runs
- Some overlap between iterations (deduplication needed in synthesis)
- Iteration 10 codex agent produced minimal output (9 lines) — security findings mostly duplicated earlier work

## Exhausted Approaches
None — all 5 questions fully answered within 10 iterations.

## Convergence Report
| Iteration | Focus | Findings | newInfoRatio | Cumulative |
|-----------|-------|----------|-------------|------------|
| 1 | scripts/core, extractors, memory, utils | 37 | 1.00 | 37 |
| 2 | scripts/lib, shared, evals, spec-folder | 29 | 0.78 | 66 |
| 3 | MCP handlers CRUD/save, search/hooks, cognitive | 24 | 0.65 | 90 |
| 4 | MCP search pipeline, storage/vector, extraction | 21 | 0.57 | 111 |
| 5 | UX, automation, providers/cache/telemetry | 18 | 0.49 | 129 |
| 6 | Search features, API surface, BM25/FTS/vector | 15 | 0.41 | 144 |
| 7 | Duplication, SKILL.md alignment, dead code | 16 | 0.43 | 160 |
| 8 | Eval system, learning/errors, shared bugs | 14 | 0.38 | 174 |
| 9 | Config, test coverage, loaders/types | 10 | 0.27 | 184 |
| 10 | Final sweep, compliance, security | 8 | 0.22 | 192 |

Convergence achieved: 3 consecutive iterations below 0.30 threshold.

## Research Boundaries
- Max iterations: 20 (stopped at 10 due to convergence)
- Convergence threshold: 0.05 (actual convergence at rolling avg 0.29)
- Completed: 2026-03-20
- Total agent runs: 30
- research.md: 944 lines, ~120 deduplicated findings
