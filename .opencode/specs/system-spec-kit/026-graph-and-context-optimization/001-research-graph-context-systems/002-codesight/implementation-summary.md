---
title: "Implementation Summary: 002-codesight Research Phase"
description: "10-iteration deep-research audit of the codesight external Node.js/TypeScript skill produced 52 evidence-grounded findings and a 22-row line-cited Adopt/Adapt/Reject decision matrix for Public's Code Graph MCP, CocoIndex, and Spec Kit Memory surfaces."
trigger_phrases:
  - "002-codesight implementation summary"
  - "002-codesight outcome"
  - "codesight research complete"
importance_tier: critical
contextType: summary
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-codesight |
| **Completed** | 2026-04-06 |
| **Level** | 3 |
| **Status** | COMPLETE |
| **Iterations** | 10 of 10 |
| **Findings** | 52 source-confirmed |
| **Questions answered** | 17 of 17 (Q1-Q12 + Q13-Q17) |

---

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

10-iteration deep-research session against `external/` (codesight Node.js/TypeScript zero-dependency CLI) produced **52 source-confirmed findings** across two charters: the original 12-question charter (iters 1-5, 26 findings) and a user-requested continuation charter (iters 6-10, 26 findings) covering 5 unexplored modules. The synthesis lives in `research/research.md` (now 18 sections, 800+ lines) with a final 22-row Adopt/Adapt/Reject decision matrix in §18.3.

**Stop reason:** `all_continuation_questions_answered` after coverage hit 17/17 questions across both charters.

### Iteration Log

| # | Iteration | Engine | Findings | newInfoRatio | Questions |
|---|-----------|--------|----------|--------------|-----------|
| 1 | index.ts execution + zero-dep loader | cli-codex gpt-5.4 high | 5 | 0.62 | Q1, Q5 |
| 2 | Hono + NestJS routes + Drizzle schema | cli-codex gpt-5.4 high | 4 | 0.69 | Q2, Q3, Q4-partial |
| 3 | graph + blast-radius + 8 MCP tools | cli-codex gpt-5.4 high | 6 | 0.78 | Q6, Q7, Q9 |
| 4 | profile generators + benchmark validation | native fallback (codex stalled) | 6 | 0.55 | Q8, Q10 |
| 5 | static vs query-time + cross-phase scoping | native fallback (codex stalled) | 5 | 0.42 | Q11, Q12, Q4-reconfirmed |
| 6 | contract enrichment pipeline | cli-codex gpt-5.4 high | 5 | 0.82 | Q13 |
| 7 | Python and Go AST extraction depth | cli-codex gpt-5.4 high | 6 | 0.88 | Q14 |
| 8 | token stats and tokensSaved provenance | cli-codex gpt-5.4 high | 5 | 0.78 | Q15 |
| 9 | monorepo + config + plugins | cli-codex gpt-5.4 high | 6 | 0.79 | Q16 |
| 10 | components + telemetry + cumulative risk | cli-codex gpt-5.4 high | 4 | 0.44 | Q17 |

**Note on continuation engine:** All 5 continuation iterations were dispatched in parallel as background processes via `cli-codex --sandbox read-only`. The sandbox blocked direct `/tmp` writes from the codex agents, so the orchestrator extracted the assembled reports from each agent's `-o` last-message capture (iter 8) or stdout reasoning trace (iters 6, 7, 9, 10) and reconstructed iteration files verbatim with all line citations preserved.

### Top 10 Insights

