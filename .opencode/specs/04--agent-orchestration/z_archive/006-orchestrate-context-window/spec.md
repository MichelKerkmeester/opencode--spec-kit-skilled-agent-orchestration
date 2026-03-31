---
title: "Feature Specification: Orchestrate Agent [04--agent-orchestration/z_archive/006-orchestrate-context-window/spec]"
description: "The orchestrate agent (orchestrate.md) can dispatch up to 20 sub-agents in parallel but has zero protection against its own context window overflow. When all agents return simul..."
trigger_phrases:
  - "feature"
  - "specification"
  - "orchestrate"
  - "agent"
  - "context"
  - "spec"
  - "006"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: Orchestrate Agent Context Window Protection

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.0 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The orchestrate agent (`orchestrate.md`) can dispatch up to 20 sub-agents in parallel but has **zero protection against its own context window overflow**. When all agents return simultaneously, their combined output floods the orchestrator's context, causing unrecoverable "Context limit reached" errors and failed compaction. This spec defines a Context Window Budget system that constrains result collection to prevent overflow.

**Key Decisions**: File-based result collection for large dispatches; batched wave pattern for 5+ agents

**Critical Dependencies**: Changes to `orchestrate.md` only (single-file modification)

<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-02-06 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The orchestrate agent (`.opencode/agent/orchestrate.md`) instructs dispatching "up to 20 agents" in parallel (Section 13, 25) and budgets sub-agent tokens (Section 9) but has **no mechanism to track or limit the orchestrator's own context consumption**. When 20 agents each return ~2-8K tokens, the combined ~100K+ tokens of results exceed the context window, producing the failure shown in the user's screenshot: every agent completes successfully, but the orchestrator cannot collect any results.

### Root Cause Analysis

| Component | What it does | What it misses |
|-----------|-------------|----------------|
| Section 9 (Resource Budgeting) | Limits sub-agent token output | Does NOT limit orchestrator's context intake |
| Section 13 (Parallel-First) | "DEFAULT TO PARALLEL" | No ceiling on parallel result volume |
| Section 21 (Context Preservation) | Suggests handover when "approaching limits" | Reactive, not preventive; by then it's too late |
| Section 25 (Scaling Heuristics) | "10+ agents for comprehensive investigation" | No guidance on result size management |
| Section 5 (Sub-Orchestrator) | For >10 tasks, spawn sub-orchestrator | Sub-orchestrator results still flow back to parent |

**Failure sequence observed:**
```
1. User requests comprehensive analysis → Orchestrator decomposes into 20 tasks
2. 20 agents dispatched in parallel → All complete successfully
3. All 20 results attempt to enter orchestrator context simultaneously
4. Context window exceeded → "Context limit reached" on every result
5. /compact fails → "Conversation too long"
6. Orchestrator is dead → All work lost despite agents completing
```

### Purpose

Add a **Context Window Budget (CWB)** system to `orchestrate.md` that prevents the orchestrator from exceeding its own context window when collecting sub-agent results, ensuring successful synthesis even at maximum agent scale.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New section in `orchestrate.md`: Context Window Budget system
- Modifications to Section 9 (Resource Budgeting): Add orchestrator self-budget
- Modifications to Section 13 (Parallel-First): Add context-aware ceiling
- Modifications to Section 25 (Scaling Heuristics): Add result size estimates
- New dispatch patterns: file-based collection, batched waves, summary-only returns

