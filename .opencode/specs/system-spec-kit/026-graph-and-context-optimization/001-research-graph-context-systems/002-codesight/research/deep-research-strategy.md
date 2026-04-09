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
Translate the completed cross-phase research across `002-codesight`, `003-contextador`, `004-graphify`, and `005-claudest` into a concrete code graph upgrade roadmap for Public's Code Graph MCP: gap analysis, cost/benefit/risk scoring, and a packet-ready proposal that can be inserted into the 026 DAG without duplicating packet `008` or `011`.

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
[None yet]

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- Re-auditing iterations 1-20 of `002-codesight` or re-deriving the 22-row §18.3 matrix.
- Editing anything under any `external/` tree or touching sibling phase docs.
- Verifying proposals against Public's live Code Graph MCP source in this research phase.
- AI-config/profile generation, memory-quality work, warm-start bundle work, or detector-regression-floor implementation tasks already owned elsewhere in 026.
- Recommending any graph-router subsystem that duplicates packet `008` or any trust-validator work that duplicates packet `011`.

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- Iterations 21-35 land with exact sibling-packet citations and explicit evidence-type labels.
- `research/research.md` gains a new top-level charter section with gap analysis, a 15-20 row decision matrix, packet skeleton, acceptance criteria, risk matrix, DAG notes, and explicit non-overlap with `008` and `011`.
- The upgrade list distinguishes `adopt now`, `prototype later`, and `reject or defer` candidates against Public's existing 026 DAG.
- A final lifecycle event closes the new segment with `completed_continue_segment_end` and `iterationsCompleted=35`.
- Strict validation passes with no blocking errors after reducer refresh and memory save.

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
None. The code-graph-upgrade charter is complete and ready for packet creation follow-on work.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT
- This segment is deliberately additive to the existing packet. Section 18.3 remains the canonical CodeSight adopt/prototype/reject matrix; section 20 extends it into a cross-phase roadmap instead of replacing it.
- The primary evidence sources are sibling packet syntheses and iteration files under `003-contextador`, `004-graphify`, and `005-claudest`, plus the parent 026 spec, parent recommendations, and the scoped specs for packets `008` and `011`.
- Packet `008` owns advisory graph-first nudges on existing startup, resume, compact, and response surfaces; packet `011` owns fail-closed validation and preservation of provenance, evidence, and freshness fields. Any candidate that recreates either scope must be explicitly deferred.
- The strongest surviving code-graph-shaped candidates entering this segment are: AST-first/structured-fallback detector discipline, honest degree-based hot-file breadcrumbs, blast-radius BFS hardening, evidence-tagged edges, provenance metadata, additive clustering metadata, and graph query fallback tiering.
- The strongest surviving non-owners from sibling research are runtime ergonomics and cache/reuse patterns, not subsystem replacement: `routeQuery()`-style routing facades, bounded feedback-driven repair, Mainframe-like reuse, graph-first hook nudges, and capability-cascade fallbacks.
- Generation-3 execution runs directly in the active Codex session with workspace-write scoped to this packet because self-delegation remains circular and the charter requires packet-local writes only.

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES
- Max iterations: 35
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
- Current generation: 3
- Started: 2026-04-06T09:58:51Z
- Reopened: 2026-04-08T07:02:03Z via `completed-continue`
- Reopened again: 2026-04-09T06:58:00Z via `completed-continue`
- Delegation: iterations 1-10 via cli-codex (gpt-5.4 + reasoning_effort=high, sandbox=read-only); iterations 11-35 via direct Codex execution in the active session
<!-- /ANCHOR:research-boundaries -->
