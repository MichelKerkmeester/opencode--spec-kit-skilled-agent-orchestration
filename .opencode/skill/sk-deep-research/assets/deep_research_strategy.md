---
title: Deep Research Strategy Template
description: Runtime template copied to research/ during initialization to track research progress, focus decisions, and outcomes across iterations.
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `{spec_folder}/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

---

## 2. TOPIC
[Research topic from config -- set during initialization]

---

## 3. KEY QUESTIONS (remaining)
- [ ] [Question 1 -- identified during initialization or iteration 1]
- [ ] [Question 2]
- [ ] [Question 3]

---

## 4. NON-GOALS
[What this research session is NOT trying to answer -- populated during initialization]

---

## 5. STOP CONDITIONS
[Explicit conditions beyond convergence that should end the session -- populated during initialization]

---

## 6. ANSWERED QUESTIONS
[None yet -- populated as iterations answer questions]

---

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it worked] (iteration N)

---

## 8. WHAT FAILED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it failed] (iteration N)

---

## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach has been tried from multiple angles without success]

### [Category Name] -- BLOCKED (iteration N, N attempts)
- What was tried: [specific approaches attempted]
- Why blocked: [root cause of exhaustion]
- Do NOT retry: [explicit prohibition]

### [Category Name] -- PRODUCTIVE (iteration N)
- What worked: [successful approaches in this category]
- Prefer for: [related questions where this category may help]

---

## 10. RULED OUT DIRECTIONS
[Approaches that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])

---

## 11. NEXT FOCUS
[Recommended focus area for the next iteration -- updated at end of each iteration]

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
[Populated during initialization from memory_context() results, if any prior work exists]

---

## 13. RESEARCH BOUNDARIES
- Max iterations: [from config]
- Convergence threshold: [from config]
- Per-iteration budget: [from config.maxToolCallsPerIteration] tool calls, [from config.maxMinutesPerIteration] minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`
- Capability matrix doc: `.opencode/skill/sk-deep-research/references/capability_matrix.md`
- Capability resolver: `.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs`
- Current generation: [from config.lineage.generation]
- Started: [timestamp]
