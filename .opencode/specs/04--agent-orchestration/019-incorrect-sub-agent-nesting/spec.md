---
title: "Feature Specification: Sub-Agent Nesting Depth Control [019-incorrect-sub-agent-nesting/spec]"
description: "The orchestrator agent (Codex/ChatGPT provider) creates deeply nested sub-agent chains of 5+ levels when handling user requests, wasting tokens on orchestration overhead and pro..."
trigger_phrases:
  - "feature"
  - "specification"
  - "sub"
  - "agent"
  - "nesting"
  - "spec"
  - "019"
  - "incorrect"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Sub-Agent Nesting Depth Control

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The orchestrator agent (Codex/ChatGPT provider) creates deeply nested sub-agent chains of 5+ levels when handling user requests, wasting tokens on orchestration overhead and producing no additional value beyond depth 3. This spec defines an explicit **Nesting Depth Protocol (NDP)** that classifies every agent as either an ORCHESTRATOR or LEAF, enforces an absolute maximum depth of 3, and adds depth-tracking to every dispatch.

**Key Decisions**: Absolute max depth = 3 (Orchestrator > Dispatcher > Leaf); agents classified by tier with hard LEAF enforcement.

**Critical Dependencies**: All three orchestrate.md variants (base, chatgpt, copilot) must be updated simultaneously.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-02-17 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

When the orchestrator agent runs via Codex (ChatGPT provider), it creates deeply nested sub-agent chains — often 5 levels deep — because no mechanism enforces a maximum total depth across the entire call chain. The existing "Maximum 2 levels" rule in Section 4 only applies to sub-*orchestrators*, not to the total dispatch depth. Meanwhile, @context internally dispatches @explore/@research (adding a level), and sub-orchestrators can dispatch agents that themselves dispatch more agents, creating unbounded nesting.

The root causes are:
1. **No absolute depth counter** — dispatches don't carry "you are at depth N" metadata
2. **No LEAF classification** — agents don't know they are terminal and must not nest further
3. **Sub-orchestrator rule (max 2) counts differently from total depth** — allowing Orchestrator > Sub-Orchestrator > @context > @explore = 4 levels before any work happens
4. **Conflicting nesting caps** — base/chatgpt say max 2, copilot says max 3 (Section 11)

### Purpose

Every sub-agent dispatch must include explicit depth tracking, and no agent chain should ever exceed 3 levels from the orchestrator to the deepest leaf. This eliminates wasted tokens, reduces latency, and produces clearer, more direct task execution.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Define the Nesting Depth Protocol (NDP) with agent tier classification
- Add a `depth` parameter to every dispatch template in orchestrate.md
- Classify all agents as ORCHESTRATOR, DISPATCHER, or LEAF
- Harmonize nesting rules across base, chatgpt, and copilot orchestrate.md variants
- Add a new anti-pattern entry for depth violations
- Update Section 4 (Sub-Orchestrator Pattern) with absolute depth rules
- Update Section 10 (Task Decomposition Format) with depth field

