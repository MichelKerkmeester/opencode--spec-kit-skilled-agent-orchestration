---
title: Deep Research Strategy - 002-codesight
description: Persistent brain for the 002-codesight deep-research session. Tracks topic, key questions, ruled-out directions, and next focus across iterations.
---

# Deep Research Strategy - 002-codesight

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose
Persistent brain for the 002-codesight deep-research loop. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and the @deep-research / cli-codex iteration engine at every iteration.

### Usage
- **Init:** Orchestrator copied this template, populated Topic, Key Questions, Non-Goals, Stop Conditions, Known Context, and Research Boundaries from `phase-research-prompt.md` and from the cli-codex delegation policy.
- **Per iteration:** Codex (gpt-5.4 high) reads Next Focus, the orchestrator captures evidence into `iterations/iteration-NNN.md`, the reducer refreshes machine-owned sections.
- **Mutability:** Mutable. Analyst-owned sections remain stable; sections 7-11 are reducer-owned.
- **Protection:** Shared state with explicit ownership. Orchestrator validates consistency on resume.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/external and identify concrete improvements for Code_Environment/Public, especially around AST-based codebase analysis, framework/ORM detector architecture, AI-assistant context file generation, MCP tool design, and per-tool config profile patterns.

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS — ALL 17 ANSWERED (10/10 iterations complete)

### Original Charter (Iterations 1-5)
- [x] Q1. AST extraction pipeline + ast/loader.ts fallback frequency — answered iter 1
- [x] Q2. Which frameworks get true AST route extraction vs regex — answered iter 2
- [x] Q3. End-to-end Hono/NestJS detector pipeline — answered iter 2
- [x] Q4. ORM schemas across Drizzle/Prisma/TypeORM/SQLAlchemy/GORM — answered iter 2 + reconfirmed iter 5 (Drizzle index extraction absent)
- [x] Q5. Zero-dependency claim operational reality — answered iter 1
- [x] Q6. Exact 8 MCP tools + session-cached scan state — answered iter 3
- [x] Q7. blast-radius.ts internals + reverse BFS + model overlay heuristics — answered iter 3 (off-by-one in depth cap discovered)
- [x] Q8. Per-tool profile differentiation in ai-config.ts — answered iter 4
- [x] Q9. Hot-file ranking as "change carefully" surface — answered iter 3
- [x] Q10. eval.ts and tests vs README headline claims — answered iter 4 (11.2x is README-only)
- [x] Q11. Static `.codesight/` artifacts vs query-time MCP boundary — answered iter 5
- [x] Q12. Cross-phase overlap with 003-contextador and 004-graphify — answered iter 5

