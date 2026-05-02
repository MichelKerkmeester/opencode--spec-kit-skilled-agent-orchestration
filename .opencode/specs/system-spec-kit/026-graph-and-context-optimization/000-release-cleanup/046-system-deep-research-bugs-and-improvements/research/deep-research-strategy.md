# Deep-Research Strategy: System Bugs and Improvements (20 iterations)

**Topic**: Systematic 20-iteration deep research across `system-spec-kit`, `mcp_server`, `code_graph`, and `skill_advisor` to surface latent production bugs, miswired automation, refinement opportunities, and architectural shortcuts.

**Executor**: `cli-codex` `gpt-5.5` reasoning=`high` service-tier=`null` (normal speed)
**Iterations**: 20 (one per pre-defined angle)
**Convergence threshold**: 0.01 (very low — run all 20 unless near-duplicate findings)

---

## Iteration ↔ Angle Map

Each iteration N targets one pre-defined research angle. The mapping is fixed at scaffold time so the workflow runs an exhaustive sweep, not an emergent search.

### Category A — Production Code Bugs

- **Iter 001 / A1** — Daemon concurrency edge cases (`mcp_server/skill_advisor/lib/daemon/`, `lib/freshness/`)
- **Iter 002 / A2** — Code-graph SQLite contention (`mcp_server/code_graph/`)
- **Iter 003 / A3** — Resource leaks (FD/memory/subprocess) across `mcp_server/`
- **Iter 004 / A4** — Silent error recovery patterns (try/catch audit) across `mcp_server/skill_advisor/lib/` and `mcp_server/code_graph/lib/`
- **Iter 005 / A5** — Schema validation gaps (zod/JSON.parse/path traversal)

### Category B — Wiring / Automation Bugs

- **Iter 006 / B1** — Hook contract drift across runtimes (Claude/Copilot/Gemini/Codex/OpenCode)
- **Iter 007 / B2** — CLI orchestrator skill correctness (`.opencode/skill/cli-codex/`, `cli-copilot/`, `cli-gemini/`, `cli-claude-code/`, `cli-opencode/`)
- **Iter 008 / B3** — Memory MCP round-trip integrity (`memory_save → memory_index_scan → memory_search → memory_context`)
- **Iter 009 / B4** — Spec-kit validator correctness (`scripts/spec/validate.sh`, `scripts/rules/`)
- **Iter 010 / B5** — Workflow command auto-routing (`.opencode/command/spec_kit/`)

### Category C — Refinement / Improvement Opportunities

- **Iter 011 / C1** — Search-quality W3-W13 latency and accuracy (`mcp_server/stress_test/search-quality/`)
- **Iter 012 / C2** — Scorer fusion accuracy on edge cases (`mcp_server/skill_advisor/lib/scorer/`)
- **Iter 013 / C3** — Skill advisor recommendation quality (regression cases + live captures)
- **Iter 014 / C4** — Code-graph staleness detection accuracy (`code_graph/lib/`, `doctor:code-graph`)
- **Iter 015 / C5** — Test suite reliability and flake patterns

### Category D — Architecture / File Organization Opportunities

- **Iter 016 / D1** — `mcp_server/lib/` boundary discipline (freshness/derived/lifecycle/scorer/daemon/corpus/handlers)
- **Iter 017 / D2** — Module dependency graph health (circular imports, dead exports, hot-spot modules)
- **Iter 018 / D3** — Type / schema duplication across `mcp_server/`
- **Iter 019 / D4** — Spec-kit folder topology sustainability (`.opencode/specs/system-spec-kit/` depth and naming)
- **Iter 020 / D5** — Build / dist / runtime separation

---

## Key Questions (machine-owned)

<!-- Reducer manages this section. Initial seed below; reducer updates as iterations progress. -->

1. Which production-code paths have race conditions or silent error recovery that masks real failures?
2. Where does automation wiring drift between runtimes or contradict its documented contract?
3. Which subsystems have measurable refinement opportunities (search precision, scorer accuracy, advisor hit rate)?
4. Which folder/module boundaries have eroded over time and warrant restructuring?
5. Are there cross-cutting type/schema duplications that should be unified?

## Known Context

Prior packets 042-045 closed the documented stress-coverage backlog and known drift findings. The next risk layer is unknowns. This research charter pre-defines 20 angles and dispatches one cli-codex iteration per angle.

Resource map: not present at init (will be emitted at synthesis).

## Method

Each iteration:
1. Reads the relevant subsystem code with file:line precision (cocoindex search + direct reads).
2. Classifies findings as P0 / P1 / P2 / none with evidence.
3. Writes a markdown narrative at `iterations/iteration-NNN.md` (Focus, Actions, Findings table with Priority column, Questions Answered, Questions Remaining, Next Focus).
4. Appends a `{"type":"iteration","iteration":N,...}` record to `deep-research-state.jsonl`.
5. Writes a per-iteration JSONL delta at `deltas/iter-NNN.jsonl` containing the iteration record plus per-event records (one per finding/observation/edge).

## Convergence

Threshold: 0.01. Will run all 20 iterations unless findings cross multiple angles produce near-duplicate output, in which case convergence may fire early. Synthesis follows the loop with `research.md` (17-section format) and `resource-map.md`.
