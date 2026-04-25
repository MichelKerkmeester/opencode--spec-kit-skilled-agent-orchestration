---
title: "Deep Research Strategy: GitNexus Cross-Check (pt-02)"
description: "Workflow-owned strategy for the 007-git-nexus-pt-02 deep-research loop — independent cross-check vs pt-01 using cli-codex gpt-5.5 high fast."
---

# Deep Research Strategy — GitNexus Cross-Check (pt-02)

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This file is the persistent strategy surface for the `/spec_kit:deep-research:auto` packet `007-git-nexus-pt-02`. Each iteration is dispatched via `cli-codex` (gpt-5.5, reasoning=high, service_tier=fast, sandbox=workspace-write). The packet is an INDEPENDENT cross-check sibling to `007-git-nexus-pt-01` (which used a mixed Opus + cli-codex executor mix). Iterations 1-9 MUST NOT read pt-01 artifacts; iteration 10 MAY compare against pt-01 only after independent synthesis is complete.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:topic -->
## 2. TOPIC

Research the downloaded GitNexus project under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-git-nexus/external/` for patterns to adopt, adapt, reject, or defer for Public's Code Graph package, Spec Kit Memory causal graph, and Skill Graph / Skill Advisor surfaces. Ground every claim in exact source citations (file:line). Do NOT modify `external/` or any Public implementation files. Produce a final Adopt/Adapt/Reject/Defer matrix, per-system recommendations, ownership boundaries, risks, and follow-up implementation packet proposals.
<!-- /ANCHOR:topic -->

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] RQ1: What GitNexus ingestion, graph schema, process-flow, and query/context patterns are portable to Public's Code Graph package?
- [ ] RQ2: Which GitNexus impact, detect-changes, rename, route-map, tool-map, shape-check, or group-contract mechanisms are worth adapting for graph safety?
- [ ] RQ3: Which GitNexus concepts can improve Spec Kit Memory's causal graph without turning memory into a duplicate code index?
- [ ] RQ4: Which GitNexus tool/resource/agent affordances can inform Skill Graph or Skill Advisor routing evidence?
- [ ] RQ5: What should be adopted, adapted, rejected, or deferred, and what follow-up implementation packets should be created?

<!-- /ANCHOR:key-questions -->

<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- Do not implement changes to Public graph, memory, or skill systems in this packet.
- Do not modify GitNexus source under `external/`.
- Do not treat README claims as sufficient evidence without source or test confirmation.
- Do not recommend copying source code where architectural adaptation is enough.
- **Anchoring guard:** Do not read `research/007-git-nexus-pt-01/` artifacts during iterations 1-9. Iteration 10 MAY compare findings only after independent synthesis is complete.
<!-- /ANCHOR:non-goals -->

<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- Stop after 10 iterations (fixed run as user-requested).
- Stop earlier only if every key question has strong source-backed answers AND quality guards pass.
- Escalate rather than continue if state becomes invalid or iteration artifacts cannot be validated.
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
RQ1: What GitNexus ingestion, graph schema, process-flow, and query/context patterns are portable to Public's Code Graph package?

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

### Public systems under cross-check
- Public Code Graph — SQLite schema (`code_files`, `code_nodes`, `code_edges`) at `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts`; AST detector via `tree-sitter-parser.ts`; structural-indexer at `code-graph/lib/structural-indexer.ts`; query/context/status handlers at `code-graph/handlers/`.
- Spec Kit Memory causal graph — typed relations + bounded traversal at `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`, recursive CTE causal boost at `lib/search/causal-boost.ts`.
- Skill Graph / Skill Advisor — compiler at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py`; graph-causal scoring lane at `skill-advisor/lib/scorer/lanes/graph-causal.ts`; fusion at `skill-advisor/lib/scorer/fusion.ts`.

### GitNexus tree (target for research)
- Located at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-git-nexus/external/`
- Top-level entrypoints: `external/ARCHITECTURE.md`, `external/gitnexus/src/core/`, `external/gitnexus/src/mcp/`, `external/gitnexus-shared/`

### Sibling packet (DO NOT READ during iterations 1-9)
- `research/007-git-nexus-pt-01/` exists with status:complete. Independent cross-check guard MUST hold.

<!-- /ANCHOR:known-context -->

<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output (lives under pt-02/)
- Lifecycle branches: `new` (live for this packet); `resume`, `restart` available; `fork`, `completed-continue` deferred
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/007-git-nexus-pt-02/.deep-research-pause`
- Capability matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`
- Capability resolver: `.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-04-25T08:56:40Z
- Executor: cli-codex / model=gpt-5.5 / reasoning=high / service_tier=fast / sandbox=workspace-write / timeoutSeconds=900
- **Anchoring guard:** Iterations 1-9 MUST NOT read `research/007-git-nexus-pt-01/` artifacts. Iteration 10 MAY compare only after independent synthesis is complete.
<!-- /ANCHOR:research-boundaries -->