1. **Codesight's "zero dependency" claim is real at the package level** but conditional in practice — AST precision depends on borrowing the scanned project's `typescript` package via `external/src/ast/loader.ts`. (iter 1)
2. **The 8 MCP tools** in `external/src/mcp-server.ts` and the static `.codesight/` artifacts are projections of the **same `ScanResult` data structure**, not parallel pipelines. (iter 5)
3. **Per-tool profile generation** in `external/src/generators/ai-config.ts` is meaningfully different per Claude Code, Cursor, Codex, Copilot, Windsurf — not just file renames. (iter 4)
4. **The blast-radius BFS in `external/src/detectors/blast-radius.ts` has a depth-cap off-by-one bug** that lets nodes one hop beyond `maxDepth` leak into results. (iter 3)
5. **The README's "11.2x average token reduction" headline** comes from 3 private SaaS codebases NOT in `external/eval/fixtures/`; `external/src/eval.ts` measures only F1, never tokens. (iter 4)
6. **`enrichRouteContracts`** is a regex-only post-detection mutator strongly biased toward Hono; **tRPC has zero contract enrichment** despite AST route detection. (iter 6)
7. **Python is genuinely AST-backed** via `python3 -c "ast.parse(...)"` subprocess, but **Go uses brace-tracking + regex with no `go/parser`** and mislabels output as `confidence: "ast"`. (iter 7)
8. **`tokensSaved` is a hand-tuned linear formula**: `(routes*400 + schemas*300 + components*250 + libs*200 + envVars*100 + middleware*200 + hotFiles*150 + min(fileCount,50)*80) * 1.3`. Zero token-math tests. (iter 8)
9. **Monorepo aggregation only understands `pnpm-workspace.yaml` and `package.json` `workspaces`** — no `turbo.json` / `nx.json` / `lerna.json` / Rush detection. (iter 9)
10. **Telemetry is local-only and opt-in** via `--telemetry` flag — no HTTP, no identity reads, no postinstall hook. **NOT an adoption blocker.** (iter 10)

### Adoption Decision Matrix Summary

The full 22-row matrix lives in `research/research.md` §18.3. High-level breakdown:

- **Adopt now (11 items)**: orchestration shape, static `.codesight/` artifact emission, AST-first/regex-fallback pattern, per-tool profile overlay, F1 fixture harness, hot-file ranking (degree counting), Python AST + subprocess pattern, SQLAlchemy AST schema extraction, telemetry surface (local opt-in), `disableDetectors` short-circuit, Drizzle gap documentation.
- **Prototype later (6 items)**: blast-radius reverse BFS (after fixing depth-cap), contract enrichment (with tRPC + handler scoping), Go structured-regex (with honest labeling), monorepo aggregation (with turbo/nx/lerna), component detection (as breadcrumb only), plugin contract (with mandatory test fixture).
- **Reject (3 items)**: token stats math (un-tested heuristic), GORM heuristic schema (over-admits), README "11.2x token reduction" headline (not in fixtures).
- **Out of scope (2 items)**: HTML report styling, npm publishing workflow.

---

<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

### Engine Strategy

- **Iters 1-3**: Dispatched cleanly via `codex exec --model gpt-5.4 -c model_reasoning_effort="high" --sandbox read-only -o /tmp/codex-iter-NNN-output.md`. Each call returned in ~3 minutes with clean output.
- **Iters 4-5**: cli-codex stalled in S sleep state for 20-50 minutes (likely API throttling from concurrent codex traffic in a sibling session). Killed the stuck processes and completed iters 4-5 with native Read/Grep, preserving the same finding template and exact line citations.
- **Iters 6-10 (continuation charter)**: Dispatched all 5 in parallel as background processes via `Bash run_in_background`. Total wall time ~7 minutes for all 5. The read-only sandbox blocked direct `/tmp` writes from codex, so the orchestrator extracted assembled reports from `-o` last-message captures or stdout reasoning traces.

### State Files

- `research/deep-research-config.json` — `status=complete`, `maxIterations=10`, delegation=`cli-codex gpt-5.4 high read-only`
- `research/deep-research-state.jsonl` — 16 lines: 5 original-iteration records + 5 continuation-iteration records + session_start + convergence_signal + synthesis_complete + continuation_start + continuation_synthesis_pending + continuation_synthesis_complete events
- `research/deep-research-strategy.md` — Q1-Q17 marked as answered, NEXT FOCUS = "SESSION COMPLETE"
- `research/deep-research-dashboard.md` — reducer-refreshed: Status=COMPLETE, Iteration=10/10, iterationsCompleted=10
- `research/findings-registry.json` — reducer-refreshed (370 keyFindings entries)

### Memory Artifact

- `memory/06-04-26_17-58__continuation-deep-research-run-for-002-codesight.md` — 767 lines, memory ID #1835, quality 100/100, `importance_tier=critical`
- `memory/metadata.json` — Voyage 768-dim embedding, 41 trigger phrases (after path-fragment cleanup)

---

<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

