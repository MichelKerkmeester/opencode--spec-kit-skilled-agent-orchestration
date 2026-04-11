---
title: Interrupted Session Strategy Fixture
description: Crash-recovery fixture with the full machine-owned anchor set required by the deep-research reducer.
---

# Deep Research Strategy - Session Tracking Template

Runtime fixture for validating interrupted-session recovery semantics.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This packet models a research loop that was interrupted during iteration 3 and must resume without trusting partially written artifacts as complete evidence.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Interrupted deep-research recovery fixture

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] What state is safe to trust after an interrupted write?
- [ ] Which artifacts must fail closed?
- [ ] How should resume pick the next focus?

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
Reconstructing lost iteration-3 evidence from memory or inferring findings that were never durably written.

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
Stop once crash-safe resume behavior, lenient escape-hatch boundaries, and partial-artifact handling are all evidenced.

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
[None yet]

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Resume from the last fully durable iteration and verify that corrupted run-3 artifacts are isolated instead of promoted into the registry.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT
Iterations 1 and 2 completed before the crash. Iteration 3 wrote both JSONL and markdown only partially, so the reducer must treat the tail as untrusted until a lenient recovery path is explicitly requested.

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.1
- Per-iteration budget: 6 tool calls, 15 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart`, `fork`, `completed-continue`
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`
- Capability matrix doc: `.opencode/skill/sk-deep-research/references/capability_matrix.md`
- Capability resolver: `.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-04-11T12:00:00Z
<!-- /ANCHOR:research-boundaries -->
