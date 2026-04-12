---
title: "Implementation Summary: 002-codesight Research Phase"
description: "20-iteration deep-research audit of the codesight external Node.js/TypeScript skill produced 95 evidence-grounded findings, a retained 22-row decision matrix, and a documented memory-quality audit for the final packet closeout."
trigger_phrases:
  - "002-codesight implementation summary"
  - "002-codesight outcome"
  - "codesight research complete"
importance_tier: critical
contextType: summary
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["implementation-summary.md"]

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
| **Completed** | 2026-04-08 |
| **Level** | 3 |
| **Status** | COMPLETE |
| **Iterations** | 20 of 20 |
| **Findings** | 95 source-confirmed |
| **Questions answered** | 27 of 27 (Q1-Q27) |

---

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

20-iteration deep-research packet against `external/` (codesight Node.js/TypeScript zero-dependency CLI) produced **95 source-confirmed findings** across three segments: the original 12-question charter (iters 1-5, 26 findings), the first continuation charter (iters 6-10, 26 findings), and a `completed-continue` extension (iters 11-20, 43 findings) covering watch/hook automation, detector precision edges, formatter lifecycle, MCP cache/error semantics, AI-config write safety, HTML projection, scanner heuristics, and the final adoption synthesis. The synthesis lives in `research/research.md` (872 lines) and retains the 22-row Adopt/Adapt/Reject decision matrix in §18.3.

**Stop reason:** `max_iterations_reached` after coverage hit 27/27 questions across the full reopened lineage.

### Iteration Log

| Range | Focus | Engine | Findings | Questions |
|---|---|---|---|---|
| 1-5 | Original charter: execution flow, routes, schemas, MCP tools, blast radius, profiles, benchmark claims, cross-phase scoping | cli-codex + native fallback | 26 | Q1-Q12 |
| 6-10 | First continuation: contracts, Python/Go parity, token stats, monorepo/config/plugins, components/telemetry | cli-codex parallel | 26 | Q13-Q17 |
| 11-19 | Completed-continue extension: watch/hook automation, middleware/libs/config, formatter lifecycle, MCP cache/error semantics, AI-config writes, HTML projection, scanner heuristics | direct Codex | 43 | Q18-Q26 |
| 20 | Final adoption synthesis after the 20-iteration closeout | direct Codex | 3 | Q27 |

**Note on engines:** The first continuation iterations (6-10) were dispatched in parallel via `cli-codex --sandbox read-only`; the sandbox blocked direct `/tmp` writes, so the orchestrator reconstructed the reports from captures/logs. The second continuation (11-20) executed directly in the active Codex session because self-invoking cli-codex from Codex would be circular.

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

### Late-Session Additions

- **`watchMode()` is a full-rescan debounce loop and `installGitHook()` stages `.codesight/` artifacts automatically**, which makes root mutations riskier than the README implies. (iter 11)
- **The MCP server caches a single `ScanResult` per root and cold scans write `.codesight/` files as side effects**, so the query surface is not purely read-only. (iter 16)
- **AI profile generation has real value but dangerous defaults**: direct root writes, append-vs-overwrite drift, and hardcoded MCP/tool assumptions. (iter 17)
- **The HTML report is best treated as a projection pattern, not a priority feature**, while scanner fidelity is bounded by shallow manifest/workspace heuristics. (iters 18-19)

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
- **Iters 6-10 (first continuation charter)**: Dispatched all 5 in parallel as background processes via `Bash run_in_background`. Total wall time ~7 minutes for all 5. The read-only sandbox blocked direct `/tmp` writes from codex, so the orchestrator extracted assembled reports from `-o` last-message captures or stdout reasoning traces.
- **Iters 11-20 (`completed-continue` extension)**: Executed directly in the active Codex session. This avoided the circular "Codex invoking cli-codex" path while preserving the same source-tracing and citation discipline.

### State Files

- `research/deep-research-config.json` — `status=complete`, `maxIterations=20`
- `research/deep-research-state.jsonl` — 30 lines covering the original session, the first continuation, the `completed-continue` reopen, runs 11-20, and the final synthesis event
- `research/deep-research-strategy.md` — analyst-owned sections updated to reflect answered questions; NEXT FOCUS remains packet-complete
- `research/deep-research-dashboard.md` — reducer-refreshed: Status=COMPLETE, Iteration=20/20, iterationsCompleted=20
- `research/findings-registry.json` — reducer-refreshed registry surface (671 derived key-finding snippets; this reducer metric is not the same as the human `findingsCount` total of 95)