1. **Used cli-codex with gpt-5.4 + reasoning_effort=high + sandbox=read-only per user request**, dispatched all 5 continuation iterations in parallel as background processes for fast mode (Bash run_in_background).
2. **Picked 5 unexplored modules** (contracts.ts, extract-python.ts/extract-go.ts, tokens.ts, scanner.ts/config.ts, components.ts/telemetry.ts) for the continuation charter Q13-Q17 since iters 1-5 had already covered the original 12 questions with stop reason `all_questions_answered`.
3. **Sandbox-write workaround**: When the read-only sandbox blocked codex agents from writing to `/tmp` (`zsh:1: operation not permitted`; `can't create temp file for here document`), the orchestrator extracted the fully assembled reports from the codex stdout reasoning traces (iters 6, 7, 9, 10) or the `-o` last-message capture (iter 8) and reconstructed iteration files verbatim with all line citations preserved.
4. **Telemetry verdict**: Concluded that telemetry is NOT an adoption blocker (local opt-in via `--telemetry` flag, no network, no identity reads, no postinstall hook) but token-savings claims, GORM mislabeling, blast-radius depth-cap bug, and contract enrichment silent no-ops ARE the real risks for any future port to `Code_Environment/Public`.
5. **Sandbox lesson documented**: Read-only sandbox is too tight for codex agents that need to write external workspace files. For future deep-research dispatches via cli-codex, either use `--sandbox workspace-write` with explicit user approval or keep the orchestrator-extracts-from-stdout pattern (which worked here without losing any findings).
6. **SQLAlchemy vs Drizzle insight**: Codesight's SQLAlchemy AST extraction is RICHER than its Drizzle extraction (has index/fk extraction) — directly contradicting the implicit assumption that the TypeScript path would always be the most complete. Iter 5 finding 3 had documented the Drizzle gap; iter 7 added the SQLAlchemy comparison.

---

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

- [x] All 17 questions answered (Q1-Q12 from original charter + Q13-Q17 from continuation charter)
- [x] 52 source-confirmed findings with exact `external/src/` line citations
- [x] 22-row adoption decision matrix in `research/research.md` §18.3
- [x] Cross-phase boundaries with 003-contextador and 004-graphify explicitly bounded
- [x] Memory artifact saved with `critical` tier, indexed as memory #1835 (768-dim Voyage embedding)
- [x] All trigger phrases are semantic (no path fragments after manual patching)
- [x] `validate.sh --strict` returns RESULT: PASSED (after spec docs created with template-matching headers)
- [x] Spec docs (spec.md, plan.md, tasks.md, implementation-summary.md) present and consistent
- [x] No edits made under `external/`
- [x] Reducer maintained findings-registry.json, dashboard, and machine-owned strategy sections in sync

---

<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

- **Reducer and analyst sections collide**: The reducer treats sections 7-11 of strategy.md as machine-owned, but it sometimes also wipes the analyst-owned sections 3 (KEY QUESTIONS) and 6 (ANSWERED QUESTIONS) when JSONL records use abbreviated question texts. Workaround: re-add Q1-Q17 summaries after each reducer run.
- **Validator template strictness**: `validate.sh --strict` enforces exact section header matches against the active template. Any extra custom section header (e.g., `## OBJECTIVE`, `## ACCEPTANCE SCENARIOS`) is rejected as an error. The fix is to put extra information inside template-allowed sections rather than as new sections.
- **Sandbox-bound report extraction**: When cli-codex agents are dispatched with `--sandbox read-only`, they cannot write to `/tmp` even via `-o` flag for tool-driven file creation; the workaround relies on stdout reasoning trace extraction. This is fragile if codex changes its output format. A more robust approach would be `--sandbox workspace-write` with explicit user approval.
- **No turbo/nx/lerna detection**: Codesight's monorepo support is limited to pnpm-workspace.yaml + package.json workspaces. Any port to Public would need to add the missing manager branches before being usable on real-world tool-specific monorepos.
- **Token-savings claims are heuristic, not measured**: The "tokensSaved" number ships into `CLAUDE.md` is computed from a hand-tuned linear formula with zero tests asserting the constants. Any external claim referencing this number would be marketing, not measurement.


<!-- /ANCHOR:limitations -->