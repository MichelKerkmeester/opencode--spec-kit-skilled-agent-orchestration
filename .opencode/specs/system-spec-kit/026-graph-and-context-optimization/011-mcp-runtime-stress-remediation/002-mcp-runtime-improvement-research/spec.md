---
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
title: "Feature Specification [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/spec]"
description: "10-iteration deep research packet investigating root causes and remediation for MCP server, memory layer, code graph, and back-end defects surfaced by 005 (17 defects + REQ-018/019 candidates) and 006 (cross-AI stress-test, model-side hallucination class)."
trigger_phrases:
  - "002-mcp-runtime-improvement-research"
  - "mcp runtime improvement deep research"
  - "memory layer remediation research"
  - "code graph remediation research"
  - "cocoindex mirror duplicates research"
  - "phantom fix verification research"
  - "deep research 10 iter mcp"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research"
    last_updated_at: "2026-04-27T08:25:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded 007 packet for 10-iter deep research"
    next_safe_action: "Dispatch /spec_kit:deep-research:auto with cli-codex gpt-5.5 high fast executor"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    completion_pct: 10
    open_questions:
      - "Will the deep-research skill expose an --executor parameter or will iteration prompts need to specify cli-codex inline?"
      - "Does convergence at iter < 10 close the loop early, or always run full 10?"
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: MCP Runtime Improvement Deep Research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-04-27 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Sibling Phases** | 005-memory-search-runtime-bugs (defect catalog source), 001-search-intelligence-stress-test (cross-AI stress-test source) |
| **Iteration Count** | 10 |
| **Executor** | cli-codex (gpt-5.5, reasoning effort high, service_tier fast, sandbox workspace-write) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two recent investigation packets (005 defects catalog and 006 cross-AI stress-test) surfaced a coherent set of MCP runtime defects spanning the memory layer, code graph, cocoindex mirror handling, intent classifier, and a new model-side hallucination class on weak retrieval signals. Source patches were claimed as landed for several P0 fixes, yet live MCP probes continue to show pre-fix behavior — implying phantom fixes (source compiled but not built into dist or daemon not restarted). A focused, autonomous, multi-iteration root cause and remediation investigation is required before scattered point fixes are attempted.

### Purpose
Run a 10-iteration deep research loop with cli-codex (gpt-5.5, high reasoning, fast tier) per iteration to investigate eight defect clusters, converge on root causes, document remediation strategies with reproducible verification probes, and produce a research markdown that downstream remediation packets (008-, 009-, etc.) can implement against.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Investigate eight defect clusters drawn from 005 and 006 findings (see Requirements Q1-Q8 below).
- Run 10 deep-research iterations via the canonical `/spec_kit:deep-research:auto` skill workflow.
- Each iteration dispatches its investigation via cli-codex with gpt-5.5, reasoning effort high, service_tier fast, sandbox workspace-write.
- Produce a synthesized research markdown documenting root causes, remediation strategies, verification probes, and recommended packet decomposition for downstream implementation.
- Cross-reference 005 REQ IDs (REQ-001..017 plus REQ-018/019 candidates) and 006 findings (v1.0.0 + v1.0.1 rubric) wherever a finding maps to a known defect.

