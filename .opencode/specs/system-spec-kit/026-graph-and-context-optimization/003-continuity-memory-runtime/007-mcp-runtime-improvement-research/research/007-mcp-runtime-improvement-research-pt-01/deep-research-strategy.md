---
title: Deep Research Strategy - MCP Runtime Improvement
description: Tracks research progress across 10 iterations investigating MCP runtime defects from 005 and 006.
---

# Deep Research Strategy - MCP Runtime Improvement

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Persistent brain for the 007-mcp-runtime-improvement-research deep research session. Records what to investigate (8 cluster questions), what worked, what failed, and where to focus next. Reducer rewrites machine-owned sections (3, 6, 7-11) after each iteration.

### Usage

- **Init:** Created during initialization with topic, key questions, and known context from sibling 005 + 006 packets.
- **Per iteration:** cli-codex (gpt-5.5 high fast workspace-write) reads Next Focus, writes iteration evidence to iteration-NNN.md, and the reducer refreshes machine-owned sections.
- **Mutability:** Mutable, with machine-owned sections rewritten by the reducer per iteration.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC

MCP runtime improvement research investigating root causes for memory layer, code graph, cocoindex, and intent classifier defects from sibling 005 (memory-search-runtime-bugs catalog of 17 defects + REQ-018/019 candidates) and sibling 006 (search-intelligence-stress-test cross-AI sweep with v1.0.0 + v1.0.1 rubric findings, including a model-side hallucination class on weak retrieval signals).

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [ ] Q1: Why are 005 P0 fixes (Cluster 1, 2, 3) not active in the running daemon? Source patches were claimed as landed but live MCP probes show pre-fix behavior. Is this a missing dist rebuild, daemon restart, or both? What is the canonical fix-and-verify protocol going forward?
- [ ] Q2: How to fix cocoindex mirror-folder duplicates (005 REQ-018)? 10-result responses currently return the same chunk from .gemini/specs/, .claude/specs/, .codex/specs/ mirror copies. Recommend exclude rules or canonical-source-only ranking with confidence tiers.
- [ ] Q3: How to fix cocoindex source-vs-markdown ranking imbalance (005 REQ-019)? Research markdown outranks implementation source on technical queries. Recommend ranking weights or path-class boosting (mcp_server/lib/ wins over .opencode/specs/.../research/).
- [ ] Q4: How to harden against the model-side hallucination class on weak retrieval (006 I2 finding)? When requestQuality:"weak" and recovery.suggestedQueries:[], cli-codex and cli-copilot models fabricate fake spec packets and file paths instead of refusing. Recommend stronger guardrail responses (refuse, require disambiguation, suggest broader queries).
- [ ] Q5: Why does memory_context wrapper truncate to count:0 at 2 percent budget (005 REQ-002)? Direct memory_search returns hits but the wrapper drops to zero on the same query. Identify the truncation logic bug and recommend wrapper fix.
- [ ] Q6: How to recover from empty code-graph (005 REQ-017)? Q1/cli-opencode took 4 min falling back to grep when code-graph returned empty. Recommend warm-start scan, scan-on-empty trigger, or stale-graph repair.
- [ ] Q7: How to address lopsided causal-graph edge growth (005 REQ-010)? 344 supersedes edges added in 15 min while caused/supports edges stayed unchanged. Recommend edge-class balancing, per-class caps, or detection of supersedes-spam.
- [ ] Q8: Intent classifier improvements beyond Cluster 2 fix (005 REQ-001/004/016). Address dual-classifier dissonance, paraphrase stability across cli-opencode/cli-codex/cli-copilot, and cross-CLI consistency findings.

---

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- Implementing any of the discovered fixes (those land in subsequent packets 008+, per orchestrator phase C).
- Modifying mcp_server source code directly (deep-research is read-only investigation).
- Re-running the 006 stress-test sweep (that data is fixed input).
- Adding new investigation surfaces beyond Q1-Q8.
- Investigating skill-graph or doctor-mcp surfaces (out of scope for this packet).

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- Hard cap: 10 iterations.
- Convergence: cross-cutting recommendations stabilize, no new defect clusters surface in last 2 iterations.
- All Q1-Q8 have a documented root cause + remediation strategy + reproducible verification probe.
- Convergence threshold: 0.05 newInfoRatio (3 iter rolling average).
- Stuck threshold: 3 consecutive no-progress iterations triggers recovery.

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

[None yet -- populated as iterations answer questions]

---

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

[First iteration -- populated after iteration 1 completes]

---

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

[First iteration -- populated after iteration 1 completes]

---

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

[Populated when an approach has been tried from multiple angles without success]

---

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

[Populated as iterations definitively eliminate hypotheses]

---

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Iteration 1: Investigate Q1 phantom fix root cause. Check 005 implementation-summary for what was claimed landed, then probe the running MCP daemon to confirm pre-fix vs post-fix behavior. Identify whether dist/ was rebuilt and whether daemon was restarted. Document the canonical fix-and-verify protocol.

---

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

### From sibling 005-memory-search-runtime-bugs

- 17 defects catalogued across 5 clusters (intent classifier, memory_context wrapper, ranking, graph health, channel availability)
- P0 Clusters 1, 2, 3 marked "fixed" in 005 implementation-summary but live MCP probes still show pre-fix behavior
- REQ-018 candidate: cocoindex mirror-folder duplicates
- REQ-019 candidate: cocoindex source-vs-markdown ranking imbalance

### From sibling 006-search-intelligence-stress-test

- 9-scenario corpus (3 features x 3 prompt types) x 4 CLI cells (cli-codex, cli-copilot, cli-opencode, cli-opencode-pure)
- v1.0.0 baseline scores (30 cells)
- v1.0.1 rubric amendment (intent recovery weighting)
- I2 model-side hallucination finding: when requestQuality:"weak" and recovery.suggestedQueries:[], cli-codex and cli-copilot fabricate fake spec packets

### Tooling Available

- cli-codex with gpt-5.5 reasoning_effort=high service_tier=fast sandbox=workspace-write per iteration
- Direct MCP probes: memory_context, memory_search, code_graph_query, advisor_recommend
- File reads: 005 + 006 + mcp_server source

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05 newInfoRatio
- Per-iteration budget: 12 tool calls, 30 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: resume, restart (live)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: research/007-mcp-runtime-improvement-research-pt-01/.deep-research-pause
- Current generation: 1
- Started: 2026-04-27T06:30:04Z
- Executor: cli-codex with gpt-5.5 high fast workspace-write
<!-- /ANCHOR:research-boundaries -->