### Out of Scope
- Modifying agent definition files (context.md, speckit.md, etc.) — future spec
- Runtime depth enforcement via code/tooling — future spec
- Changing the Two-Tier Dispatch Model (Phase 1/Phase 2) — preserved as-is

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agent/orchestrate.md` | Modify | Add NDP section, update Section 4/10/24 |
| `.opencode/agent/chatgpt/orchestrate.md` | Modify | Same changes as base |
| `.opencode/agent/copilot/orchestrate.md` | Modify | Same changes + fix Section 11 conflict |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define 3-tier agent classification (ORCHESTRATOR, DISPATCHER, LEAF) with clear membership | Every agent in the routing table is classified with its tier |
| REQ-002 | Establish absolute maximum depth of 3 for any dispatch chain | Rule stated in Section 4 with enforcement logic |
| REQ-003 | Add `Depth` field to Task Decomposition Format (Section 10) | Template updated with depth tracking |
| REQ-004 | Add anti-pattern for depth violations (Section 24) | New anti-pattern entry with detection signals |
| REQ-005 | Harmonize nesting rules across all 3 orchestrate.md files | No conflicting depth caps between variants |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Add depth-aware dispatch instruction to Sub-Orchestrator Pattern | Section 4 includes depth inheritance rule |
| REQ-007 | Add LEAF enforcement instruction to all leaf agent dispatches | Leaf agents told they MUST NOT spawn sub-agents |
| REQ-008 | Document the legal vs illegal nesting paths with examples | Clear examples of 3-level legal chain and 5-level illegal chain |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All three orchestrate.md files contain identical NDP rules (no conflicting depth caps)
- **SC-002**: Every agent in the routing table (Section 3) has a TIER classification
- **SC-003**: Task Decomposition Format (Section 10) includes `Depth` field
- **SC-004**: At least one anti-pattern in Section 24 covers depth violations
- **SC-005**: Legal and illegal nesting chain examples are documented with visual diagrams
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | All 3 orchestrate.md files must stay synchronized | Drift causes recurring nesting bugs | Single source of truth section, copied to variants |
| Risk | Overly strict depth limits may prevent @context from dispatching @explore | High — breaks exploration workflow | @context classified as DISPATCHER (allowed 1 sub-dispatch) |
| Risk | Codex may ignore depth instructions in practice | Medium — behavioral, not structural | Add depth to every dispatch template so it's always visible |
| Risk | Existing sub-orchestrator workflows may break | Low — sub-orchestrator is rarely used for simple tasks | Sub-orchestrator becomes depth-1 ORCHESTRATOR, inherits remaining depth budget |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No additional token overhead per dispatch beyond ~20 tokens (the depth field itself)

### Reliability
- **NFR-R01**: Depth enforcement must be visible in every dispatch, not rely on agent memory

### Maintainability
- **NFR-M01**: NDP section should be self-contained and referenceable by section number
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Depth Budget Exhaustion
- Agent at depth 3 receives a task requiring sub-dispatch: MUST execute directly or return "cannot complete at this depth — escalate to parent"

### Sub-Orchestrator at Depth 1
- Sub-orchestrator receives depth=1, dispatches agent at depth=2, agent needs sub-dispatch: Agent is at max depth and must be LEAF

### @context Dispatching @explore
- @context is DISPATCHER (depth cost = 1), @explore is LEAF (depth cost = 1): Total chain = Orchestrator(0) > @context(1) > @explore(2) = legal (depth 2, under max 3)

### Parallel Dispatch at Same Depth
- Multiple agents dispatched at the same depth level: All share the same depth counter, do not increment for siblings
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | Files: 3, LOC: ~100 edits, Systems: orchestrate.md variants |
| Risk | 12/25 | Breaking: possible if too strict, Multi-file sync: yes |
| Research | 10/20 | Must analyze current nesting behavior deeply |
| Multi-Agent | 5/15 | Workstreams: 1 (documentation-only change) |
| Coordination | 8/15 | Dependencies: 3 files must stay synchronized |
| **Total** | **50/100** | **Level 3** (architecture decision + multi-file sync) |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Too-strict depth cap breaks @context > @explore chain | H | L | DISPATCHER tier allows 1 level of sub-dispatch |
| R-002 | Codex ignores depth field in dispatch prompts | M | M | Embed depth in multiple places (PDR, task format, agent instruction) |
| R-003 | Three files drift out of sync after future edits | M | H | Add sync verification to checklist, reference canonical section |
| R-004 | Sub-orchestrator pattern becomes unusable | L | L | Sub-orchestrator inherits parent's remaining depth budget |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Orchestrator Respects Depth Limit (Priority: P0)

**As a** user issuing a request via Codex, **I want** the orchestrator to complete my task within 3 levels of nesting, **so that** I don't waste tokens and time on unnecessary orchestration overhead.

**Acceptance Criteria**:
1. Given a request that triggers the orchestrator, When the orchestrator decomposes tasks, Then no dispatch chain exceeds depth 3
2. Given a sub-orchestrator dispatch, When it receives depth=1, Then it can only dispatch leaf agents (depth=2), not further sub-orchestrators

---

### US-002: Leaf Agents Refuse to Nest (Priority: P0)

**As a** system administrator, **I want** leaf agents (@general, @write, @review, @debug, @speckit, @handover, @explore, @research) to explicitly refuse sub-agent dispatch, **so that** nesting cannot grow unbounded.

**Acceptance Criteria**:
1. Given a leaf agent dispatch at depth 2+, When the agent is instructed to spawn a sub-agent, Then it executes directly or escalates to parent

---

### US-003: Depth Counter in Every Dispatch (Priority: P1)

**As an** AI system designer, **I want** every dispatch to include an explicit `Depth: N` field, **so that** receiving agents always know their position in the nesting chain.

**Acceptance Criteria**:
1. Given the Task Decomposition Format, When a dispatch is created, Then it includes `Depth: [0|1|2|3]`
2. Given a PDR block, When reasoning about dispatch, Then depth is included and validated against max

---

### US-004: Synchronized Rules Across Variants (Priority: P1)

**As a** maintainer of OpenCode agent definitions, **I want** all three orchestrate.md variants to have identical NDP rules, **so that** behavior is consistent regardless of provider.

**Acceptance Criteria**:
1. Given the base, chatgpt, and copilot orchestrate.md files, When NDP section is compared, Then all three are identical
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None — requirements are clear from observed behavior and document analysis.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 SPEC
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