### Out of Scope
- Implementing any of the discovered fixes (those land in subsequent packets 008-, 009-, etc., per orchestrator phase C).
- Modifying mcp_server source code directly (deep-research is read-only investigation).
- Re-running the 006 stress-test sweep (that data is fixed input).
- Adding new investigation surfaces beyond the eight clusters Q1-Q8.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| spec.md | Create | This research packet spec |
| plan.md | Create | Deep research workflow plan + iteration agenda |
| tasks.md | Create | Phase 1 scaffold to Phase 2 iterations to Phase 3 synthesis |
| implementation-summary.md | Create | Outcome summary placeholder until convergence |
| description.json | Create | Indexer metadata |
| graph-metadata.json | Create | Graph traversal metadata |
| research/ | Create | Skill-owned folder for iteration markdown, state, and final research markdown |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| Q1 | Diagnose phantom fix on 005 P0 Clusters 1-3 | Iteration converges on root cause (likely missing dist rebuild or daemon restart), produces reproducible probe showing pre-fix vs post-fix behavior, recommends remediation packet scope |
| Q2 | Diagnose cocoindex mirror-folder duplicates (005 REQ-018) | Identify why 10 results return the same chunk from .gemini, .claude, .codex mirrors; recommend exclude rules or canonical-source-only ranking |
| Q3 | Diagnose cocoindex source-vs-markdown ranking imbalance (005 REQ-019) | Identify why research markdown outranks implementation source on technical queries; recommend ranking weights or path-class boosting |
| Q4 | Diagnose model-side hallucination class on weak retrieval (006 I2 finding) | Document the class: when requestQuality=weak and recovery.suggestedQueries=[], models invent fake spec packets and file paths. Recommend stronger guardrail responses (refuse, require disambiguation) |
| Q5 | Diagnose memory_context wrapper truncation to count:0 at 2 percent budget (005 REQ-002) | Identify why direct memory_search returns hits but the wrapper drops to zero; recommend wrapper fix |
| Q6 | Diagnose empty code-graph recovery (005 REQ-017) | Identify why code-graph was empty during Q1/cli-opencode (4 min grep fallback); recommend warm-start or scan-on-empty trigger |
| Q7 | Diagnose lopsided causal-graph edge growth (005 REQ-010) | Identify why supersedes edges grew by 344 in 15 min while caused/supports stayed flat; recommend edge-class balancing or cap |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| Q8 | Investigate intent classifier improvements beyond 005 Cluster 2 fix | Address dual-classifier dissonance, paraphrase stability, and cross-CLI consistency findings from 005 REQ-001/004/016 |

### P2 - Refinement opportunities

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-A | Convergence detection should close loop early | If iterations 8-10 surface no new clusters, close at iter 10 anyway but mark "converged at iter N" |
| REQ-B | Cross-link to all source defects | Final research markdown maps every finding to a 005 REQ ID, 006 finding, or marks it NEW if novel |
<!-- /ANCHOR:requirements -->

---

### Acceptance Scenarios

**Given** the deep-research skill is invoked, **when** all 10 iterations complete or convergence triggers, **then** research/research.md contains synthesized findings for Q1-Q8 with root causes, remediation strategies, and verification probes.

**Given** the orchestrator reads research/research.md after convergence, **when** it begins phase C remediation, **then** every research finding maps to a recommended packet ID and scope.

**Given** any finding claims a fix is feasible, **when** the recommendation is read, **then** it includes a reproducible verification probe (curl, MCP call, or test command) demonstrating both the defect and the proposed fix.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Deep research converges (or completes 10 iterations) producing a research markdown with findings for all 8 sub-questions.
- **SC-002**: Each finding includes a root cause hypothesis, a recommended remediation strategy, and a reproducible verification probe.
- **SC-003**: Findings cross-reference all relevant 005 REQs and 006 findings; novel findings are explicitly marked.
- **SC-004**: Packet validates via validate.sh strict.
- **SC-005**: Phase C orchestrator can decompose findings into discrete remediation packets without further design work.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Deep-research skill default executor differs from cli-codex | Medium | Configure executor explicitly via skill parameter if exposed, otherwise embed cli-codex invocation guidance in iteration prompts |
| Risk | Convergence stalls before 10 iter | Low | Continue to 10-iter cap; final research markdown notes any unconverged areas |
| Risk | Iteration dispatches stall greater than 60 min | Medium | Orchestrator monitors and intervenes if stalled |
| Risk | Findings depend on live MCP daemon state which may be inconsistent | Medium | Each iteration documents the daemon snapshot context it queried |
| Dependency | 005-memory-search-runtime-bugs spec docs | High | Already on disk |
| Dependency | 001-search-intelligence-stress-test findings v1.0.0 + v1.0.1 | High | Just committed in Phase A |
| Dependency | cli-codex CLI installed and authenticated with gpt-5.5 access | High | Pre-flight check in iteration zero |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Will the deep-research skill expose an --executor parameter, or do iteration prompts need to specify cli-codex inline?
- Does convergence at iter less than 10 close the loop early, or does the skill always run the full 10?
- Should iteration zero include a pre-flight verifying cli-codex availability with gpt-5.5?
- How are eight sub-questions Q1-Q8 distributed across 10 iterations? (Likely 1 question per iter for Q1-Q8 then 2 synthesis iters at the end.)
<!-- /ANCHOR:questions -->