### Memory Artifacts

- `research/research.md` — canonical research synthesis for the original 5-iteration checkpoint and later closeouts
- `implementation-summary.md` — canonical closeout summary for the first 10-iteration extension
- `research/research.md` — canonical 20-iteration extension synthesis; the historical memory artifact is no longer required for packet integrity
- `memory/metadata.json` — latest packet metadata; current policy skipped embedding for the newest save (`skipped_index_policy`)

---

<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

1. **Used cli-codex with gpt-5.4 + reasoning_effort=high + sandbox=read-only per user request** for the first 10 iterations, including the 5-way parallel first continuation.
2. **Extended the packet via `completed-continue` to reach 20 total iterations**, using direct Codex execution for runs 11-20 to avoid the circular "Codex calls cli-codex" path.
3. **Picked 5 unexplored modules for Q13-Q17 and 10 late-session surfaces for Q18-Q27** so each continuation added net-new coverage rather than rehashing earlier findings.
4. **Sandbox-write workaround**: When the read-only sandbox blocked codex agents from writing to `/tmp`, the orchestrator extracted the fully assembled reports from captures/logs and reconstructed iteration files verbatim with all line citations preserved.
5. **Telemetry verdict**: Concluded that telemetry is NOT an adoption blocker, while root-file mutation defaults, token-savings claims, GORM mislabeling, blast-radius depth-cap bug, and contract-enrichment silent no-ops remain the real adoption risks.
6. **Memory handling rule**: Preserved the saved-memory chronology but did not hand-edit the lower-signal newest memory, because sanctioned memory-save workflows should supersede bad snapshots rather than mutating them in place.

---

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

- [x] All 27 questions answered (Q1-Q27)
- [x] 95 source-confirmed findings with exact `external/src/` line citations
- [x] 22-row adoption decision matrix in `research/research.md` §18.3
- [x] Cross-phase boundaries with 003-contextador and 004-graphify explicitly bounded
- [x] Memory chronology audited; newest saved memory retained with a documented quality caveat instead of unsafe manual mutation
- [x] `validate.sh --strict` reports 0 errors; only the known ADR-anchor warning bucket remains
- [x] Spec docs (spec.md, plan.md, tasks.md, implementation-summary.md) present and consistent
- [x] No edits made under `external/`
- [x] Reducer maintained findings-registry.json, dashboard, and machine-owned strategy sections in sync

---

<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

- **Reducer and analyst sections collide**: The reducer treats sections 7-11 of strategy.md as machine-owned, but it sometimes also wipes the analyst-owned sections 3 (KEY QUESTIONS) and 6 (ANSWERED QUESTIONS) when JSONL records use abbreviated question texts. Workaround: re-add Q1-Q27 summaries after reducer runs when needed.
- **Validator template strictness**: `validate.sh --strict` enforces exact section header matches against the active template. Any extra custom section header (e.g., `## OBJECTIVE`, `## ACCEPTANCE SCENARIOS`) is rejected as an error. The fix is to put extra information inside template-allowed sections rather than as new sections.
- **Sandbox-bound report extraction**: When cli-codex agents are dispatched with `--sandbox read-only`, they cannot write to `/tmp` even via `-o` flag for tool-driven file creation; the workaround relies on stdout reasoning trace extraction. This is fragile if codex changes its output format. A more robust approach would be `--sandbox workspace-write` with explicit user approval.
- **No turbo/nx/lerna detection**: Codesight's monorepo support is limited to pnpm-workspace.yaml + package.json workspaces. Any port to Public would need to add the missing manager branches before being usable on real-world tool-specific monorepos.
- **Token-savings claims are heuristic, not measured**: The "tokensSaved" number ships into `CLAUDE.md` is computed from a hand-tuned linear formula with zero tests asserting the constants. Any external claim referencing this number would be marketing, not measurement.
- **Saved-memory quality is uneven**: the newest saved memory carries a `has_topical_mismatch` flag and noisy trigger phrases. Per memory-save rules it was left untouched; the correct cleanup path is to supersede it with a new sanctioned save if retrieval quality becomes a problem.
- **Reducer metrics are not packet totals**: `findings-registry.json` reports 671 reducer-derived snippets, which is useful for observability but not the same thing as the human session total of 95 findings.


<!-- /ANCHOR:limitations -->
