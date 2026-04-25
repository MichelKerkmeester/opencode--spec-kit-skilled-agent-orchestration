You are running iteration 12 of 12 in a deep-research loop on code-graph resilience. This is the final iteration — synthesize iterations 8-11 into an implementation roadmap and emit the implementation-ready spec brief.

# Iteration 12 — Verification Battery Harness + Implementation Roadmap Synthesis

## Goal

1. Design the runtime harness that executes `assets/code-graph-gold-queries.json` against the live `code_graph_query` MCP tool and produces a pass/fail report
2. Synthesize iterations 8-11 into a single implementation roadmap that the next packet (008-code-graph-backend-resilience) can consume directly

## Research Questions
- Q15A: Where should the gold-battery harness live? (new MCP tool `code_graph_verify`? new CLI script? part of scan handler?)
- Q15B: What's the harness execution shape — load JSON, run queries via existing `code_graph_query`, compare vs expected_top_K_symbols, produce pass-rate per category?
- Q15C: How is the harness wired into self-heal (iter 11) and detect_changes (existing block path)?
- Q15D: ROADMAP — produce a sequenced patch landing order (which 008 task lands first, what depends on what)?

## Required reads
1. `research/iterations/iteration-008.md` (content-hash) through `iteration-011.md` (self-healing)
2. `assets/code-graph-gold-queries.json` — the schema you're going to execute
3. `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts` (locate via grep — it's the handler for code_graph_query MCP tool)
4. `.opencode/skill/system-spec-kit/mcp_server/code_graph/index.ts` or wherever MCP tools are registered

## What to look for
- The exact `code_graph_query` MCP tool signature today (input/output shape)
- Where MCP tools are registered (so a new `code_graph_verify` tool fits cleanly)
- How the harness should report partial failures (per-query? aggregate? both?)

## Outputs (MANDATORY)

### 1. Iteration markdown
Path: `research/iterations/iteration-012.md`

Required sections:
- **Summary**
- **Harness Design** (location, signature, execution flow)
- **Wiring Points** (where harness is called from)
- **Per-Iteration Patch Index** (8/9/10/11/12 — cross-reference table of all patch points across iterations)
- **Implementation Roadmap** (ordered task list ready for 008-code-graph-backend-resilience packet — minimum 10 ordered tasks with dependencies)
- **Risk Register** (per-task risk + mitigation)
- **Files Reviewed**
- **Convergence Signals** (final iteration verdict)

### 2. Update synthesis docs
- Append a new section "## Backend Implementation Roadmap" to `research/research.md` linking to iter 12 roadmap
- Append a new "## 2026-04-25 Backend Implementation Decisions" section to `decision-record.md` capturing iter 8-11 decisions

### 3. Delta JSON
Path: `research/deltas/iteration-012.json`. `research_questions_answered: ["Q15A".."Q15D"]`, `iteration: 12`, `focus: "verification harness + implementation roadmap synthesis"`, `verdict: "CONVERGED"`.

### 4. State log append with `iteration: 12`, `status: "complete"`, final convergence signals.

## Constraints
- The roadmap section MUST be implementation-ready — each task names exact file:line + change type (modify/add/extend).
- Minimum 10 distinct file:line citations across iter 12 markdown.
- DO NOT modify the existing assets/ JSON+MD files; only append to research.md + decision-record.md.