### Continuation Charter (Iterations 6-10)
- [x] Q13 (iter 6). enrichRouteContracts + contracts.ts: regex-only post-detection mutator, Hono-biased, tRPC has zero enrichment despite AST routes, silent no-ops, untested
- [x] Q14 (iter 7). Python uses real subprocess `python3 -c "ast.parse(...)"` but FastAPI misses prefix composition + decorator metadata. Go uses brace-tracking + regex with NO `go/parser` but mislabels output as `"ast"`. SQLAlchemy is richer than Drizzle (has index extraction). GORM over-admits.
- [x] Q15 (iter 8). tokens.ts uses `Math.ceil(text.length/4)` + hand-tuned linear formula `(routes*400 + schemas*300 + components*250 + libs*200 + envVars*100 + middleware*200 + hotFiles*150 + min(fileCount,50)*80) * 1.3`. Zero token-math tests. Unrounded number ships into CLAUDE.md while CODESIGHT.md uses roundTo100.
- [x] Q16 (iter 9). Config: `codesight.config.{ts,js,mjs,json}` + `package.json codesight` field; NO `.codesightrc` support. Only maxDepth/outputDir/profile merge from CLI to config. Monorepo: pnpm-workspace.yaml + pkg.workspaces only; NO turbo/nx/lerna detection. Plugin contract real but untested in-tree.
- [x] Q17 (iter 10). Components: shallow, React-biased; only React/Vue/Svelte; no Solid/Qwik. Telemetry: local opt-in via `--telemetry`, NO HTTP, NO identity, NO postinstall, NOT an adoption blocker. 17-row cumulative risk inventory produced.

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- HTML report styling and presentational dashboard polish.
- npm publishing workflow, semver, or release engineering details.
- Generic TypeScript style commentary unrelated to AST detector design.
- Phase 003 self-healing query interface analysis (covered by `003-contextador`).
- Phase 004 graph visualization, NetworkX/Leiden community detection, or evidence-tagging analysis (covered by `004-graphify`).
- Re-creating CocoIndex semantic search, Code Graph MCP structural queries, or Spec Kit Memory in Public.

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- All 12 key questions are answered with source-cited evidence in `iterations/`.
- At least 5 evidence-backed findings exist with explicit `adopt now | prototype later | reject` recommendations and concrete impact statements for `Code_Environment/Public`.
- Cross-phase overlap between 002 / 003 / 004 is bounded explicitly in synthesis.
- Composite convergence score >= 0.60 OR rolling avg(newInfoRatio, 3) < 0.05 OR question coverage >= 0.85.
- Stuck count >= 3 consecutive iterations with no new findings → recovery, then forced synthesis if recovery fails.

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1, Q5 (iter 1): index.ts pipeline + zero-dep loader confirmed; AST loads project-local typescript, regex fallback explicit.
- Q2, Q3, Q4 (iter 2): Hono + NestJS routes traced AST-first with prefix tracking; Drizzle parseFieldChain confirmed; partial ORM coverage mapped.
- Q6, Q7, Q9 (iter 3): 8 MCP tools enumerated; reverse-import BFS internals + depth-cap off-by-one bug + heuristic schema overlay; hot-file ranking is degree-counting only.
- Q8, Q10 (iter 4): per-tool profile overlays meaningful per Claude/Cursor/Codex/Copilot/Windsurf; eval.ts is real F1 harness but 11.2x token claim is README-only and not in fixtures.
- Q11, Q12, Q4-confirmed (iter 5): static `.codesight/` and MCP both project the same `ScanResult`; cross-phase boundaries explicit (002 owns AST detectors + profile gen + static artifacts; 003 owns query MCP; 004 owns graph math).
- Q13 (iter 6): enrichRouteContracts is regex-only post-detection mutator; Hono-biased; tRPC ignored; silent no-ops; untested.
- Q14 (iter 7): Python uses real subprocess AST; Go uses brace+regex but mislabels as "ast"; SQLAlchemy richer than Drizzle.
- Q15 (iter 8): tokens.ts is `chars/4` + hand-tuned linear formula × 1.3; zero tests; presentation inconsistency.
- Q16 (iter 9): Config = `codesight.config.{ts,js,mjs,json}` + pkg.codesight; NO dotfile; monorepo = pnpm/pkg.workspaces only; plugins typed but untested.
- Q17 (iter 10): Components shallow + React-biased; telemetry is local opt-in NOT phone-home (low risk); 17-row cumulative risk inventory.

**Total session:** 10/10 iterations complete, 17/17 questions answered, 52 source-confirmed findings, stop reason `all_continuation_questions_answered`.

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT
- Memory query for "codesight AST detector framework ORM analysis MCP tool profile generation blast radius" returned **no prior memories** for this topic; evidence gap detected (Z=0.00). Treat the session as a fresh investigation.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/phase-research-prompt.md` is the authoritative TIDD-EC contract for this phase: it forbids edits under `external/`, mandates source-before-README reading order, and pre-approves the phase folder so Gate 3 is skipped.
- Cross-phase context: phase 001 = Reddit narrative (no code), phase 003 = contextador self-healing query interface, phase 004 = graphify NetworkX + Leiden + EXTRACTED/INFERRED tags, phase 005 = claudest plugin marketplace. Findings here must avoid duplicating 003 (MCP query) and 004 (knowledge graph) terrain.
- `Code_Environment/Public` already has CocoIndex semantic search, Code Graph MCP for structural queries, Spec Kit Memory for context preservation, and `validate.sh` for spec validation. It lacks Codesight-style automated `CLAUDE.md` / `.cursorrules` / `codex.md` / `AGENTS.md` generation, per-tool profile generation, and a blast-radius command built around reverse import-graph BFS.
- Delegation policy for this session: every iteration is dispatched via `codex exec --model gpt-5.4 -c model_reasoning_effort="high" --sandbox read-only` per the user's request. The orchestrator (Claude Opus 4.6) writes iteration files and updates state.

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart`, `fork`, `completed-continue`
- Machine-owned sections: reducer controls Sections 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`
- Capability matrix doc: `.opencode/skill/sk-deep-research/references/capability_matrix.md`
- Capability resolver: `.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-04-06T09:58:51Z
- Delegation: cli-codex (gpt-5.4 + reasoning_effort=high, sandbox=read-only)
<!-- /ANCHOR:research-boundaries -->
