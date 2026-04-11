---
title: Deep Research Strategy - Relay
description: Reducer-tracked strategy for the 007-relay-main agentic-system research packet.
---

# Deep Research Strategy - Relay

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Track the 30-iteration Relay deep research lineage in reducer-compatible format. Research is complete; this file records the final strategy state after backfill.

### Usage

- All 30 iterations completed via the agentic-system-upgrade research loop
- Original state.jsonl and dashboard.md (custom format) archived to research/archive/legacy-research-log/
- Iterations stored at research/iterations/iteration-NNN.md
- Canonical synthesis at research/research.md

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Research Relay's channel-based messaging and multi-LLM coordination patterns to identify improvements for Code_Environment/Public's inter-agent communication, especially around realtime coordination, message routing, delivery semantics, event callbacks, ready-state synchronization, and multi-provider agent spawning.

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: Ready-State Handshake
- [ ] Q2: Callback Contract
- [ ] Q3: Channel, DM, Thread Semantics
- [ ] Q4: Workspace-Scoped Delivery
- [ ] Q5: Provider-First Spawn Ergonomics
- [ ] Q6: Coordination Mode Taxonomy
- [ ] Q7: Evidence-Based Completion
- [ ] Q8: Delivery and Idle States
- [ ] Q9: Cross-Runtime Parity
- [ ] Q10: Do Not Replace Task Orchestration

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- Wholesale adoption of Relay's architecture
- Replacing existing Spec Kit Memory, CocoIndex, or code-graph stack
- Making architectural changes without explicit adoption decisions per the adopt-now / prototype-later / reject taxonomy

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- 30 iterations completed (reached)
- All key questions investigated with evidence-backed conclusions (reached)
- Final synthesis report produced (iteration 30)

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
Q1: Ready-State Handshake

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT
Code_Environment/Public agent stack: orchestrate, deep-research, deep-review, context, general agents; spec_kit workflow; system-spec-kit skill; memory system with trigger-based recall, semantic search, causal links; CocoIndex; code-graph.

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES
- Max iterations: 30 (reached)
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: resume, restart, fork, completed-continue
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: research/.deep-research-pause
- Current generation: 1
- Started: 2026-04-09T21:20:00Z
- Completed: 2026-04-10T08:20:00Z
<!-- /ANCHOR:research-boundaries -->
