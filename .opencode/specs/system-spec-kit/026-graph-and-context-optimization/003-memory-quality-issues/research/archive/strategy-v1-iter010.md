---
title: Deep Research Strategy — Memory Quality Backend Root Cause
description: Strategy file tracking root cause analysis and remediation for memory quality issues encountered during JSON-mode generation in generate-context.js
---

# Deep Research Strategy — Memory Quality Backend Root Cause

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Identify root causes for 8 distinct defect classes observed across 7 memory files generated via JSON-mode (`--json` flag, `/tmp/save-context-data.json` file mode, `--stdin` mode) in `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`. Propose backend fixes that prevent recurrence.

### Usage

- **Init:** Orchestrator populates Topic, Key Questions, Non-Goals, Stop Conditions
- **Per iteration:** Codex agent reads Next Focus, writes iteration evidence; reducer refreshes machine-owned sections
- **Mutability:** Mutable — analyst sections stable, machine-owned sections rewritten by reducer

<!-- /ANCHOR:overview -->
---

<!-- ANCHOR:topic -->
## 2. TOPIC

Root cause analysis and remediation for memory quality issues encountered during JSON-mode generation in `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`.

**Observed defects (across 7 memory files in `026-graph-and-context-optimization/001-research-graph-context-systems/{001..005}/memory/`):**

| ID | Defect | Severity | Files affected |
|----|--------|----------|----------------|
| D1 | OVERVIEW sections truncated mid-sentence at ~500-600 chars | high | All 7 |
| D2 | Generic decision placeholders ("observation decision 1", "user decision 1") with broken context text | high | F1, F2 |
| D3 | Garbage trigger phrases (word fragments, single words like "kit/026", "graph", "and") | high | F1, F2, F6 |
| D4 | Importance tier mismatch (frontmatter "high" vs YAML metadata "normal") | medium | F1, F2 |
| D5 | Missing causal `supersedes` links between extension runs | medium | F2→F1, F5→F4 |
| D6 | Duplicate trigger phrases (same term twice in array) | low | F7 |
| D7 | Empty git provenance (head_ref, commit_ref, repository_state="unavailable") | low | All 7 |
| D8 | Anchor ID mismatches (`<!-- ANCHOR:summary -->` vs `<a id="overview">`) | cosmetic | All 7 |

<!-- /ANCHOR:topic -->
---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: Where in the generate-context.js pipeline is the OVERVIEW text truncated, and why does it cut mid-sentence at ~500-600 chars (D1)? Which extractor/template populator owns the cut?
- [ ] Q2: Why do decision extraction stages produce generic placeholders ("observation decision 1", "user decision 1") instead of parsing actual decisions from sessionSummary/keyDecisions in the JSON payload (D2)?
- [ ] Q3: What logic generates garbage trigger phrases (word fragments, single-word entries) and how does it bypass any phrase-quality validation (D3)?
- [ ] Q4: Why is there a frontmatter↔YAML metadata block divergence on importance_tier (D4), and which writer wins under what conditions?
- [ ] Q5: What's missing in the JSON-mode pipeline that would let it auto-populate causal supersedes links between extension runs of the same research session (D5)? Does the script have access to prior memory metadata?
- [ ] Q6: How is git provenance supposed to be captured (D7), and why is it failing to record head_ref/commit_ref in JSON-mode runs? Is there an explicit fallback path that swallows errors?
- [ ] Q7: What concrete backend fixes (per defect class) prevent recurrence? Provide a remediation matrix with file:line targets and verification approach.

<!-- /ANCHOR:key-questions -->
---

<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- This research does NOT manually patch the 7 broken memory files (separate workstream)
- Does NOT redesign the entire memory system or anchor schema
- Does NOT investigate OpenCode capture path (the failures are in JSON-mode, not capture-mode)
- Does NOT touch the V8 contamination gate (separate concern; that gate is working as designed)
- Does NOT validate or improve embedding model selection (Voyage-4 is fine)
- Does NOT propose UI/UX changes for `/memory:save` slash command

<!-- /ANCHOR:non-goals -->
---

<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- All 7 key questions answered with file:line citations from generate-context.js source tree
- Convergence: 3-iteration rolling average of newInfoRatio < 0.05 OR question coverage ≥ 0.85
- Max 10 iterations
- Max 180 minutes total
- Stuck threshold: 3 consecutive iterations with newInfoRatio < 0.05 → recovery
- Each defect class D1-D8 mapped to a specific file:function with proposed fix

<!-- /ANCHOR:stop-conditions -->
---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->
---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->
---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->
---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->
---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->
---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Q1: Where in the generate-context.js pipeline is the OVERVIEW text truncated, and why does it cut mid-sentence at ~500-600 chars (D1)? Which extractor/template populator owns the cut?

<!-- /ANCHOR:next-focus -->
---
<!-- MACHINE-OWNED: END -->

<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

**Direct evidence from current session:**

- 7 broken memory files at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/{001-claude-optimization-settings,002-codesight,003-contextador,004-graphify,005-claudest}/memory/`
- All 7 generated via `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` in JSON mode
- All 7 have `_sourceTranscriptPath: ""`, `_sourceSessionId: ""`, `quality_score: 1.00` in frontmatter (suggesting stateless save path)
- Two files (F1, F2) have IDENTICAL generic decision text patterns ("observation decision 1", "user decision 1") strongly indicating template-level fallback when actual decisions can't be extracted
- One file (F6) has trigger phrases including literal path fragments ("kit/026", "graph", "and", "optimization/001", "research", "systems/004", "graphify") suggesting a path-tokenizer leak
- F1 and F2 differ only in iteration count narrative; structure is identical → same template path
- Spec folder health checks report `pass=false` with errors for F3, F6, F7

**Source code locations to investigate:**

- `.opencode/skill/system-spec-kit/scripts/src/memory/generate-context.ts` (TS source)
- `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` (compiled, loaded at runtime)
- `.opencode/skill/system-spec-kit/scripts/src/memory/extractors/*` (decision/topic/trigger extractors)
- `.opencode/skill/system-spec-kit/scripts/src/memory/templates/*` (memory file template)
- `.opencode/skill/system-spec-kit/scripts/src/core/workflow.js` (workflow orchestration, 1349 lines per error trace)
- `.opencode/skill/system-spec-kit/scripts/src/memory/scoring/*` (quality scoring)

**Prior research:** None — this is a fresh investigation of a backend bug.

<!-- /ANCHOR:known-context -->
---

<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 15 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis
- Lifecycle branches: resume, restart, fork, completed-continue
- Machine-owned sections: reducer controls Sections 7-11
- Canonical pause sentinel: research/.deep-research-pause
- **Delegation override:** All 10 iterations dispatched via `cli-codex` `gpt-5.4` `model_reasoning_effort=high` `--full-auto` (`workspace-write` sandbox + `approval_policy=never`). Default `@deep-research` sub-agent is overridden per user request.
- Current generation: 1
- Started: 2026-04-06T18:35:00.000Z

<!-- /ANCHOR:research-boundaries -->
