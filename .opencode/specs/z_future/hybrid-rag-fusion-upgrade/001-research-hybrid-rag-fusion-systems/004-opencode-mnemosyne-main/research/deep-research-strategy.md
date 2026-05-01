---
title: Deep Research Strategy - OpenCode Mnemosyne
description: Reducer-tracked strategy for the 004-opencode-mnemosyne-main hybrid-rag-fusion research packet.
---

# Deep Research Strategy - OpenCode Mnemosyne

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Track the 40-iteration OpenCode Mnemosyne deep research lineage in reducer-compatible format. Research is complete; this file records the final strategy state.

### Usage

- All 40 iterations completed via cli-codex orchestrator (GPT-5.4 high, fast tier)
- Copilot GPT-5.4 high as fallback after 3 consecutive codex failures
- Iterations stored at research/iterations/iteration-NNN.md
- Canonical synthesis at research/research.md

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Research OpenCode Mnemosyne's hybrid FTS5+vector search via Reciprocal Rank Fusion, OpenCode plugin architecture, and compaction survival hook to identify concrete improvements for Spec Kit Memory.

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: How does the plugin wrap the Go Mnemosyne binary via src/index.ts?
- [ ] Q2: How does RRF combine BM25 FTS5 with vector cosine similarity?
- [ ] Q3: What does the experimental.session.compacting hook inject into compaction?
- [ ] Q4: How does scope initialization work (project vs global memory)?
- [ ] Q5: What does the snowflake-arctic-embed-m-v1.5 model add to retrieval?
- [ ] Q6: How is tool registration handled for MCP exposure?
- [ ] Q7: What compaction survival strategies does this system use?
- [ ] Q8: Can we adopt hybrid retrieval without adopting the plugin wrapper?
- [ ] Q9: How does it handle first-use model download UX?
- [ ] Q10: Which OpenCode plugin patterns generalize to our ecosystem?

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- Reimplementing OpenCode Mnemosyne wholesale in our memory system
- Replacing our existing CocoIndex, code-graph, or Spec Kit Memory stack
- Making architectural changes without explicit adoption decisions

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- 40 iterations completed (reached)
- All 10 key questions answered at least once (reached)
- Definitive final report produced (iteration 40)

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
### [approaches eliminated and why] -- BLOCKED (iteration 40, 10 attempts)
- What was tried: [approaches eliminated and why]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: [approaches eliminated and why]

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- [approaches eliminated and why] (iteration 31)
- [approaches eliminated and why] (iteration 32)
- [approaches eliminated and why] (iteration 33)
- [approaches eliminated and why] (iteration 34)
- [approaches eliminated and why] (iteration 35)
- [approaches eliminated and why] (iteration 36)
- [approaches eliminated and why] (iteration 37)
- [approaches eliminated and why] (iteration 38)
- [approaches eliminated and why] (iteration 39)
- [approaches eliminated and why] (iteration 40)

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[What to investigate next] ACCUMULATED FINDINGS SUMMARY: but more resilient retrieval lifecycle.` - Validation: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict` returned `RESULT: PASSED` with `Errors: 0 Warnings: 0`; it also emitted the known read-only warning `cannot create temp file for here document: Operation not permitted`.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT
Spec Kit Memory stack: memory_search, memory_context, memory_match_triggers, causal links, generate-context.js, CocoIndex semantic search, code-graph structural queries.

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES
- Max iterations: 40 (reached)
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: resume, restart, fork, completed-continue
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: research/.deep-research-pause
- Current generation: 1
- Started: 2026-04-10T19:19:00Z
- Completed: 2026-04-11T02:20:00Z
<!-- /ANCHOR:research-boundaries -->
