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
None. The reopened packet reached 20 total iterations and closed all tracked research questions:

- Q1-Q12: original charter on execution flow, route/schema extraction, MCP tools, profiles, benchmark claims, and cross-phase boundaries
- Q13-Q17: first continuation on contracts, Python/Go parity, token stats, monorepo/config/plugins, and components/telemetry
- Q18-Q27: completed-continue extension on watch/hook automation, middleware/libs/config detectors, formatter lifecycle, MCP cache/error semantics, AI-config write safety, HTML projection, scanner heuristics, and final adoption synthesis

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
- All tracked key questions are answered with source-cited evidence in `iterations/`.
- At least 5 evidence-backed findings exist with explicit `adopt now | prototype later | reject` recommendations and concrete impact statements for `Code_Environment/Public`.
- Cross-phase overlap between 002 / 003 / 004 is bounded explicitly in synthesis.
- Composite convergence score >= 0.60 OR rolling avg(newInfoRatio, 3) < 0.05 OR question coverage >= 0.85.
- Stuck count >= 3 consecutive iterations with no new findings → recovery, then forced synthesis if recovery fails.

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1-Q12 answered by iterations 1-5 and the initial synthesis.
- Q13-Q17 answered by iterations 6-10 and the first continuation synthesis.
- Q18-Q27 answered by iterations 11-20 and the final generation-2 closeout.
- Canonical evidence lives in `research/research.md`; use the packet docs, not the saved-memory snapshots, as the source of truth when they disagree.

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
No new research focus. The packet is ready for reducer refresh, synthesis update, memory save, and a follow-on planning/implementation phase if the parent 026 packet decides to operationalize the adopt-now patterns.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT
- Memory query for "codesight AST detector framework ORM analysis MCP tool profile generation blast radius" returned **no prior memories** for this topic; evidence gap detected (Z=0.00). Treat the session as a fresh investigation.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/phase-research-prompt.md` is the authoritative TIDD-EC contract for this phase: it forbids edits under `external/`, mandates source-before-README reading order, and pre-approves the phase folder so Gate 3 is skipped.
- Cross-phase context: phase 001 = Reddit narrative (no code), phase 003 = contextador self-healing query interface, phase 004 = graphify NetworkX + Leiden + EXTRACTED/INFERRED tags, phase 005 = claudest plugin marketplace. Findings here must avoid duplicating 003 (MCP query) and 004 (knowledge graph) terrain.
- `Code_Environment/Public` already has CocoIndex semantic search, Code Graph MCP for structural queries, Spec Kit Memory for context preservation, and `validate.sh` for spec validation. It lacks Codesight-style automated `CLAUDE.md` / `.cursorrules` / `codex.md` / `AGENTS.md` generation, per-tool profile generation, and a blast-radius command built around reverse import-graph BFS.
- The first continuation (iters 6-10) updated `research/research.md` and iteration files but left packet metadata and reducer-owned views partially stale. The second continuation should treat `completed-continue` lineage and reducer refresh as first-class closeout work.
- Delegation policy for this session: iterations 1-10 were dispatched via `codex exec --model gpt-5.4 -c model_reasoning_effort="high" --sandbox read-only` per the original user request. Iterations 11-20 are executed directly in the active Codex session because self-invoking `cli-codex` from Codex would be circular; the same source-tracing and citation standards still apply.

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES
- Max iterations: 20
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
- Current generation: 2
- Started: 2026-04-06T09:58:51Z
- Reopened: 2026-04-08T07:02:03Z via `completed-continue`
- Delegation: iterations 1-10 via cli-codex (gpt-5.4 + reasoning_effort=high, sandbox=read-only); iterations 11-20 via direct Codex execution in the active session
<!-- /ANCHOR:research-boundaries -->