### Out of Scope
- Changes to Claude Code's underlying context window size - [platform limitation]
- Changes to the Task tool's behavior - [external tool, not ours]
- Changes to other agent definitions - [separate spec]
- Any MCP server code changes - [different domain]

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agent/orchestrate.md` | Modify | Add CWB system, modify Sections 5, 9, 13, 21, 25 |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Context Window Budget section with explicit token math | Section includes formula: `max_parallel = (budget - overhead) / result_size` |
| REQ-002 | Mandatory result size constraints in task dispatch format | Section 11 dispatch format includes `Output Size` field with max line/token count |
| REQ-003 | File-based collection pattern for 5+ agent dispatches | New pattern documented with scratchpad file paths and summary-only returns |
| REQ-004 | Batched wave collection strategy | Wave sizes calculated from CWB, sequential collection documented |
| REQ-005 | Anti-pattern documentation for what caused the failure | Explicit "DO NOT dispatch 20 agents without CWB" warning |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Background agent dispatch pattern | `run_in_background: true` pattern documented for large-scale analysis |
| REQ-007 | Progressive synthesis protocol | Collect-batch → synthesize → compress → next-batch workflow |
| REQ-008 | Sub-orchestrator context isolation | Sub-orchestrators synthesize before returning to parent |
| REQ-009 | Updated scaling heuristics with result size estimates | Table includes expected token output per agent type |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An orchestrator following the updated agent definition can dispatch 20 agents for comprehensive analysis WITHOUT hitting context limits
- **SC-002**: The dispatch format (Section 11) includes mandatory output size constraints
- **SC-003**: The document explicitly addresses the "20 agent simultaneous return" failure mode
- **SC-004**: File-based and wave-based collection patterns are unambiguous and actionable

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | LLM may not perfectly follow CWB rules | Medium | Multiple enforcement points: dispatch format, scaling heuristics, anti-patterns |
| Risk | File-based pattern adds complexity | Low | Provide copy-paste examples, not just concepts |
| Risk | Wave batching may slow down parallel work | Low | Only triggered for 5+ agents; smaller dispatches remain parallel |
| Dependency | Task tool `run_in_background` parameter | Low | Already available in Claude Code |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
<!-- ANCHOR:requirements -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Wave batching should not add more than 1 extra round-trip per 5 agents

### Reliability
- **NFR-R01**: Context window must never be exhausted during normal orchestration (the primary goal)

### Maintainability
- **NFR-M01**: New sections integrate naturally into existing document structure (no restructuring)

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
<!-- /ANCHOR:requirements -->
## 8. EDGE CASES

### Data Boundaries
- Single agent dispatch: CWB overhead is negligible, no wave batching needed
- 2-4 agents: Direct collection still safe, CWB validates but doesn't restrict
- 5-9 agents: Summary-only returns recommended, file-based optional
- 10-20 agents: File-based collection MANDATORY, wave batching MANDATORY

### Error Scenarios
- Agent writes to file but file is empty/corrupt: Orchestrator detects and re-dispatches
- Wave 1 results already fill 80% context: Stop dispatching, synthesize what we have, report to user
- Background agent times out: Follow existing timeout handling (Section 16)

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 1, LOC: ~150 additions, Systems: 1 |
| Risk | 12/25 | Breaking change to orchestration behavior, AI compliance uncertainty |
| Research | 10/20 | Root cause analysis complete, solution patterns understood |
| Multi-Agent | 15/15 | This IS the multi-agent coordination fix |
| Coordination | 5/15 | Single file, no cross-system dependencies |
| **Total** | **50/100** | **Level 3 (elevated to 3+ for governance)** |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | LLM ignores CWB rules under "parallel-first" bias | H | M | Multiple reinforcement: dispatch format, scaling table, anti-pattern warning |
| R-002 | File-based pattern too complex for LLM to follow | M | L | Concrete examples with exact file paths |
| R-003 | Wave batching eliminates parallelism benefits | L | L | Only for 5+ agents; most tasks use <5 |
| R-004 | Existing sections contradict new CWB rules | M | M | Explicitly update Sections 9, 13, 25 to reference CWB |

<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Large-Scale Analysis (Priority: P0)

**As a** user requesting comprehensive codebase analysis, **I want** the orchestrator to dispatch many agents without crashing, **so that** I receive a complete synthesis of findings.

**Acceptance Criteria**:
1. Given a request requiring 20 agent dispatches, When the orchestrator decomposes and dispatches, Then all results are collected without "Context limit reached"
2. Given 20 completed agents, When results are collected, Then the orchestrator produces a unified synthesis

### US-002: Progressive Results (Priority: P1)

**As a** user waiting for a large analysis, **I want** to see progressive results as waves complete, **so that** I can provide feedback early without waiting for all 20 agents.

<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:approval-workflow -->
## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | Michel | Pending | |
| Implementation Review | Michel | Pending | |

<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance -->
## 13. COMPLIANCE CHECKPOINTS

### Code Compliance
- [ ] orchestrate.md follows existing document structure
- [ ] New sections use consistent formatting with existing sections
- [ ] No contradictions introduced with existing rules

<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:stakeholders -->
## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Michel | User/Developer | High | Direct conversation |

<!-- /ANCHOR:stakeholders -->

---

<!-- ANCHOR:changelog -->
## 15. CHANGE LOG

### v1.0 (2026-02-06)
**Initial specification** - Root cause analysis and solution design for orchestrate agent context window overflow

<!-- /ANCHOR:changelog -->

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS

- Q1: Should the CWB numbers be hardcoded or parameterized? (Recommendation: hardcoded defaults with override syntax)
- Q2: Should file-based collection be mandatory at 5 or 8 agents? (Recommendation: 5, conservative)

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
