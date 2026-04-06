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
## 3. KEY QUESTIONS (remaining)
- [ ] Q1. How does the AST extraction pipeline really work in `external/src/index.ts` -> detectors -> `src/ast/loader.ts`, and how often do detectors fall back to regex or structured parsing?
- [ ] Q2. Which frameworks listed in `src/types.ts` actually receive AST-backed route extraction in `src/detectors/routes.ts` + `src/ast/extract-routes.ts`, versus regex-only or shallow detection?
- [ ] Q3. How does one full detector pipeline (Hono or NestJS) work end to end: dependency heuristic, file filtering, AST walk, prefix tracking, param + middleware extraction, contract enrichment?
- [ ] Q4. How are ORM schemas parsed across Drizzle, Prisma, TypeORM, SQLAlchemy, and GORM in `src/detectors/schema.ts` + `src/ast/extract-schema.ts`, and where is each path AST-backed vs regex vs structured-file parsing?
- [ ] Q5. What does the zero-dependency claim really mean in practice: how does `src/ast/loader.ts` borrow project-local TypeScript, what fallbacks fire when it is missing, and what are the operational tradeoffs?
- [ ] Q6. What exact 8 MCP tools does `src/mcp-server.ts` expose, how does it manage session-cached scan state, and how does that compare with `Code_Environment/Public`'s existing MCP and search surfaces (Spec Kit Memory, Code Graph, CocoIndex)?
- [ ] Q7. How does `src/detectors/blast-radius.ts` work internally: how is the import graph built in `src/detectors/graph.ts`, how does reverse BFS traverse it, and where are model-impact and middleware overlays heuristic rather than exact?
- [ ] Q8. How does `src/generators/ai-config.ts` differentiate per-tool profiles for Claude Code, Cursor, Codex, Copilot, and Windsurf, and which patterns are transferable to Public's AI-assistant guidance files?
- [ ] Q9. What is the role of dependency-graph hot-file ranking as a "change carefully" surface, and could a similar capability complement Code Graph MCP and CocoIndex in Public?
- [ ] Q10. How well do `src/eval.ts`, `eval/README.md`, `eval/fixtures/`, and `tests/detectors.test.ts` actually validate the README's headline claims (token savings, detector coverage, blast radius), and where does the README overreach the fixture set?
- [ ] Q11. What architectural value comes from separating static `.codesight/` artifacts from query-time MCP tools, and how should that boundary inform Public's own context-system design?
- [ ] Q12. Which Codesight ideas overlap dangerously with phases 003 (contextador) and 004 (graphify), and which are uniquely scoped to phase 002 because they center on AST detector design and per-tool context generation?

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
[None yet]

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
Q1. How does the AST extraction pipeline really work in `external/src/index.ts` -> detectors -> `src/ast/loader.ts`, and how often do detectors fall back to regex or structured parsing?

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
